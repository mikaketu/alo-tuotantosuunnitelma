#!/usr/bin/env node
// Re-derive the expected sets of runs A–I from the engine. Without --write it
// prints the delta per run and exits 1 when anything differs (a rule change
// must be reviewed against the runs); with --write it rewrites `expect` and
// leaves everything else (inputs, doc counts, notes) as it is.
//   npm run fixtures:check     npm run fixtures:write
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluate } from '../src/engine/index.js';
import { parseIso } from '../src/engine/dates.js';

const P = resolve(dirname(fileURLToPath(import.meta.url)), '../src/engine/__fixtures__/runs.json');
const write = process.argv.includes('--write');
const fx = JSON.parse(readFileSync(P, 'utf-8'));
const today = parseIso(fx.today);
const diff = (a, b) => ({ gone: a.filter((x) => !b.includes(x)), added: b.filter((x) => !a.includes(x)) });
let changed = 0;
for (const run of fx.runs) {
  const plan = { v: 2, cover: run.cover, answers: run.answers, later: [], owners: {}, done: {} };
  const res = evaluate(plan, today);
  const next = {
    fired: res.tasks.filter((t) => !t.pending).map((t) => t.id),
    pending: res.tasks.filter((t) => t.pending).map((t) => t.id),
    statutory: res.tasks.filter((t) => t.statutory).map((t) => t.id),
    suppressed: res.suppressed.map((s) => s.id),
    variants: Object.fromEntries(res.tasks.filter((t) => t.variant).map((t) => [t.id, t.variant])),
    cards: res.cards.length, tasks: res.tasks.length, phases: res.phases.length,
  };
  const e = run.expect || {};
  const out = [];
  for (const k of ['fired', 'pending', 'statutory', 'suppressed']) { const d = diff(e[k] || [], next[k]); if (d.gone.length || d.added.length) out.push(`${k}: -${d.gone} +${d.added}`); }
  if (JSON.stringify(e.variants || {}) !== JSON.stringify(next.variants)) out.push('variants changed');
  for (const k of ['cards', 'tasks', 'phases']) if (e[k] !== next[k]) out.push(`${k} ${e[k]}→${next[k]}`);
  console.log(run.id, out.length ? out.join(' | ') : 'unchanged');
  if (out.length) changed += 1;
  run.expect = next;
}
if (write) { writeFileSync(P, JSON.stringify(fx, null, 1) + '\n'); console.log(`wrote ${P}`); }
else if (changed) { console.log(`${changed} run(s) differ — review, then npm run fixtures:write`); process.exit(1); }
