import { describe, it, expect } from 'vitest';
import { evaluate } from './index.js';
import { planCsv, csvFilename } from './exportCsv.js';
import { taskTitle } from './render.js';
import fixtures from './__fixtures__/runs.json' with { type: 'json' };
import { parseIso } from './dates.js';

// Reads the file the way a spreadsheet does: ';' between cells, quoted cells
// may hold '""' and line breaks.
function parse(csv) {
  const rows = []; let row = [], cell = '', inQ = false;
  const s = csv.replace(/^﻿/, '');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQ) { if (c === '"' && s[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') inQ = false; else cell += c; }
    else if (c === '"') inQ = true;
    else if (c === ';') { row.push(cell); cell = ''; }
    else if (c === '\r' && s[i + 1] === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; i++; }
    else cell += c;
  }
  return rows;
}

describe('planCsv — the plan as a board (one column per phase)', () => {
  const run = fixtures.runs.find((r) => r.id === 'D');
  const res = evaluate({ v: 2, cover: run.cover, answers: run.answers, later: [], owners: { 'P-22': 'venue' }, done: { 'P-01': 1 } }, parseIso(fixtures.today));
  const csv = planCsv(res.phases, res.E);
  const rows = parse(csv);
  // SU-99 and any other `uncounted` row stay out of the export (owner 2026-09-24).
  const cols = res.phases.map((p) => ({ ...p, tasks: p.tasks.filter((t) => !t.uncounted) })).filter((p) => p.tasks.length);
  const cellOf = (id) => {
    const t = res.tasks.find((x) => x.row === id);
    for (const r of rows.slice(1)) for (const c of r) if (c.split('\n')[0].includes(taskTitle(t))) return c;
    return null;
  };

  it('starts with a BOM; the head row names every phase that has tasks, with its dates', () => {
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(rows[0]).toHaveLength(cols.length);
    expect(rows[0][0]).toMatch(/^Nyt · \d{1,2}\.\d{1,2}\.\d{4}–\d{1,2}\.\d{1,2}\.\d{4}$/);
  });
  it('stacks each phase\'s tasks under its column, in plan order, every row the same width', () => {
    expect(rows.length - 1).toBe(Math.max(...cols.map((p) => p.tasks.length)));
    for (const r of rows) expect(r).toHaveLength(cols.length);
    cols.forEach((p, ci) => p.tasks.forEach((t, ri) => expect(rows[ri + 1][ci].split('\n')[0]).toContain(taskTitle(t))));
    const cards = rows.slice(1).flat().filter(Boolean);
    expect(cards).toHaveLength(res.tasks.length);
  });
  it('a card reads "☐ title" then "category · who · deadline"; done ☑, statutory §, the venue as the owner', () => {
    expect(cellOf('P-01').startsWith('☑ ')).toBe(true);
    expect(cellOf('P-30').split('\n')[0]).toMatch(/ §$/);
    expect(cellOf('P-22').split('\n')[1]).toContain('tila');
    const plain = cellOf('C-10') || cellOf('P-02');
    expect(plain).toMatch(/^☐ .+\n.+ · minä · viim\. \d/);
  });
  it('shows a pending date in words and names the file by date', () => {
    const t = { ...res.tasks[0], row: 'C-01', variant: null, done: false, owner: 'me', date: null, pending: true, statutory: false };
    const out = parse(planCsv([{ key: 'now', tasks: [t] }]));
    expect(out[1][0]).toContain('ratkeaa, kun valitset tilan');
    expect(csvFilename('2026-11-15')).toBe('tuotantosuunnitelma-2026-11-15.csv');
  });
});
