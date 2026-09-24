import rulesData from '../rules.json' with { type: 'json' };
import { factsOf } from './facts.js';
import { cardsFor, deckQueue, cardImpact } from './cards.js';
import { tasksFor, phasesFor } from './tasks.js';

export const rules = rulesData;

/** One call for the UI: facts, cards, tasks (with why), suppressed rows, phases. */
export function evaluate(plan, today, r = rulesData) {
  const res = tasksFor(r, plan, today);
  const cards = cardsFor(r, plan.cover, res.facts);
  // `uncounted` rows (SU-99, a joke) show in the phases only: never in counts, progress,
  // the ownership pass or the table export.
  return { facts: res.facts, cards, queue: deckQueue(cards, plan).queue, tasks: res.tasks.filter((t) => !t.uncounted), suppressed: res.suppressed,
    ...phasesFor(res, today), E: res.E, Elast: res.Elast };
}

export function impact(plan, today, cardId, value, r = rulesData) {
  return cardImpact(r, plan, today, cardId, value, tasksFor);
}

export { factsOf, cardsFor, deckQueue, tasksFor, phasesFor };
