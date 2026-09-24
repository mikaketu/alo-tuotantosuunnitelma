// The plan as a board for a spreadsheet: one column per phase, one cell per
// task (a small card), in the plan's own order. UTF-8 BOM + ';' so Google
// Sheets and Finnish Excel open ä/ö and split columns without an import
// dialog; a card's two lines stay in one cell because the cell is quoted.
// Pure; the button wraps it in a Blob.
import { ts } from '../copy/ts.js';
import { taskTitle } from './render.js';

const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const fmt = (d) => (d ? `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}` : '');

/** Column head: the phase name and its window, clamped to the event day like the plan screen. */
function head(p, E) {
  if (!p.from || !p.to) return ts(`phase.${p.key}`);
  const to = E && p.to > E && p.key !== 'after' ? E : p.to;
  return `${ts(`phase.${p.key}`)} · ${ts('ui.plan.date.range', { from: fmt(p.from), to: fmt(to) })}`;
}

/** One task as a card: "☐ Title §" / "category · who · deadline". */
function card(t) {
  const owner = t.owner;
  const when = t.pending ? ts('ui.plan.date.pending') : t.date ? ts('ui.plan.date.by', { date: fmt(t.date) }) : '';
  const first = `${t.done ? '☑' : '☐'} ${taskTitle(t)}${t.statutory ? ' §' : ''}`;
  const second = [ts(`cat.${t.cat}`), ts(`ui.export.owner.${owner}`), when].filter(Boolean).join(' · ');
  return `${first}\n${second}`;
}

/** @param phases from evaluate(); @param E the event day. */
export function planCsv(phases, E = null) {
  phases = phases.map((p) => ({ ...p, tasks: p.tasks.filter((t) => !t.uncounted) }));
  const cols = phases.filter((p) => p.tasks.length);
  const depth = Math.max(0, ...cols.map((p) => p.tasks.length));
  const rows = [cols.map((p) => q(head(p, E)))];
  for (let i = 0; i < depth; i++) rows.push(cols.map((p) => q(p.tasks[i] ? card(p.tasks[i]) : '')));
  return '﻿' + rows.map((r) => r.join(';')).join('\r\n') + '\r\n';
}

export function csvFilename(dateIso) { return `${ts('ui.export.filename')}-${dateIso}.csv`; }
