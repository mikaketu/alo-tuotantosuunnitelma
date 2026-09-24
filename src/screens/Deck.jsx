import React, { useState } from 'react';
import { ts } from '../copy/ts.js';
import * as store from '../store.js';
import { useDrag } from '../useDrag.js';
import TopBar, { Wordmark } from './TopBar.jsx';
import Progress from './Progress.jsx';
import Card, { canUp, commitValue, isTapOnly } from './Card.jsx';

/** The deck: the front card is `queue[0]`, the next card peeks behind it. Every answer path goes through `commit`. */
export default function Deck({ s, ev, keys, today }) {
  const { plan } = s;
  // Editing one answer from the answers list shows just that card; otherwise the queue.
  const editing = s.editing ? ev.cards.find((c) => c.id === s.editing) : null;
  const card = editing || ev.queue[0];
  const next = editing ? null : ev.queue[1];
  const tapOnly = isTapOnly(card);
  // Per-card scratch state (multi selection, "several" mode), keyed by card id so a new card starts clean.
  const [scratch, setScratch] = useState({ id: null, sel: [], several: false });
  const saved = plan.answers[card.id];
  const sel = scratch.id === card.id ? scratch.sel : editing && Array.isArray(saved) ? saved : [];
  const several = scratch.id === card.id ? scratch.several : false;
  const setSel = (v) => setScratch({ id: card.id, sel: v, several });
  const setSeveral = (v) => setScratch({ id: card.id, sel, several: v });

  const commit = (dir) => store.answer(card.id, commitValue(card, dir));
  const withUp = canUp(card);
  const drag = useDrag({ allow: { lr: !tapOnly, up: withUp }, onCommit: commit, key: card.id });
  const fly = (dir) => {
    if (dir === 'up' ? !withUp : tapOnly) return false;
    drag.api.fly(dir, commit);
    return true;
  };

  const h = {
    onFly: fly,
    onTap: (o) => store.answer(card.id, o),
    onToggle: (o) => {
      if (card.exclusive && card.exclusive.includes(o)) setSel(sel.includes(o) ? [] : [o]);
      else setSel(sel.includes(o) ? sel.filter((x) => x !== o) : sel.filter((x) => !(card.exclusive || []).includes(x)).concat(o));
    },
    onConfirm: () => { if (sel.length || card.optional) { store.answer(card.id, [...sel]); return true; } return false; },
    onPerf: (o) => { if (o === 'several') setSeveral(true); else store.answer(card.id, 'one'); },
    onLastDate: (iso) => { store.setLastDate(iso); store.answer(card.id, 'several'); },
    onPerfReset: () => setSeveral(false),
  };
  const option = (i) => {
    const o = card.options && card.options[i];
    if (!o) return false;
    if (card.kind === 'opt') h.onTap(o);
    else if (card.kind === 'multi') h.onToggle(o);
    else if (card.kind === 'perf') h.onPerf(o);
    else return false;
    return true;
  };
  keys.current = {
    ...keys.current, view: 'deck', tapOnly,
    left: () => fly('left'), right: () => fly('right'), up: () => fly('up'),
    later: () => { store.defer(card.id); return true; },
    option, confirm: () => (card.kind === 'multi' ? h.onConfirm() : false),
  };


  const capCards = ev.cards.filter((c) => c.kind === 'cap');
  const capPos = card.kind === 'cap' ? { i: capCards.findIndex((c) => c.id === card.id) + 1, n: capCards.length } : null;
  const backToAnswers = <button type="button" className="btn text sm" onClick={() => store.openAnswers()}>← {ts('ui.answers.title')}</button>;
  const common = { facts: ev.facts, type: plan.cover.type, eventDate: plan.cover.date, today };

  return (
    <div className="app screen deck">
      <TopBar
        left={editing ? backToAnswers : s.undo.length ? <button type="button" className="btn text sm" onClick={() => store.undo()}>↶ {ts('ui.deck.undo')}</button> : <Wordmark />}
        right={<button type="button" className="btn ghost sm" onClick={() => store.setView('exit')}>{ts('ui.deck.exit')}</button>}
      />
      <Progress cards={ev.cards} answers={plan.answers} current={card} />
      <div className="stage">
        <div className="card back2" aria-hidden="true" />
        {next && <Card key={`b-${next.id}`} card={next} {...common} />}
        <Card key={card.id} card={card} front dragRef={drag.ref} capPos={capPos} sel={sel} several={several} h={h} {...common} />
      </div>
      <div className="later"><button type="button" className="btn text" onClick={() => store.defer(card.id)}>{ts('ui.deck.later')}</button></div>
      <div className="keys" aria-hidden="true">
        <span className="eyebrow">{ts('ui.keys.title')}</span>
        <span><i className="key">←</i>{withUp && <i className="key">↑</i>}<i className="key">→</i> {ts('ui.keys.answer')}</span>
        <span><i className="key">M</i> {ts('ui.keys.later')}</span>
        <span><i className="key">Z</i> {ts('ui.keys.undo')}</span>
        <span><i className="key">Esc</i> {ts('ui.keys.exit')}</span>
      </div>
    </div>
  );
}
