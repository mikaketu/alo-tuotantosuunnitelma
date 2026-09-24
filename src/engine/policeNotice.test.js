// P-30, the police notice (owner 2026-09-24): 5 days by law; 14 days when traffic
// controllers are likely (an outdoor event); contact the police at the start ("Nyt")
// for a large AND multi-day event (400+ people and several days).
import { describe, it, expect } from 'vitest';
import { evaluate, rules } from './index.js';
import { whyLines } from './render.js';
import { toIso, addDays } from './dates.js';

const today = new Date('2026-09-24T12:00:00');
const run = (headcount, answers = {}) => {
  const plan = { v: 1, cover: { type: 'keikka', date: '2026-12-20', headcount, pub: true }, answers: { venue: 'own', ...answers }, later: [], owners: {}, done: {} };
  const e = evaluate(plan, today);
  const t = e.tasks.find((x) => x.id === 'P-30');
  return { e, t, plan };
};
const daysBefore = (e, t) => Math.round((e.E - t.date) / 86400000);
const several = { performances: 'several', lastDate: '2026-12-21' };

describe('P-30 timing', () => {
  it('5 days by default, with the guidance paragraph', () => {
    const { e, t, plan } = run(250);
    expect([t.fixed, daysBefore(e, t), t.statutory]).toEqual([true, 5, true]);
    const lines = whyLines(t, { atAlo: false, deck: 'public', type: 'keikka', headcount: 250, rules, E: e.E });
    expect(lines.some((l) => l.startsWith('Jos tilaisuuteen tarvitaan liikenteenohjaajia'))).toBe(true);
  });
  it('14 days for an outdoor event', () => {
    const { e, t } = run(250, { outdoor: 'yes' });
    expect([daysBefore(e, t), t.statutory, t.notes]).toEqual([14, true, ['policeTwoWeeks']]);
  });
  it('at the start ("Nyt") for 400+ people AND several days, the notice date kept', () => {
    const { e, t } = run(450, several);
    expect([t.phase, t.fixed, t.notes]).toEqual([0, false, ['policeEarly']]);
    expect(toIso(t.notice.date)).toBe(toIso(addDays(e.E, -5)));
    const out = run(450, { ...several, outdoor: 'yes' });
    expect(toIso(out.t.notice.date)).toBe(toIso(addDays(out.e.E, -14)));
  });
  it('400+ alone or several days alone keeps the 5 days', () => {
    for (const [n, a] of [[450, {}], [250, several]]) {
      const { e, t } = run(n, a);
      expect([t.fixed, daysBefore(e, t), t.notes], JSON.stringify(a)).toEqual([true, 5, []]);
    }
  });
});
