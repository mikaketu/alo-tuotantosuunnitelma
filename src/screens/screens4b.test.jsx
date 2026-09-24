// Render tests for the reveal, the plan over runs A–I (list and matrix), task
// rows, chips, why lines, the late box, the venue nudge, the suppressed group,
// the CSV, and hygiene: no accent colour hard-coded in a screen, no brand.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluate, rules } from '../engine/index.js';
import * as store from '../store.js';
import fixtures from '../engine/__fixtures__/runs.json' with { type: 'json' };
import App from './App.jsx';
import Reveal, { revealStats } from './Reveal.jsx';
import Plan, { phaseRange, phaseExplain, downloadCsv } from './Plan.jsx';
import TaskRow, { dateLabel, chipsFor, MiniRow, whyCtx } from './TaskRow.jsx';
import { landingView } from '../landing.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const today = new Date('2026-09-23T12:00:00');
const render = (el) => renderToStaticMarkup(el).replace(/ /g, ' ');
const noPlaceholders = (html) => { expect(html).not.toMatch(/\{[a-zA-Z]+\}/); expect(html).not.toMatch(/ui\.[a-z]+\./); expect(html).not.toMatch(/<button[^>]*><\/button>/); };
const keys = { current: {} };

/** A finished deck for `type` at `venue`. */
function finished(type = 'keikka', venue = 'none', over = {}) {
  const plan = { ...store.freshPlan(today), started: true, cover: { type, date: '2026-11-20', headcount: 120, pub: rules.types[type].pub } };
  for (const c of rules.cards) if (c.kind !== 'cap') plan.answers[c.id] = c.kind === 'multi' ? ['live'] : c.kind === 'yesno' ? 'no' : c.options ? c.options[0] : 'none';
  plan.answers.venue = venue;
  plan.answers.ends = 'before22';
  if (venue === 'own') for (const c of rules.cards) if (c.kind === 'cap') plan.answers[c.id] = 'yes';
  Object.assign(plan, over);
  return plan;
}
const state = (plan, over = {}) => ({ plan, undo: [], nav: null, editing: null, sheet: false, ...over });
const ev = (plan) => evaluate(plan, today);

beforeEach(() => { vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} }); store.setToday(today); store._reset(); });

describe('Reveal', () => {
  it('counts tasks, categories, statutory deadlines and days, and names what waits for the venue', () => {
    const p = finished('keikka', 'none');
    const e = ev(p);
    expect(landingView(p, e.queue)).toBe('reveal');
    const st = revealStats(e);
    const html = render(<Reveal s={state(p)} ev={e} keys={keys} />);
    noPlaceholders(html);
    expect(html).toContain(`data-n="${st.tasks}"`);
    expect(html).toContain(`data-n="${st.days}"`);
    expect(html).toContain(`${st.pending} tehtävää odottaa vielä tilan valintaa`);
    expect(html).toContain('Näytä suunnitelma');
    expect(st.cats).toBeGreaterThan(3);
    expect(html).not.toMatch(/Alō|jäisi pois/);
  });
  it('with tasks marked to the venue says how many; own venue with nothing marked says all yours', () => {
    const o = finished('keikka', 'own');
    expect(render(<Reveal s={state(o)} ev={ev(o)} keys={keys} />)).toContain('Kaikki tehtävät ovat sinun');
    const marked = { ...o, answers: { ...o.answers, tickets: 'venue' } };
    expect(render(<Reveal s={state(marked)} ev={ev(marked)} keys={keys} />)).toContain('merkitsit jo tilalle');
  });
});

describe('Plan over runs A–I', () => {
  for (const run of fixtures.runs) {
    it(`run ${run.id} renders as a list and as a matrix without placeholders`, () => {
      const plan = { ...store.freshPlan(today), started: true, revealed: true, cover: run.cover, answers: run.answers };
      const e = ev(plan);
      for (const wide of [false, true]) {
        const html = render(<Plan s={state(plan)} ev={e} keys={keys} wide={wide} />);
        noPlaceholders(html);
        expect(html).toContain('Lataa taulukkona');
        expect(html).toContain('Tallenna ja lopeta');
        // Every task shown, SU-99 too: it is in the phases, just never counted.
        expect((html.match(/type="checkbox"/g) || []).length).toBe(e.phases.reduce((n, p) => n + p.tasks.length, 0));
        if (wide) expect(html).toContain('mx-head'); else expect(html).toContain('class="tasks"');
        if (e.tasks.some((t) => t.late)) expect(html).toContain('class="latebox"'); else expect(html).not.toContain('class="latebox"');
        if (e.suppressed.length) expect(html).toContain(`suunnitelmassa (${e.suppressed.length})`); else expect(html).not.toContain('class="suppressed"');
        expect(html).not.toMatch(/chip alo|btn alo|Alō/);
      }
    });
  }
  it('the venue nudge shows only with no venue and pending rows, with one button', () => {
    const none = finished('keikka', 'none', { revealed: true });
    let e = ev(none);
    const html = render(<Plan s={state(none)} ev={e} keys={keys} />);
    expect(html).toContain('Tila valitsematta');
    expect(html).toContain('Minulla on tila');
    expect(html).not.toMatch(/Se on|jäisi pois/);
    const own = finished('keikka', 'own', { revealed: true });
    e = ev(own);
    expect(render(<Plan s={state(own)} ev={e} keys={keys} />)).not.toContain('Tila valitsematta');
  });
  it('the "en tiedä" prompt shows from three unknowns at the own venue and closes for good', () => {
    const p = finished('keikka', 'own', { revealed: true });
    for (const k of ['v_pa', 'v_stage', 'v_access']) p.answers[k] = 'unknown';
    expect(ev(p).facts.venue_unknown).toHaveLength(3);
    expect(render(<Plan s={state(p)} ev={ev(p)} keys={keys} />)).toContain('Et ollut varma 3');
    const two = { ...p, answers: { ...p.answers, v_access: 'yes' } };
    expect(render(<Plan s={state(two)} ev={ev(two)} keys={keys} />)).not.toContain('Et ollut varma');
    const off = { ...p, unknownPromptOff: true };
    expect(render(<Plan s={state(off)} ev={ev(off)} keys={keys} />)).not.toContain('Et ollut varma');
  });
  it('two phases under 42 days with the banner, five otherwise; the short banner under 14', () => {
    const soon = finished('keikka', 'own', { revealed: true, cover: { type: 'keikka', date: '2026-10-20', headcount: 120, pub: true } });
    let e = ev(soon);
    expect(e.two).toBe(true);
    let html = render(<Plan s={state(soon)} ev={e} keys={keys} />);
    expect(html).toContain('Alle kuusi viikkoa');
    expect(html.match(/class="phase"/g).length).toBeLessThanOrEqual(2);
    const rush = finished('keikka', 'own', { revealed: true, cover: { type: 'keikka', date: '2026-10-01', headcount: 120, pub: true } });
    e = ev(rush);
    html = render(<Plan s={state(rush)} ev={e} keys={keys} />);
    expect(html).toContain('8 päivää on vähän');
    expect(html).toContain('class="latebox"');
    const far = finished('keikka', 'own', { revealed: true });
    e = ev(far);
    expect(e.two).toBe(false);
    expect(render(<Plan s={state(far)} ev={e} keys={keys} />).match(/class="phase"/g).length).toBe(5);
    expect(phaseRange(e.phases[0], e.E)).toMatch(/^23\.9\.2026–\d+\.\d+\.2026$/);
    expect(phaseExplain(e.phases[1], e.E)).toMatch(/^\d+ päivää ennen tapahtumaa/);
  });
  it('the download is the board: a BOM, one column per phase with tasks, every task once', () => {
    const p = finished('keikka', 'own', { revealed: true });
    const e = ev(p);
    const csv = downloadCsv(e, p, null);
    expect(csv.charCodeAt(0)).toBe(0xFEFF);
    const head = csv.slice(1).split('\r\n')[0];
    expect(head.startsWith('"Nyt · ')).toBe(true);
    expect(head.split('";"')).toHaveLength(e.phases.filter((ph) => ph.tasks.length).length);
    expect((csv.match(/"[☐☑] /g) || []).length).toBe(e.tasks.length);
  });
});

describe('TaskRow', () => {
  const p = finished('keikka', 'none', { revealed: true, done: {} });
  const e = ev(p);
  const ctx = whyCtx(e, p);
  it('date label, chips and classes follow the task state', () => {
    const pend = e.tasks.find((t) => t.pending);
    const now = { ...e.tasks.find((t) => !t.fixed && !t.pending), phase: 0, fixed: false, pending: false, late: false, dateEnd: null };
    const stat = { ...now, fixed: true, statutory: true, phase: 2, date: new Date(2026, 10, 10) };
    expect(dateLabel(pend)).toBe('ratkeaa, kun valitset tilan');
    expect(dateLabel(now)).toBe('nyt');
    expect(dateLabel(stat)).toMatch(/^viim\. \d+\.\d+\.2026$/);
    expect(dateLabel({ ...now, late: true, date: new Date(2026, 8, 1) })).toBe('oli 1.9.2026');
    expect(chipsFor(stat, false)[0]).toEqual({ cls: 'statutory', text: 'lakisääteinen' });
    expect(chipsFor({ ...stat, late: true }, false)[0]).toEqual({ cls: 'late', text: 'myöhässä' });
    expect(chipsFor({ ...now, owner: 'venue' }, false)).toEqual([{ cls: 'venue', text: 'Tila hoitaa' }]);
    expect(chipsFor({ ...now, owner: 'venue', prepareSign: true }, false)).toEqual([{ cls: 'venue', text: 'sinä allekirjoitat' }]);
    expect(chipsFor({ ...now, owner: 'none' }, false)).toEqual([{ cls: 'none', text: 'ei tarvita' }]);
    expect(chipsFor({ ...now, locked: true }, true)).toEqual([{ cls: '', text: 'järjestäjän' }]);
    const html = render(<TaskRow t={pend} ctx={ctx} ownDone={false} />);
    expect(html).toContain('class="task pending"');
    expect(html).toContain('aria-label="Tehty: ');
    expect(html).toContain('Miksi tämä on täällä?');
    noPlaceholders(html);
  });
  it('every task renders a why block with the rule id and no placeholder, list and mini', () => {
    for (const t of e.tasks) {
      const html = render(<TaskRow t={t} ctx={ctx} ownDone={false} />);
      noPlaceholders(html);
      noPlaceholders(render(<MiniRow t={t} />));
      const withWhy = render(<MiniRow t={t} ctx={ctx} />);
      expect(withWhy).toContain('aria-label="Miksi tämä on täällä?"');
      expect(withWhy).toContain('class="why"');
    }
  });
  it('ticking goes through the store and flips the class', () => {
    store._reset(state(p));
    const t = e.tasks[0];
    store.toggleDone(t.id);
    expect(store.getState().plan.done[t.id]).toBe(1);
    const e2 = ev(store.getState().plan);
    expect(render(<TaskRow t={e2.tasks.find((x) => x.id === t.id)} ctx={ctx} ownDone={false} />)).toContain('task done');
    store.toggleDone(t.id);
    expect(store.getState().plan.done[t.id]).toBeUndefined();
  });
});

describe('App wiring and hygiene', () => {
  it('a finished plan at no venue lands on the reveal, then the plan', () => {
    const p = finished('keikka', 'none');
    store._reset(state(p));
    expect(render(<App today={today} />)).toContain('Näytä suunnitelma');
    store.setFlag('revealed');
    expect(render(<App today={today} />)).toContain('Lataa taulukkona');
    store.setView('cover');
    expect(render(<App today={today} />)).toContain('class="tiles"');
    store.setView('deck'); // queue empty → back to the landing rule
    expect(render(<App today={today} />)).toContain('Lataa taulukkona');
  });
  it('no accent colour and no brand is hard-coded in a screen', () => {
    for (const f of readdirSync(HERE).filter((x) => x.endsWith('.jsx') && !x.includes('.test.'))) {
      const src = readFileSync(join(HERE, f), 'utf-8');
      expect((src.match(/#E57FB3|var\(--accent\)|var\(--pink\)/g) || []).length, f).toBe(0);
      expect(src, f).not.toMatch(/Alō|alokas|'alo'/);
    }
  });
});
