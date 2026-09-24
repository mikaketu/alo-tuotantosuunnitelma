// Runs A–I (docs/yhdeksan-ajoa.md) as fixtures: exact fired / pending /
// statutory / suppressed sets (±0), counts and variants. Change a row and a
// fixture together, never one alone (npm run fixtures:check).
import { describe, it, expect } from 'vitest';
import { evaluate } from './index.js';
import fixtures from './__fixtures__/runs.json' with { type: 'json' };
import { parseIso } from './dates.js';

const today = parseIso(fixtures.today);
for (const run of fixtures.runs) {
  describe(`run ${run.id} — ${run.title}`, () => {
    const plan = { v: 2, cover: run.cover, answers: run.answers, later: [], owners: {}, done: {} };
    const res = evaluate(plan, today);
    it('fires exactly the expected rows', () => expect(res.tasks.filter((t) => !t.pending).map((t) => t.id)).toEqual(run.expect.fired));
    it('leaves exactly the expected rows pending', () => expect(res.tasks.filter((t) => t.pending).map((t) => t.id)).toEqual(run.expect.pending));
    it('marks the statutory rows', () => expect(res.tasks.filter((t) => t.statutory).map((t) => t.id)).toEqual(run.expect.statutory));
    it('suppresses profile rows the venue covers', () => expect(res.suppressed.map((s) => s.id)).toEqual(run.expect.suppressed));
    it('picks the title variants', () => expect(Object.fromEntries(res.tasks.filter((t) => t.variant).map((t) => [t.id, t.variant]))).toEqual(run.expect.variants));
    it('counts cards, tasks and phases', () => { expect(res.cards.length).toBe(run.expect.cards); expect(res.tasks.length).toBe(run.expect.tasks); expect(res.phases.length).toBe(run.expect.phases); });
  });
}

describe('fixture hygiene', () => {
  it('every run records the doc count and a note explaining the delta', () => {
    for (const run of fixtures.runs) { expect(run.doc.tasks).toBeTypeOf('number'); if (run.doc.tasks !== run.expect.tasks) expect(run.notes.length, run.id).toBeGreaterThan(20); }
  });
});
