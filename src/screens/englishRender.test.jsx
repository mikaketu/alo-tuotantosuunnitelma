// With `?lang=en` the rendered screens carry no Finnish: every string comes through ts()
// and dates follow the language.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { evaluate, rules } from '../engine/index.js';
import { setLang } from '../copy/ts.js';
import * as store from '../store.js';
import Card from './Card.jsx';
import Plan from './Plan.jsx';
import Summary from './Summary.jsx';
import Ownership from './Ownership.jsx';

const today = new Date('2026-09-24T12:00:00');
const FINNISH = /[äöÄÖ]/;
const clean = (html) => html.replace(/<[^>]+>/g, ' ');
const plan = (answers, extra = {}) => ({ ...store.freshPlan(today), started: true, revealed: true, cover: { type: 'keikka', date: '2026-12-20', headcount: 120, pub: true }, answers, ...extra });
const state = (p) => ({ plan: p, undo: [], nav: null, editing: null, sheet: false });
const h = { onFly: () => {}, onTap: () => {}, onToggle: () => {}, onConfirm: () => {}, onPerf: () => {}, onLastDate: () => {}, onPerfReset: () => {} };

beforeEach(() => { vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} }); store.setToday(today); store._reset(); setLang('en'); });
afterEach(() => setLang('fi'));

describe('English render', () => {
  for (const venue of ['own', 'alo']) {
    it(`plan, summary and ownership at ${venue}`, () => {
      const p = plan({ venue, programme: ['live'], alcohol: 'we_sell', catering: 'buffet', staffing: ['friends'] }, { upVenue: venue === 'alo' ? 'alo' : 'venue' });
      const e = evaluate(p, today);
      const later = Object.fromEntries(e.tasks.filter((t) => !t.locked && !t.aloMandatory).slice(0, 3).map((t) => [t.id, 'later']));
      const q = { ...p, owners: later, laterQuote: true };
      const eq = evaluate(q, today);
      for (const html of [
        renderToStaticMarkup(<Plan s={state(p)} ev={e} keys={{ current: {} }} origin="x" />),
        renderToStaticMarkup(<Summary s={state(q)} ev={eq} keys={{ current: {} }} origin="x" />),
        renderToStaticMarkup(<Ownership s={state(p)} ev={e} keys={{ current: {} }} />),
      ]) expect(clean(html).match(new RegExp(`.{0,40}${FINNISH.source}.{0,40}`))?.[0] ?? null).toBe(null);
    });
  }
  it('every card', () => {
    const e = evaluate(plan({ venue: 'own' }), today);
    for (const c of rules.cards) for (const atAlo of [false, true]) {
      const html = clean(renderToStaticMarkup(<Card card={c} front facts={e.facts} type="keikka" atAlo={atAlo} eventDate="2026-12-20" today={today} capPos={{ i: 1, n: 12 }} h={h} />));
      expect(html.match(new RegExp(`.{0,40}${FINNISH.source}.{0,40}`))?.[0] ?? null, c.id).toBe(null);
    }
  });
});
