// Staffing as a multi-select (owner 2026-09-24): "Kuka muu tekee töitä tapahtumassa?"
// Pick every group that applies; an empty answer means you do it all yourselves.
// Plans saved with the old single choice read the same ("Molempia" = both).
import { describe, it, expect } from 'vitest';
import { evaluate, rules } from './index.js';

const today = new Date('2026-09-24T12:00:00');
const plan = (staffing) => ({
  v: 1, cover: { type: 'keikka', date: '2026-12-20', headcount: 120, pub: true },
  answers: { venue: 'own', catering: 'buffet', ...(staffing === undefined ? {} : { staffing }) }, later: [], owners: {}, done: {},
});
const has = (staffing) => { const ids = evaluate(plan(staffing), today).tasks.map((t) => t.id); return ['X-25', 'X-26'].filter((id) => ids.includes(id)); };

describe('staffing card', () => {
  it('is an optional multi-select over friends / paid', () => {
    const c = rules.cards.find((x) => x.id === 'staffing');
    expect([c.kind, c.optional, c.options]).toEqual(['multi', true, ['friends', 'paid']]);
  });
  it('friends → X-25, paid → X-26, both → both, empty → neither', () => {
    expect(has(['friends'])).toEqual(['X-25']);
    expect(has(['paid'])).toEqual(['X-26']);
    expect(has(['friends', 'paid'])).toEqual(['X-25', 'X-26']);
    expect(has([])).toEqual([]);
  });
  it('an empty answer counts as answered: the deck does not ask again', () => {
    expect(evaluate(plan([]), today).queue.map((c) => c.id)).not.toContain('staffing');
  });
  it('old single answers read as before; "Molempia" now brings both rows', () => {
    expect(has('friends')).toEqual(['X-25']);
    expect(has('paid')).toEqual(['X-26']);
    expect(has('mix')).toEqual(['X-25', 'X-26']);
  });
});
