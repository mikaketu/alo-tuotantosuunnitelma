// The ownership pass and the summary. Owner defaults vs locks, the category
// card decides undecided tasks only, undo of a whole-category decision, the
// split-bar counts, a locked card renders only "Selvä, minun", the summary's
// marked list and the file box.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { evaluate, rules } from '../engine/index.js';
import * as store from '../store.js';
import App from './App.jsx';
import Ownership, { ownCats, contextLine } from './Ownership.jsx';
import Summary, { ownerCounts } from './Summary.jsx';
import { landingView } from '../landing.js';

const today = new Date('2026-09-23T12:00:00');
const render = (el) => renderToStaticMarkup(el).replace(/ /g, ' ');
const noPlaceholders = (html) => { expect(html).not.toMatch(/\{[a-zA-Z]+\}/); expect(html).not.toMatch(/ui\.[a-z]+\./); expect(html).not.toMatch(/<button[^>]*><\/button>/); };
const keys = { current: {} };

function finished(type = 'keikka', venue = 'own', over = {}) {
  const plan = { ...store.freshPlan(today), started: true, revealed: true, cover: { type, date: '2026-11-20', headcount: 120, pub: rules.types[type].pub } };
  for (const c of rules.cards) if (c.kind !== 'cap') plan.answers[c.id] = c.kind === 'multi' ? ['live'] : c.kind === 'yesno' ? 'no' : c.options ? c.options[0] : 'none';
  plan.answers.venue = venue;
  plan.answers.ends = 'before22';
  plan.answers.alcohol = 'we_sell';
  if (venue === 'own') for (const c of rules.cards) if (c.kind === 'cap') plan.answers[c.id] = c.id === 'v_pa' ? 'no' : 'yes';
  Object.assign(plan, over);
  return plan;
}
const state = (plan, over = {}) => ({ plan, undo: [], nav: null, editing: null, sheet: false, ...over });
const ev = (plan) => evaluate(plan, today);

beforeEach(() => { vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} }); store.setToday(today); store._reset(); });

describe('store: ownership decisions', () => {
  it('the category card decides undecided tasks only; locked rows always take their default; undo reverses the whole step', () => {
    const p = finished();
    store._reset(state(p));
    const e = ev(p);
    const cats = ownCats(e.tasks);
    const cat = cats.find((c) => c.tasks.some((t) => t.locked) && c.tasks.some((t) => !t.locked));
    expect(cat).toBeTruthy();
    const locked = cat.tasks.find((t) => t.locked), free = cat.tasks.find((t) => !t.locked && t.id !== locked.id);
    store.ownDecide(free, 'none');
    expect(store.getState().plan.owners[free.id]).toBe('none');
    store.catDecide('venue', cat.tasks);
    const o = store.getState().plan.owners;
    expect(o[free.id]).toBe('none');
    expect(o[locked.id]).toBe(locked.def);
    for (const t of cat.tasks) if (!t.locked && t.id !== free.id) expect(o[t.id]).toBe('venue');
    expect(store.getState().plan.own.cat).toBe(1);
    expect(store.undo()).toBe(true);
    const after = store.getState().plan.owners;
    expect(after[free.id]).toBe('none');
    for (const t of cat.tasks) if (t.id !== free.id) expect(after[t.id]).toBeUndefined();
    expect(store.getState().plan.own.cat).toBe(0);
    store.undo();
    expect(store.getState().plan.owners[free.id]).toBeUndefined();
  });
  it('a locked task never leaves its default through ownDecide; "me" on the category card means the default', () => {
    const p = finished('keikka', 'own', { answers: { ...finished().answers, tickets: 'venue' } });
    store._reset(state(p));
    const e = ev(p);
    const locked = e.tasks.find((t) => t.locked);
    store.ownDecide(locked, 'venue');
    expect(store.getState().plan.owners[locked.id]).toBe('me');
    const handed = e.tasks.find((t) => t.def === 'venue');
    expect(handed).toBeTruthy();
    const cat = ownCats(e.tasks).find((c) => c.tasks.some((t) => t.id === handed.id));
    store.catDecide('me', cat.tasks);
    expect(store.getState().plan.owners[handed.id]).toBe('venue'); // its default is the venue (a card swiped up)
  });
  it('deal / next / finish / restart move the pass; the landing rule follows own.done', () => {
    const p = finished();
    store._reset(state(p));
    store.dealCat();
    expect(store.getState().plan.own.mode).toBe('tasks');
    store.nextCat();
    expect(store.getState().plan.own).toEqual({ cat: 1, mode: 'cat', i: 0, done: false });
    store.finishOwn();
    expect(store.getState().plan.own.done).toBe(true);
    const e = ev(store.getState().plan);
    expect(landingView(store.getState().plan, e.queue)).toBe('summary');
    store.restartOwn();
    expect(store.getState().plan.own).toEqual({ cat: 0, mode: 'cat', i: 0, done: false });
    expect(store.getState().nav).toBe('own');
  });
});

describe('Ownership screens', () => {
  it('the category card: index, intro with statutory and locked counts, the list, both buttons and the deal link', () => {
    const p = finished();
    const e = ev(p);
    const html = render(<Ownership s={state(p)} ev={e} keys={keys} />);
    noPlaceholders(html);
    expect(html).toContain('Kokonaisuus 1 / ');
    expect(html).toContain('tehtävää, kaikki oletuksena sinun.');
    expect(html).toContain('Tila hoitaa kaikki');
    expect(html).toContain('Kaikki minun →');
    expect(html).toContain('Käy tehtävät läpi yksitellen');
    expect(html).toContain('KAIKKI MINUN');
    expect(html).not.toMatch(/btn alo|Alō/);
    expect(keys.current.view).toBe('own');
  });
  it('a task card: three buttons, later, accelerators; a locked card renders only "Selvä, minun"', () => {
    const p = finished('keikka', 'own', { own: { cat: 0, mode: 'tasks', done: false } });
    const e = ev(p);
    const cat = ownCats(e.tasks)[0];
    const free = cat.tasks.find((t) => !t.locked), locked = cat.tasks.find((t) => t.locked);
    const owners = {};
    const at = { ...p, own: { ...p.own, i: cat.tasks.indexOf(free) } };
    let html = render(<Ownership s={state({ ...at, owners })} ev={ev({ ...at, owners })} keys={keys} />);
    noPlaceholders(html);
    expect(html).toContain('← Ei tarvita');
    expect(html).toContain('Minun →');
    expect(html).toContain('btn venue">↑ Tila hoitaa');
    expect(html).toContain('Myöhemmin');
    expect(html).toContain('Loput minun');
    expect(html).toContain('Tila hoitaa loput');
    expect(html).toContain('EI TARVITA');
    if (locked) {
      const atLocked = { ...p, own: { ...p.own, i: cat.tasks.indexOf(locked) } };
      html = render(<Ownership s={state(atLocked)} ev={ev(atLocked)} keys={keys} />);
      expect(html).toContain('Selvä, minun →');
      expect(html).not.toContain('← Ei tarvita');
      expect(html).not.toContain('Myöhemmin');
      expect(html).toContain('SELVÄ');
      expect(html).not.toContain('EI TARVITA');
      expect(html).toContain('Tämän voi tehdä vain järjestäjä');
      expect(keys.current.later()).toBe(false);
    }
  });
  it('context lines: locked, handed over on a card, unknown, prepare/sign, default', () => {
    const base = { locked: false, def: 'me', prepareSign: false, unknown: false, why: {} };
    expect(contextLine({ ...base, locked: true })).toBe('Tämän voi tehdä vain järjestäjä. Sitä ei voi antaa tilalle.');
    expect(contextLine({ ...base, def: 'venue', why: { upCards: ['alcohol'] } })).toBe('Merkitsit kortilla Alkoholi: tila hoitaa');
    expect(contextLine({ ...base, unknown: true })).toMatch(/^Et tiennyt/);
    expect(contextLine({ ...base, prepareSign: true })).toBe('Viranomaisilmoitus – allekirjoitus on sinun');
    expect(contextLine(base)).toBe('Oletuksena sinä. Pyyhkäise oikealle, jos se pitää paikkansa.');
  });
  it('a locked task in a plan is rendered with the § and the rule id; every task card renders without placeholders', () => {
    const p = finished('keikka', 'own', { own: { cat: 0, mode: 'tasks', done: false } });
    const e = ev(p);
    const cats = ownCats(e.tasks);
    for (const cat of cats) {
      cat.tasks.forEach((t, i) => {
        const html = render(<Ownership s={state({ ...p, own: { cat: cats.indexOf(cat), mode: 'tasks', i, done: false } })} ev={e} keys={keys} />);
        noPlaceholders(html);
        expect(html).toContain('sääntö ');
      });
    }
  });
});

describe('Summary', () => {
  it('split counts, the marked list grouped by category, the venue confirmation and the file box', () => {
    const p = finished('keikka', 'own');
    const e0 = ev(p);
    const owners = {};
    const cats = ownCats(e0.tasks);
    for (const t of cats[0].tasks) owners[t.id] = t.locked ? 'me' : 'venue';
    for (const t of cats[1].tasks) owners[t.id] = 'later';
    const plan = { ...p, owners, own: { cat: cats.length, mode: 'cat', done: true } };
    const e = ev(plan);
    const c = ownerCounts(e.tasks);
    expect(c.venue).toBe(cats[0].tasks.filter((t) => !t.locked).length);
    expect(c.later).toBe(cats[1].tasks.filter((t) => !t.locked).length);
    expect(c.me + c.venue + c.later + c.none).toBe(e.tasks.length);
    const html = render(<Summary s={state(plan)} ev={e} keys={keys} />);
    noPlaceholders(html);
    expect(html).toContain('Tässä suunnitelmasi.');
    expect(html).toContain('Nämä merkitsit tilalle');
    expect(html).toContain(`Käy nämä ${c.venue} tehtävää läpi tilan kanssa`);
    expect(html).toContain('Lataa tiedosto');
    expect(html).toContain('class="b-venue"');
    expect(html).toContain('Muokkaa vastuita');
    expect(html).toContain('Takaisin suunnitelmaan');
    expect(html).not.toMatch(/tarjou|sähköposti|Alō|b-alo/);
  });
  it('with nothing marked the all-yours box shows', () => {
    const none = finished('keikka', 'own', { owners: {}, own: { cat: 9, mode: 'cat', done: true } });
    const e = ev(none);
    const allMe = { ...none, owners: Object.fromEntries(e.tasks.map((t) => [t.id, 'me'])) };
    const h2 = render(<Summary s={state(allMe)} ev={ev(allMe)} keys={keys} />);
    expect(h2).toContain('Kaikki tehtävät sinulla');
    expect(h2).toContain('Lataa tiedosto');
  });
});

describe('App wiring', () => {
  it('plan → "Kuka hoitaa mitä?" → ownership → finish → summary → "Takaisin suunnitelmaan" → plan', () => {
    const p = finished();
    store._reset(state(p));
    expect(render(<App today={today} />)).toContain('Kuka hoitaa mitä? →');
    store.setView('own');
    expect(render(<App today={today} />)).toContain('Kokonaisuus 1 / ');
    store.finishOwn();
    expect(render(<App today={today} />)).toContain('Tässä suunnitelmasi.');
    store.setView('plan');
    const html = render(<App today={today} />);
    expect(html).toContain('Lataa taulukkona');
    expect(html).toContain('Yhteenveto →');
  });
});
