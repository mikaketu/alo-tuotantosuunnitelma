// Tri-state trigger evaluator over a facts object.
//
// A trigger is data from rules.json:
//   true | { all: [...] } | { any: [...] } | { not: t } | { f, eq } | { f, ne } | { f, in } | { f, ge }
// A fact is a scalar, a list of strings, or the reserved string 'pending'
// ('a venue answer that does not exist yet'). Evaluation returns
// true | false | 'pending'. Leaves on 'pending' facts are pending, except `ne`,
// which passes (the prototype's `!vh()` and condition_eval's `!=`-on-absent).
export const PENDING = 'pending';

export function AND(xs) { return xs.some((x) => x === false) ? false : xs.some((x) => x === PENDING) ? PENDING : true; }
export function OR(xs) { return xs.some((x) => x === true) ? true : xs.some((x) => x === PENDING) ? PENDING : false; }
export function NOT(x) { return x === PENDING ? PENDING : !x; }

function leaf(t, facts) {
  const v = facts[t.f];
  if (v === undefined) throw new Error(`unknown fact "${t.f}" in trigger`);
  if ('ne' in t) return v === PENDING ? true : Array.isArray(v) ? !v.includes(t.ne) : v !== t.ne;
  if (v === PENDING) return PENDING;
  if ('eq' in t) return Array.isArray(v) ? v.includes(t.eq) : v === t.eq;
  if ('in' in t) return Array.isArray(v) ? v.some((x) => t.in.includes(x)) : t.in.includes(v);
  if ('ge' in t) return typeof v === 'number' && v >= t.ge;
  throw new Error(`malformed leaf ${JSON.stringify(t)}`);
}

export function evalTrigger(t, facts) {
  if (t === true) return true;
  if (t === false) return false;
  if (t.all) return AND(t.all.map((x) => evalTrigger(x, facts)));
  if (t.any) return OR(t.any.map((x) => evalTrigger(x, facts)));
  if (t.not) return NOT(evalTrigger(t.not, facts));
  return leaf(t, facts);
}

/** The leaves that make a true trigger true: every leaf of an `all`, the
 *  satisfied branches of an `any`. Returns [] for `true` (a base row). */
export function explainTrigger(t, facts) {
  if (t === true || t === false) return [];
  if (t.all) return t.all.flatMap((x) => explainTrigger(x, facts));
  if (t.any) return t.any.filter((x) => evalTrigger(x, facts) === true).flatMap((x) => explainTrigger(x, facts));
  if (t.not) return [{ f: t.not.f, value: facts[t.not.f], want: wanted(t.not), negated: true }];
  return [{ f: t.f, value: facts[t.f], want: wanted(t, facts[t.f]), negated: 'ne' in t }];
}

/** The values a leaf asks for — the wording of a why line ("ohjelma: livemusiikki"). */
function wanted(t, v) {
  if ('eq' in t) return [t.eq];
  if ('ne' in t) return [t.ne];
  if ('in' in t) return Array.isArray(v) ? t.in.filter((x) => v.includes(x)) : t.in.includes(v) ? [v] : t.in;
  if ('ge' in t) return [t.ge];
  return [];
}

/** The leaves that are still unanswered in a pending trigger. */
export function pendingLeaves(t, facts) {
  if (t === true || t === false) return [];
  if (t.all || t.any) return (t.all || t.any).filter((x) => evalTrigger(x, facts) === PENDING).flatMap((x) => pendingLeaves(x, facts));
  if (t.not) return pendingLeaves(t.not, facts);
  return facts[t.f] === PENDING ? [{ f: t.f }] : [];
}

/** Every fact name a trigger references (for integrity tests and default-owner derivation). */
export function factsIn(t, out = new Set()) {
  if (t === true || t === false) return out;
  if (t.all || t.any) (t.all || t.any).forEach((x) => factsIn(x, out));
  else if (t.not) factsIn(t.not, out);
  else out.add(t.f);
  return out;
}
