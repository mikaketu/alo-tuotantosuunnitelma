// @vitest-environment jsdom
// Tapping an answer (user feedback 2026-09-25): the chosen option shows as selected for a
// moment, then the card flies off like a swipe, and only then is the answer saved.
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { evaluate } from '../engine/index.js';
import * as store from '../store.js';
import Deck from './Deck.jsx';
import { FLY_MS } from '../useDrag.js';

const today = new Date('2026-09-24T12:00:00');
let host, root;

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  store.setToday(today);
  store._reset({ plan: { ...store.freshPlan(today), started: true, cover: { type: 'keikka', date: '2026-12-20', headcount: 120, pub: true }, answers: { venue: 'own', programme: ['live'] } } });
  host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host);
});
afterEach(() => { act(() => root.unmount()); host.remove(); vi.useRealTimers(); vi.unstubAllGlobals(); });

function mount() {
  const s = store.getState();
  const ev = evaluate(s.plan, today);
  act(() => root.render(<Deck s={s} ev={ev} keys={{ current: {} }} today={today} />));
  return ev;
}

describe('tap → chosen → fly → saved', () => {
  it('"Yhtenä päivänä" highlights first, saves only after the fly-out', () => {
    const ev = mount();
    expect(ev.queue[0].id).toBe('performances');
    const btn = [...host.querySelectorAll('.card.front .opt')].find((b) => b.textContent.includes('Yhtenä päivänä'));
    act(() => btn.click());
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(store.getState().plan.answers.performances).toBeUndefined();
    act(() => vi.advanceTimersByTime(200));   // the highlight hold, then the fly starts
    expect(store.getState().plan.answers.performances).toBeUndefined();
    act(() => vi.advanceTimersByTime(FLY_MS));
    expect(store.getState().plan.answers.performances).toBe('one');
  });
  it('a second tap during the hold is ignored', () => {
    mount();
    const opts = [...host.querySelectorAll('.card.front .opt')];
    act(() => opts[0].click());
    act(() => opts[1].click());
    act(() => vi.advanceTimersByTime(200 + FLY_MS));
    expect(store.getState().plan.answers.performances).toBe('one');
  });
});
