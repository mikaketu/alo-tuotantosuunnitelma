import React, { useMemo, useRef } from 'react';
import { evaluate } from '../engine/index.js';
import * as store from '../store.js';
import { landingView } from '../landing.js';
import { useKeys } from '../useKeys.js';
import Cover from './Cover.jsx';
import Deck from './Deck.jsx';
import Exit from './Exit.jsx';
import Reveal from './Reveal.jsx';
import Plan from './Plan.jsx';
import Ownership from './Ownership.jsx';
import Summary from './Summary.jsx';
import Answers from './Answers.jsx';
import Intro from './Intro.jsx';
import Privacy from './Privacy.jsx';

export const canEvaluate = (plan) => !!(plan.cover && plan.cover.type && plan.cover.date);

/** Resolve the screen: an explicit navigation (exit, answers) wins, otherwise the landing rule. */
export function resolveView(s, ev) {
  if (s.nav === 'deck' && !(ev && (ev.queue.length || s.editing))) return landingView(s.plan, []);
  if (s.nav) return s.nav;
  const v = landingView(s.plan, ev ? ev.queue : []);
  // A fresh visitor meets the intro page first; a plan in progress goes straight to the cover.
  if (v === 'cover' && !s.introDone && !s.plan.started) return 'intro';
  return v;
}

const SCREENS = { cover: Cover, deck: Deck, exit: Exit, reveal: Reveal, plan: Plan, own: Ownership, summary: Summary, answers: Answers };

export default function App({ today = store.getToday() }) {
  const s = store.useStore();
  const keys = useRef({});
  useKeys(keys);

  const ev = useMemo(() => {
    if (!canEvaluate(s.plan)) return null;
    try { return evaluate(s.plan, today); } catch (_) { return null; }
  }, [s.plan, today]);

  const view = resolveView(s, ev);
  keys.current = {
    view, sheet: s.sheet,
    undo: () => store.undo(),
    exit: () => { store.setView('exit'); return true; },
    closeSheet: () => { store.openSheet(false); return true; },
  };

  let screen;
  if (view === 'deck' && ev && (ev.queue.length || s.editing)) screen = <Deck s={s} ev={ev} keys={keys} today={today} />;
  else if (view === 'intro') screen = <Intro />;
  else if (view === 'cover') screen = <Cover s={s} deckSize={ev ? ev.cards.length : 0} left={ev ? ev.queue.length : 0} today={today} />;
  else if (['reveal', 'plan', 'own', 'summary', 'answers'].includes(view) && ev) { const Screen = SCREENS[view]; screen = <Screen s={s} ev={ev} keys={keys} today={today} />; }
  else { const Screen = SCREENS[view] || Exit; screen = <Screen s={s} />; }

  return <>{screen}{s.sheet && <Privacy />}</>;
}
