// Trigger trees and why-objects → text, from the copy table. Shared by the
// visitor's why lines and the rules page, so both say the same thing.
// Interpolation happens only in colon/list position with nominative labels.
import { ts, has } from '../copy/ts.js';
import { FACT_CARDS } from './facts.js';

function cardLabel(cardId) { return ts(`card.${cardId}.label`); }

/** Label for one fact value, e.g. programme → 'livemusiikki'. */
export function valueLabel(f, value) {
  const card = FACT_CARDS[f];
  if (card && has(`card.${card}.opt.${value}`)) return ts(`card.${card}.opt.${value}`);
  if (f.startsWith('venue.')) return value === 'no' ? ts('value.no') : value === 'yes' ? ts('value.yes') : String(value);
  if (f === 'head') return ts(`head.h${value}`);
  if (f === 'type') return ts(`type.${value}`);
  if (f === 'family') return ts(`family.${value}`);
  if (f === 'deck') return ts(`deck.${value}`);
  if (f === 'profile') return ts(`service.${value}`);
  if (f === 'runway') return `${value}`;
  if (value === true) return ts('value.yes');
  if (value === false) return ts('value.no');
  if (has(`value.${value}`)) return ts(`value.${value}`);
  return String(value);
}

/** Label for a fact in colon position: 'ohjelma', 'tila', 'äänentoisto'. */
export function factLabel(f) {
  if (FACT_CARDS[f]) return cardLabel(FACT_CARDS[f]);
  if (f.startsWith('venue.')) return ts(`venue.${f.slice(6)}`);
  return ts(`fact.${f}`);
}

/** One satisfied leaf → "ohjelma: livemusiikki" / "tilassa ei ole: äänentoisto". */
export function leafText(leaf) {
  const { f, want = [], negated } = leaf;
  if (f.startsWith('venue.')) {
    const thing = ts(`venue.${f.slice(6)}`);
    const w = want[0];
    if (w === 'no') return negated ? ts('rule.venueYes', { thing }) : ts('rule.venueNo', { thing });
    return negated ? ts('rule.venueNo', { thing }) : ts('rule.venueYes', { thing });
  }
  if (f === 'deck') return ts(`rule.deck.${want[0]}`);
  const derived = !FACT_CARDS[f] && !['head', 'type', 'family', 'deck', 'profile', 'runway'].includes(f);
  if (derived && want.length === 1 && want[0] === true) return negated ? ts('rule.leafNot', { fact: ts(`fact.${f}`), value: ts('value.yes') }) : ts(`fact.${f}`);
  const values = want.map((w) => valueLabel(f, w)).join(ts('rule.or'));
  if (negated) return ts('rule.leafNot', { fact: factLabel(f), value: values });
  if (f === 'head' && typeof want[0] === 'number' && !FACT_CARDS[f] && leaf.ge) return ts('rule.leafAtLeast', { fact: factLabel(f), value: values });
  return ts('rule.leaf', { fact: factLabel(f), value: values });
}

/** Whole trigger → Finnish sentence fragment (staff rules page). */
export function triggerText(t) {
  if (t === true) return ts('rule.always');
  if (t.all) return t.all.map((x) => wrap(x, triggerText(x))).join(ts('rule.and'));
  if (t.any) return t.any.map((x) => wrap(x, triggerText(x))).join(ts('rule.or'));
  if (t.not) return ts('rule.not', { x: triggerText(t.not) });
  return leafText({ f: t.f, want: 'eq' in t ? [t.eq] : 'ne' in t ? [t.ne] : 'in' in t ? t.in : [t.ge], negated: 'ne' in t, ge: 'ge' in t });
}
function wrap(t, s) { return t.all || t.any ? `(${s})` : s; }

function fmtDate(d) { return d instanceof Date ? `${d.getDate()}.${d.getMonth() + 1}.` : String(d); }

/** The lines shown under a task ("Miksi tämä on täällä?"). Returns an array of strings. */
export function whyLines(task, ctx) {
  const w = task.why;
  const out = [];
  if (task.row === 'V-00') { out.push(ts('why.venueUnknown', { card: cardLabel(`v_${task.id.split(':')[1]}`) })); out.push(ts('why.locked')); out.push(ts('why.rule', { id: task.row })); return out; }
  if (w.kind === 'pending') out.push(ts('why.pending', { questions: w.pending.map((l) => factLabel(l.f)).join(', ') }));
  else if (w.kind === 'base') out.push(ts(ctx.deck === 'public' ? 'why.base.public' : ctx.deck === 'closed' ? 'why.base.closed' : 'why.base'));
  else if (w.kind === 'type') out.push(ts('why.type', { type: ts(`type.${ctx.type}`) }));
  else if (w.kind === 'profile') out.push(ts('why.profile', { service: w.leaves.filter((l) => l.f === 'profile').map((l) => valueLabel('profile', l.want[0])).join(', ') }));
  else if (w.kind === 'headcount') out.push(ts('why.headcount', { head: ctx.headcount }));
  else out.push(ts('why.answered', { answers: w.leaves.filter((l) => l.f !== 'deck' && l.f !== 'type' && l.f !== 'family').map(leafText).join('; ') }));
  // A row's own reason (the SU rows: why the sustainable choice pays).
  if (has(`why.${task.row}`)) out.push(ts(`why.${task.row}`));
  if (w.kind === 'profile' && w.leaves.some((l) => l.f.startsWith('venue.'))) out.push(ts('why.answered', { answers: w.leaves.filter((l) => l.f.startsWith('venue.')).map(leafText).join('; ') }));
  if (task.unknown) out.push(ts('why.unknown'));
  const venueRm = w.removeIf.filter((l) => l.f.startsWith('venue.') && l.want[0] === 'no' && !l.negated);
  const otherRm = w.removeIf.filter((l) => !l.f.startsWith('venue.') && !['head', 'headcount', 'head_ge_200', 'head_near_200'].includes(l.f));
  if (venueRm.length) out.push(ts('why.removeIfVenue', { things: venueRm.map((l) => ts(`venue.${l.f.slice(6)}`)).join(', ') }));
  if (otherRm.length) { const cards = [...new Set(otherRm.flatMap((l) => cardsOf(l.f, ctx.rules)))]; if (cards.length) out.push(ts('why.removeIfAnswer', { cards: cards.map(cardLabel).join(', ') })); }
  if (task.statutory && task.statute) out.push(`${ts('why.statute', { statute: ts(`statute.${task.statute}.label`) })} (${ts('why.statute.reviewed', { date: ctx.rules.statutes[task.statute].reviewed })}). ${ts('why.statute.caveat')}`);
  if (task.statutory && task.statute) out.push(ts(`statute.${task.statute}.note`));
  if (task.fixed && !task.statutory && !task.pending && task.row !== 'X-96') out.push(ts('why.contractual'));
  if (task.fixed && !task.pending && task.date && ctx.E && task.row !== 'X-96') { const n = Math.round((ctx.E - task.date) / 86400000); out.push(n >= 0 ? ts('why.offsetBefore', { n }) : ts('why.offsetAfter', { n: -n })); }
  if (task.notice) out.push(ts('why.notice', { date: fmtDate(task.notice.date) }));
  if (task.earliest) out.push(ts('why.earliest', { date: fmtDate(task.earliest) }));
  for (const k of task.notes || []) out.push(ts(`why.${k}`));
  if (task.locked) out.push(ts('why.locked'));
  if (task.prepareSign) out.push(ts('why.prepareSign'));
  if (w.upCards && w.upCards.length) out.push(ts('why.upCard', { card: w.upCards.map(cardLabel).join(', ') }));
  out.push(ts('why.rule', { id: task.row }));
  return out;
}

function cardsOf(f, rules) {
  if (FACT_CARDS[f]) return [FACT_CARDS[f]];
  const d = rules && rules.derived && rules.derived[f];
  if (!d) return [];
  const out = new Set();
  const walk = (t) => { if (t === true) return; if (t.all || t.any) (t.all || t.any).forEach(walk); else if (t.not) walk(t.not); else cardsOf(t.f, rules).forEach((c) => out.add(c)); };
  walk(d);
  return [...out];
}

/** Task title with its variant, dates filled. */
export function taskTitle(task) {
  const key = task.variant ? `row.${task.row}.title.${task.variant}` : `row.${task.row}.title`;
  const vars = {};
  if (task.row === 'X-96') vars.date = fmtDate(task.date);
  if (task.row === 'V-00') vars.thing = ts(`venue.${task.id.split(':')[1]}`);
  return ts(key, vars);
}

/** "Kysytään, koska – ohjelma: livemusiikki" for a conditional card. */
export function askedBecause(card, facts) {
  if (card.asked === true) return null;
  const leaves = explainLeaves(card.asked, facts).filter((l) => l.f !== 'venue' && l.f !== 'deck' && !l.negated);
  if (!leaves.length) return null;
  return ts('why.askedBecause', { reasons: leaves.map(leafText).join('; ') });
}
import { explainTrigger as explainLeaves } from './trigger.js';
