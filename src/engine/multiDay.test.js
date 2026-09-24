// Multi-day events (owner report 2026-09-24): the event-week phase runs to the LAST
// event day, so tasks on day 2+ are not "Jälkeen", and "Jälkeen" starts the day after.
import { describe, it, expect } from 'vitest';
import { evaluate } from './index.js';
import { toIso } from './dates.js';

const today = new Date('2026-09-24T12:00:00');
const plan = { v: 1, cover: { type: 'keikka', date: '2026-12-20', headcount: 120, pub: true },
  answers: { venue: 'own', programme: ['live'], performances: 'several', lastDate: '2026-12-22' }, later: [], owners: {}, done: {} };

describe('multi-day event', () => {
  const e = evaluate(plan, today);
  it('every task dated on an event day sits in the event-week phase', () => {
    const onDays = e.tasks.filter((t) => t.date && ['2026-12-20', '2026-12-21', '2026-12-22'].includes(toIso(t.date)));
    expect(onDays.some((t) => toIso(t.date) !== '2026-12-20')).toBe(true);   // repeats reach day 2+
    for (const t of onDays) expect(t.phase, `${t.id} ${toIso(t.date)}`).toBe(3);
  });
  it('nothing after the last day is in the event week', () => {
    for (const t of e.tasks.filter((x) => x.date && toIso(x.date) > '2026-12-22')) expect(t.phase, t.id).toBe(4);
  });
});
