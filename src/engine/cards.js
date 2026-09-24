import { evalTrigger } from './trigger.js';
import { factsOf } from './facts.js';

/** Cards the deck shows for these facts, in running order. Pending "asked" = asked (fail open). */
export function cardsFor(rules, cover, facts) {
  const preset = (rules.types[cover.type] || {}).preset || {};
  const out = [];
  for (const c of rules.cards) {
    if (preset[c.id] !== undefined) continue;
    if (c.asked !== true && evalTrigger(c.asked, facts) === false) continue;
    if (c.v0pre && facts.bare === 'yes') continue;
    let options = c.options;
    if (options) {
      const hide = (c.hideOptionsFor || {})[cover.type] || [];
      options = options.filter((o) => !hide.includes(o) && (!c.optionWhen || !c.optionWhen[o] || evalTrigger(c.optionWhen[o], facts) !== false));
    }
    out.push({ ...c, options });
  }
  return out;
}

/** Unanswered cards first in running order, then the deferred ones in deferral order. */
export function deckQueue(cards, plan) {
  const answered = (c) => plan.answers[c.id] !== undefined;
  const later = plan.later || [];
  const fresh = cards.filter((c) => !answered(c) && !later.includes(c.id));
  const deferred = later.map((id) => cards.find((c) => c.id === id)).filter((c) => c && !answered(c));
  return { all: cards, queue: fresh.concat(deferred) };
}

/** Which rows a hypothetical answer would add or remove — the data behind a card's helper line. */
export function cardImpact(rules, plan, today, cardId, value, tasksFor) {
  const base = new Set(tasksFor(rules, plan, today).tasks.map((t) => t.id));
  const next = tasksFor(rules, { ...plan, answers: { ...plan.answers, [cardId]: value } }, today).tasks.map((t) => t.id);
  const nextSet = new Set(next);
  return { adds: next.filter((id) => !base.has(id)), removes: [...base].filter((id) => !nextSet.has(id)) };
}

export { factsOf };
