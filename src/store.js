// The visitor's plan: one module store (useSyncExternalStore), the document kept
// in this browser's localStorage and nowhere else, an in-memory undo stack, and
// the plan as a file (save / open) for moving it between browsers. Nothing here
// knows about React screens, and nothing here talks to a network.
import { useSyncExternalStore } from 'react';
import { rules } from './engine/index.js';
import { addDays, toIso } from './engine/dates.js';
import { setLang, lang } from './copy/ts.js';

export const KEY = 'tuotantosuunnitelma:plan';
export const FILE_FORMAT = 'tuotantosuunnitelma-plan';

const ls = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) { /* private mode */ } },
  del(k) { try { localStorage.removeItem(k); } catch (_) { /* ignore */ } },
};

export function freshPlan(today = new Date()) {
  return {
    v: 2, rules_version: rules.version,
    cover: { type: null, date: toIso(addDays(today, 56)), headcount: null, pub: true },
    started: false, answers: {}, later: [], owners: {}, done: {},
    own: { cat: 0, mode: 'cat', done: false },
    revealed: false,
  };
}

/** A stored document merged over the defaults, so an older or pruned doc never crashes the engine. */
export function normalizePlan(doc, today = new Date()) {
  const f = freshPlan(today);
  const d = doc && typeof doc === 'object' ? doc : {};
  const out = {
    ...f, ...d,
    cover: { ...f.cover, ...(d.cover || {}) },
    answers: { ...(d.answers || {}) }, later: [...(d.later || [])],
    owners: { ...(d.owners || {}) }, done: { ...(d.done || {}) },
    own: { ...f.own, ...(d.own || {}) },
  };
  // Fields older documents carried and this version does not keep.
  for (const k of ['view', 'matched', 'coached', 'upVenue', 'laterQuote']) delete out[k];
  out.v = 2;
  return out;
}

// ── state ────────────────────────────────────────────────────────────────────

let state = {
  plan: freshPlan(), undo: [],
  nav: null,               // explicit view override ('exit', 'answers', …); null = landing rule
  editing: null,           // "Muuta vastauksia": the one answered card open in the deck
  introDone: false,        // the intro page was passed this visit (session only)
  sheet: false,            // privacy sheet open
};
const listeners = new Set();
let today = new Date();

function emit() { for (const l of listeners) l(); }
function set(patch) { state = { ...state, ...patch }; emit(); }
export function getState() { return state; }
export function subscribe(l) { listeners.add(l); return () => listeners.delete(l); }
export function useStore() { return useSyncExternalStore(subscribe, getState, getState); }
export function setToday(d) { today = d; }
export function getToday() { return today; }

// ── persistence ──────────────────────────────────────────────────────────────

/** The plan is written on every mutation once it has started; before that the cover lives in memory only. */
function persist() {
  if (!state.plan.started) return;
  ls.set(KEY, JSON.stringify({ v: 2, plan: state.plan, at: Date.now() }));
}

function mutate(fn) {
  set({ plan: fn(state.plan) });
  persist();
}

/** Read the saved plan back, once, before the first render. A missing or broken record means a fresh cover. */
export function load() {
  const raw = ls.get(KEY);
  if (!raw) return false;
  try {
    const o = JSON.parse(raw);
    if (!o || typeof o !== 'object' || !o.plan) return false;
    set({ plan: normalizePlan(o.plan, today), undo: [], nav: null, editing: null });
    return true;
  } catch (_) { return false; }
}

// ── the plan as a file ───────────────────────────────────────────────────────

export function exportJson() {
  return { format: FILE_FORMAT, v: 2, rules_version: state.plan.rules_version, exported: new Date().toISOString(), plan: state.plan };
}

/** Open a saved file: the document replaces the current plan and lands per the landing rule. Throws on anything that is not ours. */
export function importJson(text) {
  const o = JSON.parse(text);
  if (!o || o.format !== FILE_FORMAT || !o.plan || typeof o.plan !== 'object') throw new Error('not a plan file');
  const plan = normalizePlan(o.plan, today);
  if (!plan.cover.type || !rules.types[plan.cover.type]) throw new Error('unknown type');
  plan.started = true;
  set({ plan, undo: [], nav: null, editing: null });
  persist();
  return plan;
}

// ── mutations ────────────────────────────────────────────────────────────────

export function setCover(patch) {
  mutate((p) => ({ ...p, cover: { ...p.cover, ...patch } }));
}

/** "Aloita": the plan is kept from here on. */
export function start() {
  mutate((p) => ({ ...p, started: true }));
  set({ nav: null });
}

export function answer(cardId, value) {
  const p = state.plan;
  const entry = { t: 'ans', id: cardId, prev: p.answers[cardId], later: [...p.later], lastDate: p.answers.lastDate };
  mutate((q) => {
    const answers = { ...q.answers, [cardId]: value };
    if (cardId === 'performances' && value === 'one') delete answers.lastDate;
    return { ...q, answers, later: q.later.filter((x) => x !== cardId) };
  });
  set({ undo: [...state.undo, entry] });
  if (state.editing === cardId) set({ editing: null, nav: 'answers' });
}

export function setLastDate(iso) {
  mutate((q) => ({ ...q, answers: { ...q.answers, lastDate: iso } }));
}

export function defer(cardId) {
  const p = state.plan;
  const entry = { t: 'later', id: cardId, later: [...p.later] };
  mutate((q) => ({ ...q, later: q.later.filter((x) => x !== cardId).concat(cardId) }));
  set({ undo: [...state.undo, entry] });
  if (state.editing === cardId) set({ editing: null, nav: 'answers' });
}

export function undo() {
  const u = state.undo[state.undo.length - 1];
  if (!u) return false;
  set({ undo: state.undo.slice(0, -1) });
  if (u.t === 'ans') {
    mutate((q) => {
      const answers = { ...q.answers };
      if (u.prev === undefined) delete answers[u.id]; else answers[u.id] = u.prev;
      if (u.lastDate === undefined) delete answers.lastDate; else answers.lastDate = u.lastDate;
      return { ...q, answers, later: [...u.later] };
    });
  } else if (u.t === 'later') {
    mutate((q) => ({ ...q, later: [...u.later] }));
  } else if (u.t === 'own' || u.t === 'cat') {
    const prev = u.t === 'own' ? { [u.id]: u.prev } : u.prev;
    mutate((q) => {
      const owners = { ...q.owners };
      for (const [id, v] of Object.entries(prev)) { if (v === undefined) delete owners[id]; else owners[id] = v; }
      return { ...q, owners, own: { ...u.own } };
    });
  }
  return true;
}

/** The fi/en switch on the landing page: the copy table, <html lang>, ?lang= in the address and a
 *  per-viewer memory (browser storage; a blocked storage just means the choice isn't remembered). */
export function setLanguage(l) {
  setLang(l);
  if (typeof document !== 'undefined') document.documentElement.lang = lang;
  try { localStorage.setItem('ts-lang', lang); } catch (_) { /* ignore */ }
  if (typeof window !== 'undefined' && window.history && window.location) {
    const u = new URL(window.location.href);
    if (lang === 'fi') u.searchParams.delete('lang'); else u.searchParams.set('lang', lang);
    window.history.replaceState(window.history.state, '', u);
  }
  set({ lang });
}

export function setFlag(name, value = true) { mutate((q) => ({ ...q, [name]: value })); }

/** Tick / untick a task. Never scrolls, never animates — the row just changes state. */
export function toggleDone(taskId) {
  mutate((q) => { const done = { ...q.done }; if (done[taskId]) delete done[taskId]; else done[taskId] = 1; return { ...q, done }; });
}

// ── ownership pass ───────────────────────────────────────────────────────────

/** A whole category: every UNDECIDED task gets `v` ('me' → its default, locked rows always their default). Undoable as one step. */
export function catDecide(v, tasks) {
  const p = state.plan;
  const prev = {};
  const owners = { ...p.owners };
  for (const t of tasks) {
    if (owners[t.id] !== undefined) continue;
    prev[t.id] = undefined;
    owners[t.id] = v === 'me' || t.locked ? t.def : v;
  }
  const entry = { t: 'cat', prev, own: { ...p.own } };
  mutate((q) => ({ ...q, owners, own: { ...q.own, cat: q.own.cat + 1, mode: 'cat' } }));
  set({ undo: [...state.undo, entry] });
}

/** One task: ← none · → me · ↑ the venue · later. Locked rows never leave 'me'. */
export function ownDecide(task, v) {
  const p = state.plan;
  const entry = { t: 'own', id: task.id, prev: p.owners[task.id], own: { ...p.own } };
  const value = task.locked ? task.def : v;
  // One by one walks the category by position (own.i), so a second pass shows the decided tasks too.
  mutate((q) => ({ ...q, owners: { ...q.owners, [task.id]: value }, own: q.own.mode === 'tasks' ? { ...q.own, i: (q.own.i || 0) + 1 } : q.own }));
  set({ undo: [...state.undo, entry] });
}

export function dealCat() { mutate((q) => ({ ...q, own: { ...q.own, mode: 'tasks', i: 0 } })); }
export function nextCat() { mutate((q) => ({ ...q, own: { ...q.own, cat: q.own.cat + 1, mode: 'cat', i: 0 } })); }
export function finishOwn() { mutate((q) => ({ ...q, own: { ...q.own, done: true } })); set({ nav: null }); }
/** "Muokkaa vastuita": restart at category 0, decisions kept. */
export function restartOwn() { mutate((q) => ({ ...q, own: { cat: 0, mode: 'cat', i: 0, done: false } })); set({ nav: 'own', undo: [] }); }

/** Change the venue answer outside the deck (the plan's nudge). Clears undo: the deck changes shape. */
export function setVenue(value) {
  mutate((q) => ({ ...q, answers: { ...q.answers, venue: value } }));
  set({ undo: [] });
}
/** Explicit navigation: overrides the landing rule until the next answer / resume. Never stored. */
/** "Aloita" on the intro page: on to the cover's questions. */
export function closeIntro() { set({ introDone: true }); }
export function setView(view) { set({ nav: ['exit', 'cover', 'deck', 'own', 'plan', 'summary'].includes(view) ? view : null, editing: null }); }
/** "Muuta vastauksia": the answers list (a reload lands on the plan). */
export function openAnswers() { set({ nav: 'answers', editing: null }); }
/** Open one card from the answers list; answering or deferring it returns to the list. */
export function editAnswer(cardId) { set({ nav: 'deck', editing: cardId }); }
export function resume() { set({ nav: null }); }
export function openSheet(open = true) { set({ sheet: open }); }

/** Start over: the saved plan is removed from this browser at once. */
export function reset() {
  ls.del(KEY);
  state = { ...state, plan: freshPlan(today), undo: [], nav: null, editing: null, sheet: false };
  emit();
}

/** Test seam: replace the whole state. */
export function _reset(partial = {}) {
  state = { plan: freshPlan(today), undo: [], nav: null, editing: null, introDone: false, sheet: false, ...partial };
  emit();
}
