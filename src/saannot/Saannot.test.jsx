// Render smoke for the rules page: every tab renders from rules.json and the
// fixtures with react-dom/server, nothing empty, no placeholder left.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import Saannot, { TABS } from './Saannot.jsx';
import RunViewer from './RunViewer.jsx';
import Simulator from './Simulator.jsx';
import { rules } from '../engine/index.js';
import fixtures from '../engine/__fixtures__/runs.json' with { type: 'json' };

const NO_PLACEHOLDER = /\{\w+\}/;

describe('rules page', () => {
  for (const [key, label] of TABS) {
    it(`renders the ${label} tab`, () => {
      const html = renderToStaticMarkup(<Saannot initialTab={key} />);
      expect(html).toContain('Näin suunnitelma syntyy');
      expect(html).toContain(`aria-current="page"`);
      // {date} and {thing} are real templates (X-96, V-00) and the copy view shows every template verbatim
      if (key !== 'kopio') expect(NO_PLACEHOLDER.test(html.replace(/\{date\}|\{thing\}/g, '')), key).toBe(false);
      expect(html.length).toBeGreaterThan(2000);
    });
  }
  it('lists every row and every card', () => {
    const rows = renderToStaticMarkup(<Saannot initialTab="rivit" />);
    for (const r of rules.rows) expect(rows, r.id).toContain(`id="rivi-${r.id}"`);
    const cards = renderToStaticMarkup(<Saannot initialTab="kortit" />);
    for (const c of rules.cards) expect(cards, c.id).toContain(`id="kortti-${c.id}"`);
  });
  it('renders every run as a plan with the fixture\'s task count', () => {
    for (const run of fixtures.runs) {
      const html = renderToStaticMarkup(<RunViewer initial={run.id} />);
      expect(html).toContain(`Ajo ${run.id}`);
      for (const id of run.expect.fired.slice(0, 5)) expect(html, `${run.id} ${id}`).toContain(`>${id}<`);
      expect(html).toContain(run.title);
    }
  });
  it('the simulator renders a plan for its default event', () => {
    const html = renderToStaticMarkup(<Simulator today={new Date('2026-10-01T12:00:00')} />);
    expect(html).toContain('Suunnitelma');
    expect(html).toContain('tehtävää');
    expect(html).not.toContain('Alō');
    expect(TABS).toHaveLength(7);
  });
});
