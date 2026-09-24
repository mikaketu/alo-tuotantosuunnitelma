import { describe, it, expect } from 'vitest';
import { evaluate, rules } from './index.js';
import { whyLines, taskTitle, triggerText, askedBecause, leafText } from './render.js';
import { scopedTrigger } from './tasks.js';
import fixtures from './__fixtures__/runs.json' with { type: 'json' };
import { parseIso } from './dates.js';

const today = parseIso(fixtures.today);
const NO_PLACEHOLDER = /\{\w+\}/;

describe('render', () => {
  it('every row trigger renders to a non-empty text fragment with no placeholder left', () => {
    for (const r of rules.rows) { const s = triggerText(scopedTrigger(r)); expect(s.length, r.id).toBeGreaterThan(1); expect(NO_PLACEHOLDER.test(s), `${r.id}: ${s}`).toBe(false); }
  });
  it('every task in runs A–I has a title and why lines ending with its rule id', () => {
    for (const run of fixtures.runs) {
      const plan = { v: 2, cover: run.cover, answers: run.answers, later: [], owners: {}, done: {} };
      const res = evaluate(plan, today);
      const ctx = { deck: res.facts.deck, type: res.facts.type, headcount: res.facts.headcount, rules, E: res.E };
      for (const t of res.tasks) {
        const title = taskTitle(t); expect(title.length, t.id).toBeGreaterThan(3); expect(NO_PLACEHOLDER.test(title), `${t.id}: ${title}`).toBe(false);
        const lines = whyLines(t, ctx); expect(lines.length, t.id).toBeGreaterThan(1); expect(lines[lines.length - 1]).toBe(`sääntö ${t.row}`);
        for (const l of lines) expect(NO_PLACEHOLDER.test(l), `${t.id}: ${l}`).toBe(false);
      }
      for (const c of res.cards) { const a = askedBecause(c, res.facts); if (a) expect(NO_PLACEHOLDER.test(a)).toBe(false); }
    }
  });
  it('a base public row says it belongs to every public event, not to a type', () => {
    const res = evaluate({ v: 2, cover: fixtures.runs[3].cover, answers: fixtures.runs[3].answers, later: [], owners: {}, done: {} }, today);
    const p20 = res.tasks.find((t) => t.id === 'P-20');
    expect(whyLines(p20, { deck: 'public', rules, E: res.E })[0]).toBe('Kuuluu jokaiseen julkiseen tapahtumaan');
  });
  it('a ne leaf renders negated', () => expect(leafText({ f: 'type', want: ['seminaari'], negated: true })).toBe('tapahtumatyyppi ei ole: Seminaari'));
});
