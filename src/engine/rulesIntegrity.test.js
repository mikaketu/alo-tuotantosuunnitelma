// Pins the shape of rules.json: every row and card well-formed, every trigger
// over known facts, every organiser-only lock present, every statute known.
import { describe, it, expect } from 'vitest';
import { rules } from './index.js';
import { factsIn } from './trigger.js';
import { factsOf, FACT_CARDS } from './facts.js';
import { scopedTrigger } from './tasks.js';

const ID_RE = /^[A-Z]{1,3}-\d{2,3}$/;
const sampleFacts = factsOf(rules, { type: 'keikka', date: '2026-12-01', headcount: 120, pub: true }, { venue: 'own' }, new Date('2026-10-01T12:00:00'));
const knownFacts = new Set(Object.keys(sampleFacts));
const LOCKED = ['C-01','P-01','C-02','P-02','C-03','P-07','C-10','C-12','C-13','C-20','C-21','C-22','C-24','C-62','H-01','H-02','H-03','H-04','TE-02','X-92','X-94','P-31','MU-10','MU-11','V-01','V-00','F-01','F-02','F-03',
  // Dealing with the venue and closing up are the organiser's at every venue.
  'C-14','C-15','C-16','K-01','P-54'];

describe('rules.json rows', () => {
  const ids = rules.rows.map((r) => r.id);
  it('ids are unique and shaped', () => { expect(new Set(ids).size).toBe(ids.length); ids.forEach((id) => expect(id).toMatch(ID_RE)); });
  it('every trigger references known facts', () => {
    for (const r of rules.rows) for (const f of factsIn(scopedTrigger(r))) expect(knownFacts.has(f), `${r.id} → ${f}`).toBe(true);
    for (const c of rules.cards) { for (const f of factsIn(c.asked)) expect(knownFacts.has(f), `${c.id} asked → ${f}`).toBe(true); if (c.applies && c.applies !== true) for (const f of factsIn(c.applies)) expect(knownFacts.has(f)).toBe(true); }
    for (const [k, t] of Object.entries(rules.derived)) for (const f of factsIn(t)) expect(knownFacts.has(f), `derived ${k} → ${f}`).toBe(true);
  });
  it('a row has exactly one deadline shape', () => {
    for (const r of rules.rows) {
      const d = r.deadline;
      const shapes = [!!d.phase, !!d.fixed].filter(Boolean).length;
      expect(shapes, r.id).toBe(1);
      if (d.phase) expect(rules.phases).toContain(d.phase);
      if (d.phase_end) expect(rules.phases).toContain(d.phase_end);
      if (d.fixed) { expect(typeof d.fixed.offset).toBe('number'); expect(['statutory', 'contractual']).toContain(d.fixed.kind); if (d.fixed.kind === 'statutory') expect(rules.statutes[d.fixed.statute], r.id).toBeTruthy(); }
      if (d.notice) expect(rules.statutes[d.notice.statute], r.id).toBeTruthy();
    }
  });
  it('categories, decks, owners and services are from the closed vocabularies', () => {
    for (const r of rules.rows) {
      expect(rules.categories).toContain(r.cat); expect(['both', 'closed', 'public']).toContain(r.deck); expect(['mine', 'prepare_sign']).toContain(r.owner);
      if (r.type) expect(Object.keys(rules.types)).toContain(r.type);
      if (r.service) expect(rules.services, `${r.id} service ${r.service}`).toContain(r.service);
      if (r.repeat) expect(['venue_unknown', 'performance_dates']).toContain(r.repeat);
      for (const v of r.variants || []) expect(v.key).toMatch(/^[a-zA-Z0-9]+$/);
    }
  });
  it('every organiser-only lock is present and prepare/sign rows are not locked', () => {
    const locked = new Set(rules.rows.filter((r) => r.locked).map((r) => r.id));
    for (const id of LOCKED) expect(locked.has(id), id).toBe(true);
    for (const id of ['P-30', 'X-90', 'X-91', 'X-31']) { const r = rules.rows.find((x) => x.id === id); expect(r.owner).toBe('prepare_sign'); expect(r.locked).toBeFalsy(); }
  });
});

describe('rules.json types', () => {
  it('every type lists its services from the vocabulary, and no rule mentions a venue by name', () => {
    for (const [k, t] of Object.entries(rules.types)) { expect(Array.isArray(t.services), k).toBe(true); for (const s of t.services) expect(rules.services, `${k} → ${s}`).toContain(s); }
    expect(JSON.stringify(rules)).not.toMatch(/"alo"|Alō|aloFit|quoteServices/);
    for (const c of rules.cards) if (c.up !== undefined) expect(c.up, c.id).toBe(true);
  });
});

describe('rules.json cards', () => {
  it('running order is acyclic: a card never depends on a later card', () => {
    const order = rules.cards.map((c) => c.id);
    const cardOf = (f) => FACT_CARDS[f] || (f.startsWith('venue.') ? `v_${f.slice(6)}` : null);
    const deps = (t) => { const out = new Set(); const walk = (name) => { const c = cardOf(name); if (c) out.add(c); else if (rules.derived[name]) factsIn(rules.derived[name]).forEach(walk); }; factsIn(t).forEach(walk); return out; };
    rules.cards.forEach((c, i) => { for (const d of deps(c.asked)) if (d !== c.id) expect(order.indexOf(d), `${c.id} depends on ${d}`).toBeLessThan(i); });
  });
  it('venue capability cards cover every venueKey and v0pre keys exist', () => {
    const caps = rules.cards.filter((c) => c.kind === 'cap').map((c) => c.capability);
    expect(caps.sort()).toEqual([...rules.venueKeys].sort());
    for (const k of rules.v0pre) expect(rules.cards.find((c) => c.capability === k).v0pre).toBe(true);
  });
  it('card 1 is venue and the capability block is last', () => {
    expect(rules.cards[0].id).toBe('venue');
    const firstCap = rules.cards.findIndex((c) => c.section === 'capabilities');
    expect(rules.cards.slice(firstCap).every((c) => c.section === 'capabilities')).toBe(true);
  });
});
