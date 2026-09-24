// Sustainable choices: SU rows carry a "kestävä valinta" chip and their own why
// line; SU-99 (a joke) is shown but never counted, never in the ownership pass or
// the table export.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { evaluate, rules } from './index.js';
import { whyLines } from './render.js';
import { planCsv } from './exportCsv.js';
import * as store from '../store.js';
import { chipsFor } from '../screens/TaskRow.jsx';
import Plan from '../screens/Plan.jsx';
import { ownCats } from '../screens/Ownership.jsx';

const today = new Date('2026-09-24T12:00:00');
const plan = (answers, cover = {}) => ({ ...store.freshPlan(today), started: true, revealed: true, cover: { type: 'keikka', date: '2026-12-20', headcount: 120, pub: true, ...cover }, answers });
const ev = (p) => evaluate(p, today);
const ids = (e) => e.tasks.map((t) => t.id);
const all = (e) => e.phases.flatMap((p) => p.tasks.map((t) => t.id));
const ctx = (e, p) => ({ deck: e.facts.deck, type: p.cover.type, headcount: p.cover.headcount, rules, E: e.E });

beforeEach(() => { vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} }); store.setToday(today); store._reset(); });

describe('SU rows', () => {
  it('all sixteen are sustainable, optional and not statutory', () => {
    const su = rules.rows.filter((r) => r.id.startsWith('SU-'));
    expect(su).toHaveLength(16);
    for (const r of su) { expect(r.sustainable, r.id).toBe(true); expect(r.owner).toBe('mine'); expect(r.deadline.fixed).toBeUndefined(); }
  });
  it('conditions from the CSV', () => {
    const food = ev(plan({ venue: 'own', catering: 'buffet' }));
    for (const id of ['SU-01', 'SU-02', 'SU-03', 'SU-13']) expect(ids(food), id).toContain(id);
    expect(ids(ev(plan({ venue: 'own', catering: 'none' })))).not.toContain('SU-13');
    expect(ids(ev(plan({ venue: 'own', merch: 'yes' })))).toContain('SU-09');
    expect(ids(ev(plan({ venue: 'own', programme: ['speakers'] })))).toContain('SU-10');
    expect(ids(ev(plan({ venue: 'own' }, { type: 'seminaari' })))).toContain('SU-12');
    expect(ids(ev(plan({ venue: 'own' }, { type: 'yksityis', pub: false })))).not.toContain('SU-07');   // public events only
    expect(ids(ev(plan({ venue: 'own' })))).toContain('SU-08');   // keikka's services include printing
  });
  it('SU-05 only when no venue runs the alcohol service', () => {
    expect(ids(ev(plan({ venue: 'own', alcohol: 'we_sell' })))).toContain('SU-05');
    expect(ids(ev(plan({ venue: 'own', catering: 'buffet', alcohol: 'none' })))).toContain('SU-05');
    expect(ids(ev(plan({ venue: 'own', catering: 'buffet', alcohol: 'venue_handles' })))).not.toContain('SU-05');
  });
  it('a chip and the row\'s own why line', () => {
    const p = plan({ venue: 'own' }); const e = ev(p);
    const su14 = e.tasks.find((t) => t.id === 'SU-14');
    expect(chipsFor(su14, false).map((c) => c.text)).toContain('kestävä valinta');
    const lines = whyLines(su14, ctx(e, p));
    expect(lines).toContain('Apurahat, kaupunki ja kumppanit kysyvät näitä seuraavaa hakemusta varten.');
    expect(lines.join(' ')).not.toMatch(/Alō/);
  });
  it('the plan shows the money note once when it has SU tasks', () => {
    const p = plan({ venue: 'own' }); const e = ev(p);
    const s = { plan: p, undo: [], nav: null, editing: null, sheet: false };
    const html = renderToStaticMarkup(<Plan s={s} ev={e} keys={{ current: {} }} />);
    expect(html.split('Jokainen näistä säästää myös rahaa.').length - 1).toBe(1);
    // In the legend beside the chip it explains, not alone in the footer.
    expect(html).toMatch(/<div class="legend">.*<span class="chip sustainable">kestävä valinta<\/span> Jokainen näistä säästää myös rahaa\./);
  });
});

describe('SU-99 is shown but never counted', () => {
  const p = plan({ venue: 'own' });
  it('is in the phases, not in tasks, the ownership pass or the export', () => {
    const e = ev(p);
    expect(all(e)).toContain('SU-99');
    expect(ids(e)).not.toContain('SU-99');
    expect(ownCats(e.tasks).flatMap((c) => c.tasks.map((t) => t.id))).not.toContain('SU-99');
    expect(planCsv(e.phases, e.E)).not.toContain('kolmen desimaalin');
  });
});
