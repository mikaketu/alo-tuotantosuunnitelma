// The English table: pins parity with fi.json so a new Finnish key can't ship without its English.
import { describe, it, expect, afterEach } from 'vitest';
import FI from './fi.json' with { type: 'json' };
import EN from './en.json' with { type: 'json' };
import { ts, setLang, lang } from './ts.js';
import { fmtWeekday } from '../fmt.js';

const vars = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

afterEach(() => setLang('fi'));

describe('en.json', () => {
  it('has exactly the Finnish keys', () => {
    expect(Object.keys(EN).sort()).toEqual(Object.keys(FI).sort());
  });
  it('fills the same {placeholders}', () => {
    for (const k of Object.keys(FI)) expect(vars(EN[k]), k).toEqual(vars(FI[k]));
  });
  it('keeps the spaces at the edges that Finnish has (rule.and = " ja " → " and ")', () => {
    for (const [k, v] of Object.entries(FI)) if (v) {
      expect(EN[k].startsWith(' '), k).toBe(v.startsWith(' '));
      expect(EN[k].endsWith(' '), k).toBe(v.endsWith(' '));
    }
  });
  it('is English wherever Finnish has text', () => {
    for (const [k, v] of Object.entries(FI)) if (v) expect(EN[k], k).not.toBe('');
  });
  it('no exclamation marks', () => { for (const [k, v] of Object.entries(EN)) expect(v.includes('!'), k).toBe(false); });
});

describe('setLang', () => {
  it('switches the table and the date locale; unknown languages stay Finnish', () => {
    expect(ts('ui.plan.prompt.close')).toBe('Sulje');
    setLang('en');
    expect([lang, ts('ui.plan.prompt.close'), ts('ui.own.catIntro', { n: 3 })]).toEqual(['en', 'Close', '3 tasks, all yours by default.']);
    expect(fmtWeekday('2026-11-20')).toMatch(/^Fri/);
    setLang('sv');
    expect([lang, ts('ui.plan.prompt.close')]).toEqual(['fi', 'Sulje']);
    expect(fmtWeekday('2026-11-20')).toMatch(/^pe/);
  });
});

describe('the fi/en switch on the landing page', () => {
  it('switches the copy, remembers the choice and puts it in the address', async () => {
    const saved = {};
    const { vi } = await import('vitest');
    vi.stubGlobal('localStorage', { getItem: (k) => saved[k] ?? null, setItem: (k, v) => { saved[k] = v; }, removeItem: () => {} });
    const store = await import('../store.js');
    store.setLanguage('en');
    expect([lang, ts('ui.plan.prompt.close'), saved['ts-lang']]).toEqual(['en', 'Close', 'en']);
    store.setLanguage('fi');
    expect([lang, ts('ui.plan.prompt.close'), saved['ts-lang']]).toEqual(['fi', 'Sulje', 'fi']);
  });
});
