// The tool's own copy lint. Pins: every id in rules.json has copy, no orphan
// keys, every ui/why/rule key is referenced by a screen, tone rules, forbidden
// button words, no brand anywhere, and no network call in the source.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import FI from './fi.json' with { type: 'json' };
import EN from './en.json' with { type: 'json' };
import { rules } from '../engine/index.js';
import fixtures from '../engine/__fixtures__/runs.json' with { type: 'json' };

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const keys = Object.keys(FI);

function walk(dir, out = []) { for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) { if (f !== 'saannot') walk(p, out); } else if (/\.(jsx?|mjs)$/.test(f) && !/\.test\./.test(f)) out.push(p); } return out; }
// The rules page (src/saannot) is a reader's view with literal Finnish chrome; it is not the visitor surface.
const files = walk(ROOT).filter((p) => !p.endsWith('saannot.jsx'));
const sources = files.map((p) => readFileSync(p, 'utf-8')).join('\n');
const BRAND = /Alō|Alōn|Alōssa|Alōlle|Alōlta|Pylvässali|alohelsinki|alokas\.fi/;

describe('completeness', () => {
  it('every card has a question, a label and option labels', () => {
    for (const c of rules.cards) {
      expect(FI[`card.${c.id}.q`], c.id).toBeTruthy(); expect(FI[`card.${c.id}.label`], c.id).toBeTruthy();
      for (const o of c.options || []) expect(FI[`card.${c.id}.opt.${o}`], `${c.id}.${o}`).toBeTruthy();
      if (c.up) expect(FI[`card.${c.id}.up`], `${c.id}.up`).toBeTruthy();
    }
  });
  it('every row and variant has a title', () => {
    for (const r of rules.rows) { expect(FI[`row.${r.id}.title`], r.id).toBeTruthy(); for (const v of r.variants || []) expect(FI[`row.${r.id}.title.${v.key}`], `${r.id}.${v.key}`).toBeTruthy(); }
  });
  it('every statute, venue thing, service, type, bucket, category, phase and derived fact has copy', () => {
    for (const k of Object.keys(rules.statutes)) { expect(FI[`statute.${k}.label`]).toBeTruthy(); expect(FI[`statute.${k}.note`]).toBeTruthy(); }
    for (const k of rules.venueKeys) expect(FI[`venue.${k}`], k).toBeTruthy();
    for (const k of rules.services) expect(FI[`service.${k}`], k).toBeTruthy();
    for (const k of Object.keys(rules.types)) expect(FI[`type.${k}`]).toBeTruthy();
    for (const k of rules.headcount) expect(FI[`head.${k}`]).toBeTruthy();
    for (const k of rules.categories) expect(FI[`cat.${k}`]).toBeTruthy();
    for (const k of Object.keys(rules.derived)) expect(FI[`fact.${k}`], k).toBeTruthy();
    for (const k of ['now', 'midway', 'threeweeks', 'eventweek', 'after']) { expect(FI[`phase.${k}`]).toBeTruthy(); expect(FI[`phase.${k}.explain`]).toBeTruthy(); }
  });
  it('no orphan row/card/statute keys (copy for something that no longer exists)', () => {
    const rowIds = new Set(rules.rows.map((r) => r.id)), cardIds = new Set(rules.cards.map((c) => c.id));
    for (const k of keys) {
      const m = k.match(/^row\.([A-Z]+-\d+)\./); if (m) expect(rowIds.has(m[1]), k).toBe(true);
      const c = k.match(/^card\.([a-z_]+)\./); if (c) expect(cardIds.has(c[1]), k).toBe(true);
      const s = k.match(/^statute\.([a-z]+)\./); if (s) expect(rules.statutes[s[1]], k).toBeTruthy();
    }
  });
  it('every ui./why./rule. key referenced in source exists, and every ui.* key is referenced somewhere', () => {
    const used = new Set([...sources.matchAll(/ts\(\s*[`'"]([a-zA-Z0-9_.]+)/g)].map((m) => m[1]).concat([...sources.matchAll(/['"`](ui\.[a-zA-Z0-9_.]+)['"`]/g)].map((m) => m[1])));
    for (const k of used) if (!/\.$|\.h$/.test(k)) expect(keys.includes(k) || keys.some((x) => x.startsWith(k + '.')), `missing ${k}`).toBe(true);
    // Template keys (`ui.summary.bar.${b[0]}`) count as referencing every key under their literal prefix.
    const prefixes = [...used].filter((k) => /\.$/.test(k));
    const referenced = (k) => used.has(k) || prefixes.some((p) => k.startsWith(p)) || [...used].some((u) => k.startsWith(u + '.'));
    for (const k of keys) if (k.startsWith('ui.')) expect(referenced(k), `unreferenced ${k}`).toBe(true);
  });
});

describe('tone', () => {
  it('no exclamation marks anywhere', () => { for (const [k, v] of Object.entries(FI)) expect(v.includes('!'), k).toBe(false); });
  it('sinä-form: no te-form pronouns or -tte verbs outside the allowlist', () => {
    const ALLOW = new Set([
      'fact.programme_own',    // "esiinnytte itse" — performers are usually a group
      'card.staffing.help',    // "Jos teette kaiken itse" — the organisers as a group
      'row.SU-08.title',       // "ehditte levittää"
    ]);
    const te = /(?<!\p{L})(te|teidän|teille|teitä|teillä|teiltä|teissä|ette)(?!\p{L})|\p{L}{3,}tte(?!\p{L})/iu;
    for (const [k, v] of Object.entries(FI)) if (!ALLOW.has(k)) expect(te.test(v), `${k}: ${v}`).toBe(false);
  });
  it('forbidden words never appear on action keys', () => {
    const forbidden = /^(Peruuta|Poistu|Apua|En osaa|Ulkoista|Tilaa)$/;
    for (const [k, v] of Object.entries(FI)) if (/^(ui\.(deck|own|stamp|plan|summary|exit|cover)\.|card\.[a-z_]+\.(opt|left|right|up|confirm))/.test(k)) expect(forbidden.test(v.trim()), `${k}: ${v}`).toBe(false);
  });
  it('keys are sorted, one per line, so a copy diff is self-describing', () => expect(keys).toEqual([...keys].sort()));
  it('no Finnish literal in engine, screen or copy source outside the copy tables', () => {
    for (const p of files) { const src = readFileSync(p, 'utf-8').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, ''); const hits = [...src.matchAll(/(['"`])([^'"`\n]*[äöåÄÖÅ][^'"`\n]*)\1/g)].map((m) => m[2]).filter((s) => !/^[\w.-]+$/.test(s)); expect(hits, p).toEqual([]); }
  });
  it('no unquoted Finnish text in JSX (<p>Tallennettu</p> must be ts())', () => {
    for (const p of files.filter((f) => f.endsWith('.jsx'))) {
      const src = readFileSync(p, 'utf-8').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
      const hits = [...src.matchAll(/(?:<[a-zA-Z][^<>]*>|<\/[a-zA-Z]+>)([^<>{}\n]*[A-Za-zÄÖÅäöå]{4,}[^<>{}\n]*)</g)].map((m) => m[1].trim()).filter((t) => t && !/^[\s←-⇿·…→↶‹›|:()?-]*(null|true|false|Enter|Esc)?[\s:()?-]*$/.test(t));
      expect(hits, p).toEqual([]);
    }
  });
});

describe('venue-neutral and offline by construction', () => {
  it('no key names a venue-owner twin, and no copy, rule, fixture or source names a brand', () => {
    for (const k of keys) expect(/\.alo(\.|$)/.test(k), k).toBe(false);
    for (const [k, v] of Object.entries(FI)) expect(BRAND.test(v), `fi ${k}: ${v}`).toBe(false);
    for (const [k, v] of Object.entries(EN)) expect(BRAND.test(v), `en ${k}: ${v}`).toBe(false);
    expect(BRAND.test(JSON.stringify(rules))).toBe(false);
    expect(BRAND.test(JSON.stringify(fixtures))).toBe(false);
    for (const p of files) expect(BRAND.test(readFileSync(p, 'utf-8')), p).toBe(false);
  });
  it('no source file talks to a network, and no literal "alo" value is left', () => {
    for (const p of files) {
      const src = readFileSync(p, 'utf-8');
      expect(/\bfetch\(|sendBeacon|XMLHttpRequest|WebSocket|EventSource/.test(src), p).toBe(false);
      expect(/['"]alo['"]/.test(src), p).toBe(false);
    }
  });
});
