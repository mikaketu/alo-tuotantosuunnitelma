// Render tests for the cover, the deck and every card kind (renderToStaticMarkup,
// node env): copy only, no placeholder left, no empty button, the shells' meta,
// the landing rule wired through App.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluate, rules } from '../engine/index.js';
import * as store from '../store.js';
import fixtures from '../engine/__fixtures__/runs.json' with { type: 'json' };
import App, { resolveView } from './App.jsx';
import Cover from './Cover.jsx';
import Deck from './Deck.jsx';
import Card, { canUp, commitValue, isTapOnly, upLabel } from './Card.jsx';
import Exit from './Exit.jsx';
import Privacy from './Privacy.jsx';
import { progressModel } from './Progress.jsx';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const today = new Date('2026-09-23T12:00:00');
// Arrows are glued to their label with a no-break space (Card.jsx); compare as plain text.
const render = (el) => renderToStaticMarkup(el).replace(/ /g, ' ');
const noPlaceholders = (html) => { expect(html).not.toMatch(/\{[a-zA-Z]+\}/); expect(html).not.toMatch(/ui\.[a-z]+\./); expect(html).not.toMatch(/<button[^>]*><\/button>/); };
const plan = (over = {}) => ({ ...store.freshPlan(today), started: true, cover: { type: 'keikka', date: '2026-11-20', headcount: 120, pub: true }, ...over });
const state = (over = {}) => ({ plan: plan(), undo: [], nav: null, editing: null, sheet: false, ...over });
const keys = { current: {} };

beforeEach(() => { vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} }); store.setToday(today); store._reset(); });

describe('Cover', () => {
  it('renders the nine tiles, the date, the number field and the start button; disabled until complete', () => {
    const html = render(<Cover s={state({ plan: store.freshPlan(today) })} deckSize={0} today={today} />);
    noPlaceholders(html);
    expect(html.match(/class="tile"/g)).toHaveLength(9);
    expect(html).toContain('type="number"');
    expect(html).toMatch(/inputmode="numeric"/i);
    expect(html).toMatch(/<button[^>]*class="btn primary wide big"[^>]*disabled/);
    expect(html).toContain('Tietosuoja');
    expect(html).toContain('Avaa tallennettu tiedosto');
    expect(html).toContain('type="file"');
  });
  it('shows the deck size and the bucket; a started plan hides the file input and offers the reset', () => {
    const html = render(<Cover s={state({ plan: plan({ started: false }) })} deckSize={17} today={today} />);
    expect(html).toContain('17 korttia');
    expect(html).toContain('50–150');
    expect(html).not.toMatch(/class="btn primary wide big"[^>]*disabled/);
    const started = render(<Cover s={state()} deckSize={17} today={today} />);
    expect(started).not.toContain('type="file"');
    expect(started).toContain('Aloita uusi suunnitelma');
  });
});

describe('Card, every kind', () => {
  const p = plan({ answers: { venue: 'own', programme: ['live'], performances: 'several', lastDate: '2026-11-22' } });
  const e = evaluate(p, today);
  const h = { onFly: () => {}, onTap: () => {}, onToggle: () => {}, onConfirm: () => {}, onPerf: () => {}, onLastDate: () => {}, onPerfReset: () => {} };
  const common = { facts: e.facts, type: 'keikka', eventDate: '2026-11-20', today, h };
  for (const c of rules.cards) {
    it(`${c.id} (${c.kind}) renders with copy only`, () => {
      const html = render(<Card card={c} front capPos={{ i: 1, n: 12 }} {...common} />);
      noPlaceholders(html);
      expect(html).toContain('role="group"');
      // ↑ (button + stamp) only where something can be handed to the venue (canUp).
      if (canUp(c)) expect(html).toContain('data-stamp="u"');
      else { expect(html).not.toContain('data-stamp="u"'); expect(html).not.toContain('↑'); }
      expect(html).not.toContain('class="lr"');
      if (isTapOnly(c)) expect(html).not.toContain('data-stamp="l"');
      else expect(html).toContain('data-stamp="l"');
      if (c.kind === 'cap') { expect(html).toContain('btn ghost">↑ En tiedä'); expect(html).toContain('stamp u n'); }
      if (c.kind === 'venue') { expect(html).toContain('actions two'); expect(html).not.toContain('↑'); }
      if (canUp(c) && c.kind !== 'cap') expect(html).toMatch(new RegExp(`btn venue( wide)?">↑ ${upLabel(c)}<`));
      // An optional multi card (staffing) accepts an empty selection: "none of these".
      if (c.kind === 'multi' && !c.optional) expect(html).toMatch(/<button[^>]*class="btn primary( wide)?"[^>]*disabled/);
      if (c.kind === 'multi' && c.optional) expect(html).not.toMatch(/<button[^>]*class="btn primary( wide)?"[^>]*disabled/);
    });
  }
  it('the venue card has two answers and no ↑; no card carries a brand', () => {
    const venue = rules.cards.find((c) => c.id === 'venue');
    expect(canUp(venue)).toBe(false);
    const html = render(<Card card={venue} front {...common} />);
    expect(html).toContain('Ei vielä');
    expect(html).not.toContain('btn alo');
    for (const c of rules.cards) expect(render(<Card card={c} front {...common} />)).not.toMatch(/Alō/);
  });
  it('the perf card in "several" mode shows the last-day calendar with the first day filled in', () => {
    const perf = rules.cards.find((c) => c.id === 'performances');
    const html = render(<Card card={perf} front {...common} several />);
    expect(html).toContain('ensimmäinen 20.11.');
    expect(html).toContain('class="cal"');
    expect(html).toContain('Sittenkin yhtenä');
    noPlaceholders(html);
  });
  it('the catering question has its Häät variant and the alcohol card its own up label', () => {
    const catering = rules.cards.find((c) => c.id === 'catering');
    expect(render(<Card card={catering} front {...common} type="haat" />)).toContain('Millainen tarjoilu');
    expect(upLabel(rules.cards.find((c) => c.id === 'alcohol'))).toBe('Tila hoitaa anniskelun');
    expect(canUp(rules.cards.find((c) => c.id === 'merch'))).toBe(false);
    expect(canUp(rules.cards.find((c) => c.id === 'programme'))).toBe(false);
  });
  it('a back card is inert', () => {
    const html = render(<Card card={rules.cards[1]} {...common} />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('<div inert="">');
    expect(html).not.toContain('data-stamp');
  });
  it('commitValue maps directions per kind', () => {
    const by = (id) => rules.cards.find((c) => c.id === id);
    expect(['left', 'right'].map((d) => commitValue(by('venue'), d))).toEqual(['none', 'own']);
    expect(['left', 'right', 'up'].map((d) => commitValue(by('v_pa'), d))).toEqual(['no', 'yes', 'unknown']);
    expect(['left', 'right', 'up'].map((d) => commitValue(by('rigging'), d))).toEqual(['no', 'yes', 'venue']);
    expect(commitValue(by('layout'), 'up')).toBe('venue');
  });
});

describe('Deck', () => {
  it('renders the front card, the next card behind it, progress and the later button for every run', () => {
    for (const run of fixtures.runs) {
      const p = plan({ cover: run.cover, answers: { venue: run.answers.venue } });
      const e = evaluate(p, today);
      if (!e.queue.length) continue;
      const html = render(<Deck s={state({ plan: p })} ev={e} keys={keys} today={today} />);
      noPlaceholders(html);
      expect(html).toContain('card front');
      expect(html).toContain('card back"');
      expect(html).toContain('Myöhemmin');
      expect(html).toContain('Tallenna ja lopeta');
    }
  });
  it('the progress model weights sections by card count and names the current one', () => {
    const p = plan({ answers: { venue: 'own', programme: ['live'] } });
    const e = evaluate(p, today);
    const m = progressModel(e.cards, p.answers, e.queue[0]);
    expect(m.sections[0]).toEqual({ key: 'venue', n: 1, done: 1 });
    expect(m.i).toBe(3);
    expect(m.n).toBe(e.cards.length);
    expect(m.section).toBe(e.queue[0].section);
  });
  it('shows the undo button when the stack is non-empty and the key legend', () => {
    const p = plan();
    const e = evaluate(p, today);
    const html = render(<Deck s={state({ plan: p, undo: [{ t: 'ans' }] })} ev={e} keys={keys} today={today} />);
    expect(html).toContain('Kumoa');
    expect(html).toContain('Näppäimistöllä');
  });
});

describe('Exit and Privacy', () => {
  it('the exit screen offers the file, resume and reset, and says nothing was sent', () => {
    const html = render(<Exit s={state()} />);
    expect(html).toContain('href="https://github.com/mikaketu/alo-tuotantosuunnitelma"');   // Lähdekoodi beside Tietosuoja
    noPlaceholders(html);
    expect(html).toContain('Tallennettu.');
    expect(html).toContain('Lataa tiedosto');
    expect(html).toContain('Jatka');
    expect(html).toContain('Aloita uusi suunnitelma');
    expect(html).toContain('Tietosuoja');
    expect(html).not.toMatch(/Kopioi|linkki/);
  });
  it('the privacy sheet renders every block and links the source code', () => {
    const html = render(<Privacy />);
    noPlaceholders(html);
    expect(html).toContain('role="dialog"');
    expect(html).toContain('href="https://github.com/mikaketu/alo-tuotantosuunnitelma"');
    for (const k of ['Mitä tallennetaan', 'Jos tallennat tiedostona', 'Suunnitelman poistaminen', 'Lähdekoodi', 'Mitään ei lähetetä mihinkään']) expect(html).toContain(k);
    expect(html).not.toMatch(/Alō|180 päivä|evästeitä käytetään/);
  });
});

describe('App', () => {
  it('resolves nav / landing', () => {
    expect(resolveView(state({ nav: 'exit' }), { queue: [{ id: 'x' }] })).toBe('exit');
    expect(resolveView(state(), { queue: [{ id: 'x' }] })).toBe('deck');
    expect(resolveView(state({ plan: store.freshPlan(today) }), null)).toBe('intro');
    expect(resolveView(state({ plan: store.freshPlan(today), introDone: true }), null)).toBe('cover');
    expect(resolveView(state({ nav: 'deck' }), { queue: [] })).toBe('reveal');
  });
  it('renders the intro, then the cover from a fresh store, and the deck from a started one', () => {
    store._reset();
    expect(render(<App today={today} />)).toContain('class="app intro-page"');
    store.closeIntro();
    expect(render(<App today={today} />)).toContain('class="tiles"');
    store._reset(state());
    expect(render(<App today={today} />)).toContain('card front');
    store._reset(state({ nav: 'exit' }));
    expect(render(<App today={today} />)).toContain('Tallennettu');
    store._reset(state({ sheet: true }));
    expect(render(<App today={today} />)).toContain('role="dialog"');
  });
});

describe('shells', () => {
  it('neither page loads a third party, an API or an auth script; the fonts are self-hosted', () => {
    const index = readFileSync(join(ROOT, 'index.html'), 'utf-8');
    const saannot = readFileSync(join(ROOT, 'saannot.html'), 'utf-8');
    expect(index).toContain('viewport-fit=cover');
    expect(index).toContain('/css/suunnitelma.css');
    expect(index).toContain('/src/main.jsx');
    expect(saannot).toContain('/src/saannot.jsx');
    for (const h of [index, saannot]) expect(h).not.toMatch(/googleapis|gstatic|alo-auth|alo-shared|base\.css|\/api\/|alokas|Alō/);
    const css = readFileSync(join(ROOT, 'css', 'suunnitelma.css'), 'utf-8');
    expect(css).not.toMatch(/https?:\/\//);
    for (const f of ['merriweather-700-latin.woff2', 'zalando-sans-latin.woff2', 'zalando-sans-latin-ext.woff2', 'merriweather-700-latin-ext.woff2']) {
      expect(css).toContain(`/fonts/${f}`);
      expect(readFileSync(join(ROOT, 'public', 'fonts', f)).length).toBeGreaterThan(1000);
    }
  });
});
