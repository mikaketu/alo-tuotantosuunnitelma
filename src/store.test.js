// The store keeps the plan in this browser only: a synchronous write on every
// mutation once started, a read before the first render, undo, reset, and the
// plan as a file. No network at all.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as store from './store.js';
import { evaluate, rules } from './engine/index.js';
import { landingView } from './landing.js';

const today = new Date('2026-09-23T12:00:00');
const mem = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), _m: m }; };
let ls;

beforeEach(() => {
  ls = mem();
  vi.stubGlobal('localStorage', ls);
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('no network in the store'); }));
  store.setToday(today);
  store._reset();
});

const cover = { type: 'keikka', date: '2026-11-20', headcount: 120, pub: true };

describe('persistence', () => {
  it('the cover alone writes nothing; "Aloita" and every mutation after it write the document at once', () => {
    store.setCover(cover);
    expect(ls._m.size).toBe(0);
    store.start();
    expect(ls._m.has(store.KEY)).toBe(true);
    store.answer('venue', 'own');
    const saved = JSON.parse(ls.getItem(store.KEY));
    expect(saved.plan.answers.venue).toBe('own');
    expect(saved.v).toBe(2);
    expect(fetch).not.toHaveBeenCalled();
  });
  it('the saved document is the plan shape only: no navigation, no client fields, no old fields', () => {
    store.setCover(cover); store.start(); store.answer('venue', 'own');
    const keys = Object.keys(JSON.parse(ls.getItem(store.KEY)).plan).sort();
    expect(keys).toEqual(['answers', 'cover', 'done', 'later', 'own', 'owners', 'revealed', 'rules_version', 'started', 'v']);
  });
  it('load() restores the plan and the landing rule lands on the first unanswered card', () => {
    store.setCover(cover); store.start(); store.answer('venue', 'own'); store.answer('programme', ['live']);
    store._reset();
    expect(store.getState().plan.started).toBe(false);
    expect(store.load()).toBe(true);
    const plan = store.getState().plan;
    expect(plan.answers).toEqual({ venue: 'own', programme: ['live'] });
    const e = evaluate(plan, today);
    expect(landingView(plan, e.queue)).toBe('deck');
    expect(e.queue[0].id).toBe(e.cards[2].id);
  });
  it('load() on nothing, or on a broken record, leaves a fresh cover', () => {
    expect(store.load()).toBe(false);
    ls.setItem(store.KEY, '{not json');
    expect(store.load()).toBe(false);
    expect(store.getState().plan.started).toBe(false);
  });
  it('an older document gets the defaults and loses the fields this version does not keep', () => {
    ls.setItem(store.KEY, JSON.stringify({ v: 1, plan: { v: 1, cover, started: true, answers: { venue: 'own' }, view: 'exit', matched: true, coached: true, upVenue: 'venue' } }));
    expect(store.load()).toBe(true);
    const p = store.getState().plan;
    expect(p.owners).toEqual({}); expect(p.done).toEqual({}); expect(p.own).toEqual({ cat: 0, mode: 'cat', done: false });
    for (const k of ['view', 'matched', 'coached', 'upVenue']) expect(k in p).toBe(false);
    expect(p.v).toBe(2);
  });
  it('reset() removes the saved plan at once', () => {
    store.setCover(cover); store.start();
    store.reset();
    expect(ls.getItem(store.KEY)).toBe(null);
    expect(store.getState().plan.started).toBe(false);
  });
});

describe('mutations', () => {
  it('answer removes the card from later, "one" drops lastDate, undo restores both', () => {
    store.setCover(cover); store.start();
    store.defer('programme');
    expect(store.getState().plan.later).toEqual(['programme']);
    store.answer('programme', ['live']);
    expect(store.getState().plan.later).toEqual([]);
    store.setLastDate('2026-11-22'); store.answer('performances', 'several');
    store.answer('performances', 'one');
    expect(store.getState().plan.answers.lastDate).toBeUndefined();
    store.undo();
    expect(store.getState().plan.answers.performances).toBe('several');
    expect(store.getState().plan.answers.lastDate).toBe('2026-11-22');
    expect(store.undo()).toBe(true); expect(store.undo()).toBe(true);
    expect(store.getState().plan.later).toEqual(['programme']);
    expect(store.undo()).toBe(true);
    expect(store.getState().plan.later).toEqual([]);
    expect(store.undo()).toBe(false);
  });
  it('the ownership pass: the category card decides undecided tasks only, locked rows keep their default, undo reverses the whole step', () => {
    store.setCover(cover); store.start(); store.answer('venue', 'own');
    const e = evaluate(store.getState().plan, today);
    const cat = e.tasks.filter((t) => t.cat === 'security' && !t.pending);
    const locked = cat.find((t) => t.locked), free = cat.find((t) => !t.locked);
    store.ownDecide(free, 'none');
    store.catDecide('venue', cat);
    const owners = store.getState().plan.owners;
    expect(owners[free.id]).toBe('none');
    expect(owners[locked.id]).toBe('me');
    expect(cat.filter((t) => !t.locked && t.id !== free.id).every((t) => owners[t.id] === 'venue')).toBe(true);
    expect(store.getState().plan.own.cat).toBe(1);
    store.undo();
    expect(store.getState().plan.owners).toEqual({ [free.id]: 'none' });
    expect(store.getState().plan.own.cat).toBe(0);
  });
  it('setView never touches the document; a reload lands by the rule', () => {
    store.setCover(cover); store.start();
    store.setView('exit');
    expect(store.getState().nav).toBe('exit');
    expect('view' in JSON.parse(ls.getItem(store.KEY)).plan).toBe(false);
    store.resume();
    expect(store.getState().nav).toBe(null);
  });
});

describe('the plan as a file', () => {
  it('exportJson → importJson round-trips the document and persists it', () => {
    store.setCover(cover); store.start(); store.answer('venue', 'own'); store.toggleDone('C-01');
    const file = store.exportJson();
    expect(file.format).toBe(store.FILE_FORMAT);
    expect(file.rules_version).toBe(rules.version);
    store.reset();
    store.importJson(JSON.stringify(file));
    const p = store.getState().plan;
    expect(p.started).toBe(true);
    expect(p.answers.venue).toBe('own');
    expect(p.done).toEqual({ 'C-01': 1 });
    expect(JSON.parse(ls.getItem(store.KEY)).plan.done).toEqual({ 'C-01': 1 });
  });
  it('importJson refuses anything that is not a plan file', () => {
    expect(() => store.importJson('{}')).toThrow();
    expect(() => store.importJson('nope')).toThrow();
    expect(() => store.importJson(JSON.stringify({ format: store.FILE_FORMAT, plan: { cover: { type: 'zzz', date: '2026-11-20' } } }))).toThrow();
    expect(store.getState().plan.started).toBe(false);
  });
});
