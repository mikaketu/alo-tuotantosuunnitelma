// rows → tasks: the rule table's rows evaluated against the facts, with dates,
// phases, default owners and a why-object per task.
import { evalTrigger, explainTrigger, pendingLeaves, factsIn, PENDING } from './trigger.js';
import { factsOf, FACT_CARDS } from './facts.js';
import { parseIso, toIso, addDays, diffDays } from './dates.js';

const PHASE_IDX = { P1: 0, P2: 1, P3: 2, P4: 3, P5: 4 };

export function phaseDates(today, E, Elast, R) {
  const p2 = addDays(E, -Math.round(R / 2));
  return [today, p2, R < 42 ? p2 : addDays(E, -21), addDays(E, -7), addDays(Elast, 7)];
}
/** The event-week phase runs to the LAST event day (Elast): day 2 of a multi-day event is not "after". */
export function phaseOf(d, PH, Elast) {
  if (d < PH[1]) return 0; if (d < PH[2]) return 1; if (d < PH[3]) return 2; if (d <= Elast) return 3; return 4;
}

/** Fold deck/type scoping into one trigger so the evaluator has a single path. */
export function scopedTrigger(row) {
  const parts = [];
  if (row.deck && row.deck !== 'both') parts.push({ f: 'deck', eq: row.deck });
  if (row.type) parts.push({ f: 'type', eq: row.type });
  if (row.trigger !== true) parts.push(row.trigger);
  return parts.length === 0 ? true : parts.length === 1 ? parts[0] : { all: parts };
}

/** Facts with every venue capability set to "no" — "the same event as if the venue lacked it". */
function asIfVenueLacks(facts) {
  const f = { ...facts };
  for (const k of Object.keys(f)) if (k.startsWith('venue.') && f[k] !== 'na') f[k] = 'no';
  return f;
}
function venueTermsHit(row, facts) {
  return [...factsIn(scopedTrigger(row))].filter((n) => n.startsWith('venue.'));
}

/** Cards (by id) whose answers a trigger depends on, through derived facts. */
export function cardsBehind(rules, trigger) {
  const out = new Set();
  const walk = (name) => {
    if (FACT_CARDS[name]) out.add(FACT_CARDS[name]);
    else if (name.startsWith('venue.')) out.add(`v_${name.slice(6)}`);
    else if (rules.derived[name]) factsIn(rules.derived[name]).forEach(walk);
  };
  factsIn(trigger).forEach(walk);
  return out;
}

function classify(rules, row, leaves) {
  if (leaves.length === 0) return 'base';
  if (leaves.some((l) => l.f === 'profile')) return 'profile';
  if (leaves.some((l) => l.f === 'head' || l.f === 'headcount' || l.f === 'head_ge_200' || l.f === 'head_near_200')) return 'headcount';
  if (leaves.every((l) => l.f === 'deck')) return 'base';
  if (leaves.every((l) => l.f === 'deck' || l.f === 'type' || l.f === 'family')) return 'type';
  return 'answered';
}

export function tasksFor(rules, plan, today) {
  const cover = plan.cover;
  const facts = factsOf(rules, cover, plan.answers, today);
  const E = parseIso(cover.date);
  const Elast = plan.answers.performances === 'several' && plan.answers.lastDate ? parseIso(plan.answers.lastDate) : E;
  const R = facts.runway;
  const PH = phaseDates(today, E, Elast, R);
  // The venue card says where, it hands nothing over: never an ↑ card for ownership.
  const upCards = facts.venue_cards.filter((c) => c !== 'venue');
  const profSet = new Set(facts.profile);
  const lackFacts = asIfVenueLacks(facts);
  const tasks = [];
  const suppressed = [];
  const catOrder = Object.fromEntries(rules.categories.map((c, i) => [c, i]));

  for (const row of rules.rows) {
    const trig = scopedTrigger(row);
    const fired = evalTrigger(trig, facts);
    if (fired === false) {
      // A suggested service the venue already covers: not in the plan, listed as "the venue handles it".
      if (facts.venue === 'own' && profSet.has(row.service) && evalTrigger(trig, lackFacts) === true) {
        const hits = venueTermsHit(row, facts).filter((n) => facts[n] === 'yes');
        if (hits.length) suppressed.push({ id: row.id, row: row.id, cat: row.cat, service: row.service, because: hits.map((n) => ({ f: n, value: 'yes' })) });
      }
      continue;
    }
    const ids = expand(row, plan, facts, E, Elast);
    for (const { id, date: repeatDate, variantFacts } of ids) {
      const t = { id, row: row.id, cat: row.cat, phase: 0, date: null, dateEnd: null, fixed: false, statutory: false, statute: null,
        notice: null, earliest: null, late: false, pending: fired === PENDING, unknown: false, prepareSign: row.owner === 'prepare_sign',
        locked: !!row.locked, service: row.service || null, variant: null, def: 'me', owner: 'me', done: !!plan.done[id], why: null,
        sustainable: !!row.sustainable, uncounted: !!row.uncounted, notes: [] };
      // deadline: the first `deadlineIf` whose `when` holds replaces the row's own (P-30:
      // police notice two weeks ahead outdoors, contact at the start for big / multi-day events).
      const alt = (row.deadlineIf || []).find((d) => evalTrigger(d.when, facts) === true);
      const dl = alt ? alt.deadline : row.deadline;
      if (alt && alt.note) t.notes.push(alt.note);
      if (repeatDate) { t.date = repeatDate; t.fixed = true; t.phase = phaseOf(repeatDate, PH, Elast); }
      else if (dl.fixed) {
        const base = dl.fixed.offset < 0 ? Elast : E;
        t.date = addDays(base, -dl.fixed.offset); t.fixed = true; t.statutory = dl.fixed.kind === 'statutory'; t.statute = dl.fixed.statute || null;
        t.phase = phaseOf(t.date, PH, Elast); if (dl.fixed.earliest_offset) t.earliest = addDays(E, -dl.fixed.earliest_offset);
        if (!t.pending && t.date < today) t.late = true;
      } else {
        t.phase = PHASE_IDX[dl.phase]; t.date = PH[t.phase]; if (dl.phase_end) t.dateEnd = PH[PHASE_IDX[dl.phase_end]];
        if (dl.notice) { t.notice = { date: addDays(E, -dl.notice.offset), statute: dl.notice.statute }; t.statutory = true; t.statute = dl.notice.statute; }
        if (t.date < today) t.date = today;
      }
      if (t.pending) { t.date = null; }
      // variant
      if (row.variants) for (const v of row.variants) if (evalTrigger(v.when, variantFacts || facts) === true) { t.variant = v.key; break; }
      // unknown: a venue term satisfied by an "en tiedä"
      t.unknown = venueTermsHit(row, facts).some((n) => facts.venue_unknown.includes(n.slice(6)));
      // default owner: the visitor's, unless a card behind the row was swiped up (the venue handles it)
      const behind = cardsBehind(rules, trig);
      const up = [...behind].some((c) => upCards.includes(c));
      t.def = t.locked ? 'me' : up ? 'venue' : 'me';
      t.owner = t.locked ? 'me' : plan.owners[id] || t.def;
      if (row.id === 'P-32' && facts.venue === 'own' && facts['venue.host'] === 'no') t.notes.push('noVenueSecurity');
      // why
      const leaves = fired === PENDING ? [] : explainTrigger(trig, facts);
      t.why = {
        kind: t.pending ? 'pending' : classify(rules, row, leaves),
        leaves,
        pending: t.pending ? pendingLeaves(trig, facts) : [],
        removeIf: t.pending ? [] : leaves.filter((l) => l.f !== 'deck' && l.f !== 'type' && l.f !== 'family' && l.f !== 'profile'),
        cards: [...behind],
        upCards: [...behind].filter((c) => upCards.includes(c)),
      };
      tasks.push(t);
    }
  }
  tasks.sort((p, q) => {
    const pd = p.date ? p.date.getTime() : Infinity, qd = q.date ? q.date.getTime() : Infinity;
    return (pd - qd) || (p.phase - q.phase) || (catOrder[p.cat] - catOrder[q.cat]) || p.id.localeCompare(q.id);
  });
  return { facts, tasks, suppressed, PH, E, Elast, R };
}

/** Generative rows: one task per performance day (cap 7) or per "en tiedä". */
function expand(row, plan, facts, E, Elast) {
  if (row.repeat === 'performance_dates') {
    const out = []; let n = 0;
    for (let d = E; d <= Elast && n < 7; d = addDays(d, 1), n++) out.push({ id: `${row.id}@${toIso(d)}`, date: d });
    return out.length ? out : [{ id: `${row.id}@${toIso(E)}`, date: E }];
  }
  if (row.repeat === 'venue_unknown') return facts.venue_unknown.map((k) => ({ id: `${row.id}:${k}` }));
  return [{ id: row.id }];
}

export function phasesFor(result, today) {
  const { tasks, PH, E, Elast, R } = result;
  const two = R < 42;
  const P = two
    ? [{ key: 'now', from: today, to: addDays(E, -8), ph: [0, 1, 2] }, { key: 'eventweek', from: addDays(E, -7), to: addDays(Elast, 60), ph: [3, 4] }]
    : [{ key: 'now', from: today, to: addDays(PH[1], -1), ph: [0] }, { key: 'midway', from: PH[1], to: addDays(PH[2], -1), ph: [1] },
       { key: 'threeweeks', from: PH[2], to: addDays(E, -8), ph: [2] }, { key: 'eventweek', from: addDays(E, -7), to: Elast, ph: [3] },
       { key: 'after', from: addDays(Elast, 1), to: addDays(Elast, 14), ph: [4] }];
  for (const p of P) p.tasks = [];
  for (const t of tasks) (P.find((p) => p.ph.includes(t.phase)) || P[P.length - 1]).tasks.push(t);
  return { phases: P, two, R };
}
