// The intro page: a fresh visitor meets what the tool is before the cover's
// questions; anyone with a plan under way goes straight to the cover.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as store from '../store.js';
import { resolveView } from './App.jsx';
import Intro from './Intro.jsx';

const today = new Date('2026-09-24T12:00:00');

beforeEach(() => { vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} }); store.setToday(today); store._reset(); });

describe('intro page', () => {
  it('a fresh visitor lands on it; "Aloita" moves on to the cover', () => {
    expect(resolveView(store.getState(), null)).toBe('intro');
    store.closeIntro();
    expect(resolveView(store.getState(), null)).toBe('cover');
  });
  it('a started plan or an explicit nav skips it', () => {
    expect(resolveView({ ...store.getState(), plan: { ...store.getState().plan, started: true } }, null)).not.toBe('intro');
    expect(resolveView({ ...store.getState(), nav: 'cover' }, null)).toBe('cover');
  });
  it('carries the two paragraphs, the language switch and the start button', () => {
    const html = renderToStaticMarkup(<Intro />).replace(/ /g, ' ');
    expect(html).toContain('Tuotantosuunnitelma on työkalu tapahtumien järjestäjille.');
    expect((html.match(/class="intro"/g) || []).length).toBe(2);
    expect(html).toContain('aria-label="Kieli"');
    expect(html).toContain('Aloita →');
  });
});
