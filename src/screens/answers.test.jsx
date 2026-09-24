// "Muuta vastauksia" (owner report 2026-09-24): with every card answered it used to fall back
// to the cover, whose "Jatka kortteihin" found no cards and landed on the plan again. It now
// opens the answers list; a tap opens just that card; answering returns to the list.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { evaluate } from '../engine/index.js';
import * as store from '../store.js';
import { resolveView } from './App.jsx';
import Answers from './Answers.jsx';
import Deck from './Deck.jsx';
import Cover from './Cover.jsx';
import { commitValue } from './Card.jsx';

const today = new Date('2026-09-24T12:00:00');
const render = (el) => renderToStaticMarkup(el).replace(/ /g, ' ');
const ev = () => evaluate(store.getState().plan, today);

/** Answer every card the way a visitor would (first option / right / "none" on multi). */
function answeredPlan(venue) {
  let p = { ...store.freshPlan(today), started: true, revealed: true, cover: { type: 'keikka', date: '2026-12-20', headcount: 150, pub: true }, answers: { venue } };
  for (let g = 0; g < 60; g++) {
    const e = evaluate(p, today);
    const c = e.queue[0];
    if (!c) break;
    const v = c.kind === 'multi' ? (c.optional ? ['friends', 'paid'] : [c.options[0]]) : c.kind === 'perf' ? 'one' : c.options ? c.options[c.options.length - 1] : commitValue(c, 'right');
    p = { ...p, answers: { ...p.answers, [c.id]: v } };
  }
  return p;
}

beforeEach(() => { vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} }); store.setToday(today); });

describe('the answers list', () => {
  for (const venue of ['own', 'none']) {
    it(`lists every card with its answer in words (${venue})`, () => {
      store._reset({ plan: answeredPlan(venue) });
      expect(ev().queue).toEqual([]);
      store.openAnswers();
      expect(resolveView(store.getState(), ev())).toBe('answers');
      const html = render(<Answers s={store.getState()} ev={ev()} />);
      const answers = [...html.matchAll(/<span class="a[^"]*">([^<]*)<\/span>/g)].map((m) => m[1]);
      expect(answers.length).toBe(ev().cards.length);
      for (const a of answers) expect(a, a).not.toMatch(/^[a-z_]+$/);   // no raw values (we_sell, yes, unknown)
      expect(html).not.toContain('Ei vastattu');
    });
  }
  it('a tap opens just that card; answering returns to the list with the new answer', () => {
    store._reset({ plan: answeredPlan('own') });
    store.openAnswers();
    store.editAnswer('catering');
    expect(resolveView(store.getState(), ev())).toBe('deck');
    const html = render(<Deck s={store.getState()} ev={ev()} keys={{ current: {} }} today={today} />);
    expect(html).toContain('← Vastauksesi');
    expect(html).toContain('Tarjoillaanko ruokaa?');
    store.answer('catering', 'none');
    expect(store.getState()).toMatchObject({ nav: 'answers', editing: null });
    expect(store.getState().plan.answers.catering).toBe('none');
  });
  it('a multi-select card opens with its saved choices selected', () => {
    store._reset({ plan: answeredPlan('own') });
    store.editAnswer('staffing');
    const html = render(<Deck s={store.getState()} ev={ev()} keys={{ current: {} }} today={today} />);
    expect((html.match(/aria-pressed="true"/g) || []).length).toBe(2);
  });
  it('the cover says "Takaisin suunnitelmaan" when no card is left to answer', () => {
    store._reset({ plan: answeredPlan('own') });
    const s = store.getState();
    expect(render(<Cover s={s} deckSize={ev().cards.length} left={0} today={today} />)).toContain('Takaisin suunnitelmaan →');
    expect(render(<Cover s={s} deckSize={ev().cards.length} left={3} today={today} />)).toContain('Jatka kortteihin →');
    // The fi/en switch sits in the landing page's top bar, Finnish pressed by default.
    const cover = render(<Cover s={s} deckSize={ev().cards.length} left={0} today={today} />);
    expect(cover).toContain('aria-label="Kieli"');
    expect(cover).toMatch(/aria-pressed="true"[^>]*>FI</);
  });
});
