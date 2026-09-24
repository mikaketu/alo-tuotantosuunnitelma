#!/usr/bin/env node
// Generates fi.json and en.json from the copy master table (markdown).
//
// Usage (from the repo root):
//   node scripts/copy-master.mjs [master.md] [options]
//
// Options:
//   --out <dir>         Output directory (default: src/tuotantosuunnitelma/copy)
//   --nested            Write nested objects (a.b.c → {a:{b:{c}}}) instead of flat dotted keys
//   --include-drafts    Also write rows with status "ehdotus" or "auki" (left out by default:
//                       an undecided text must not reach the live copy, and the copy lint
//                       rejects keys no rule or screen uses)
//   --check             Validate and compare against existing JSON files, write nothing
//
// Master table columns: avain | missä näkyy | milloin | tila | fi | en
// Status (tila): "" = live, "uusi" = added, "muutettu" = text changed (both live, for review),
//                "ehdotus" = proposal, "auki" = open question, "poistetaan" = removed (never written).
// A value with significant leading/trailing whitespace, or an empty value, is written
// in the table as a JSON string literal, e.g. " ja " → `" ja "`, empty → `""`.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const masterPath =
  args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--out") ??
  "docs/copy-master.md";
const outDir = opt("--out", "src/copy");
const nested = flag("--nested");
const skipDrafts = !flag("--include-drafts");
const checkOnly = flag("--check");

const LOCALES = ["fi", "en"];
const STATUSES = new Set(["", "uusi", "muutettu", "ehdotus", "auki", "poistetaan"]);

function parseValue(raw, where) {
  const v = raw.trim();
  if (v.startsWith('"') && v.endsWith('"') && v.length >= 2) {
    try {
      return JSON.parse(v);
    } catch {
      throw new Error(`${where}: invalid quoted value ${v}`);
    }
  }
  return v;
}

function splitRow(line) {
  // "| a | b | c |" → ["a","b","c"]; cells never contain " | "
  return line.replace(/^\|\s?/, "").replace(/\s?\|$/, "").split(" | ");
}

const errors = [];
const warnings = [];
const rows = [];
const seen = new Set();

const lines = readFileSync(masterPath, "utf8").split("\n");
lines.forEach((line, idx) => {
  if (!/^\| `[^`]+` \|/.test(line)) return;
  const where = `${masterPath}:${idx + 1}`;
  const cells = splitRow(line);
  if (cells.length !== 6) {
    errors.push(`${where}: expected 6 columns, got ${cells.length}`);
    return;
  }
  const key = cells[0].replace(/`/g, "").trim();
  const status = cells[3].trim();
  if (!STATUSES.has(status)) errors.push(`${where}: unknown status "${status}" for ${key}`);
  if (seen.has(key)) errors.push(`${where}: duplicate key ${key}`);
  seen.add(key);
  let fi, en;
  try {
    fi = parseValue(cells[4], where);
    en = parseValue(cells[5], where);
  } catch (e) {
    errors.push(e.message);
    return;
  }
  rows.push({ key, status, fi, en, where });
});

const placeholders = (s) => [...s.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort().join(",");

const out = { fi: {}, en: {} };
for (const r of rows) {
  if (r.status === "poistetaan") continue;
  if (skipDrafts && (r.status === "ehdotus" || r.status === "auki")) continue;
  if (r.status === "ehdotus" || r.status === "auki")
    warnings.push(`${r.key}: status "${r.status}" – included (--include-drafts)`);
  for (const loc of LOCALES) {
    const raw = r[loc];
    if (raw === "" && !lines.some((l) => l.includes(`\`${r.key}\``) && l.includes('""')))
      errors.push(`${r.where}: empty ${loc} value for ${r.key} (write "" if intentional)`);
    if (/TODO|REMOVE|POISTETAAN/.test(raw)) errors.push(`${r.where}: ${loc} value for ${r.key} looks unfinished: ${raw}`);
  }
  if (placeholders(r.fi) !== placeholders(r.en))
    errors.push(`${r.where}: placeholder mismatch in ${r.key}: fi [${placeholders(r.fi)}] vs en [${placeholders(r.en)}]`);
  if (/!/.test(r.fi)) warnings.push(`${r.key}: fi contains "!" – check against the one-exclamation rule`);
  out.fi[r.key] = r.fi;
  out.en[r.key] = r.en;
}

function toNested(flat) {
  const root = {};
  // Sort so that parents are created before leaf/branch conflicts are detected
  for (const key of Object.keys(flat).sort()) {
    const parts = key.split(".");
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (typeof node[p] === "string") {
        errors.push(`--nested: "${parts.slice(0, i + 1).join(".")}" is both a value and a parent (e.g. ${key}); use flat output`);
        return root;
      }
      node[p] ??= {};
      node = node[p];
    }
    node[parts.at(-1)] = flat[key];
  }
  return root;
}

function flatten(obj, prefix = "", acc = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") flatten(v, key, acc);
    else acc[key] = v;
  }
  return acc;
}

const sorted = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));
const payload = {};
for (const loc of LOCALES) payload[loc] = nested ? toNested(sorted(out[loc])) : sorted(out[loc]);

// Compare with existing files
for (const loc of LOCALES) {
  const file = join(outDir, `${loc}.json`);
  if (!existsSync(file)) {
    warnings.push(`${file} does not exist yet – will be created`);
    continue;
  }
  const existing = flatten(JSON.parse(readFileSync(file, "utf8")));
  const added = Object.keys(out[loc]).filter((k) => !(k in existing));
  const removed = Object.keys(existing).filter((k) => !(k in out[loc]));
  const changed = Object.keys(out[loc]).filter((k) => k in existing && existing[k] !== out[loc][k]);
  console.log(`${loc}.json: ${changed.length} changed, ${added.length} added, ${removed.length} removed`);
  if (removed.length) console.log(`  removed: ${removed.join(", ")}`);
}

for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  console.error(`\n${errors.length} error(s) – nothing written.`);
  process.exit(1);
}

if (checkOnly) {
  console.log("check ok – nothing written (--check).");
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
for (const loc of LOCALES) {
  const file = join(outDir, `${loc}.json`);
  writeFileSync(file, JSON.stringify(payload[loc], null, 1) + "\n");
  console.log(`wrote ${file} (${Object.keys(out[loc]).length} keys)`);
}
