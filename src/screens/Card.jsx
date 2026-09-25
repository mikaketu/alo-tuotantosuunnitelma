import React from 'react';
import { ts, has } from '../copy/ts.js';
import { askedBecause } from '../engine/render.js';
import { addDays, parseIso, toIso } from '../engine/dates.js';
import { fmtShort } from '../fmt.js';
import Calendar from './Calendar.jsx';

export const SWIPE_KINDS = new Set(['venue', 'yesno', 'cap']);
export const isTapOnly = (card) => !SWIPE_KINDS.has(card.kind);

/** What a swipe direction answers on this card. The venue card has no ↑. */
export function commitValue(card, dir) {
  if (card.kind === 'venue') return dir === 'left' ? 'none' : 'own';
  if (card.kind === 'cap') return dir === 'left' ? 'no' : dir === 'right' ? 'yes' : 'unknown';
  if (dir === 'up') return 'venue';
  return dir === 'left' ? 'no' : 'yes';
}

export function cardQuestion(card, type) {
  const k = `card.${card.id}.q.${type}`;
  return has(k) ? ts(k) : ts(`card.${card.id}.q`);
}

/**
 * Whether ↑ is offered on this card. The capability cards (↑ = "En tiedä")
 * always have it; the venue card never (it says where, it hands nothing over).
 * A question card has it only when what it asks about is a service the venue
 * can take over — `rules.json` card `up: true`. "Kyllä / Ei" says whether;
 * ↑ says who — on a fact ("Onko osa ulkona?") a "Tila hoitaa" button would
 * read as the venue answering the question.
 */
export function canUp(card) {
  if (card.kind === 'cap') return true;
  if (card.kind === 'venue') return false;
  return card.up === true;
}

/** The ↑ label of a hand-over card: always the card's own ("Tila hoitaa ripustuksen"). */
export function upLabel(card) {
  return ts(`card.${card.id}.up`);
}

function Stamps({ card }) {
  const upStamp = canUp(card) ? <span className="stamp u venue" data-stamp="u">{ts('ui.stamp.up')}</span> : null;
  if (card.kind === 'venue') return <><span className="stamp l" data-stamp="l">{ts('ui.stamp.notYet')}</span><span className="stamp" data-stamp="r">{ts('ui.stamp.yes')}</span></>;
  if (card.kind === 'cap') return <><span className="stamp l" data-stamp="l">{ts('ui.stamp.hasNot')}</span><span className="stamp" data-stamp="r">{ts('ui.stamp.has')}</span><span className="stamp u n" data-stamp="u">{ts('ui.stamp.unknown')}</span></>;
  if (card.kind === 'yesno') return <><span className="stamp l" data-stamp="l">{ts('ui.stamp.no')}</span><span className="stamp" data-stamp="r">{ts('ui.stamp.yes')}</span>{upStamp}</>;
  return upStamp;
}

/**
 * One card, six kinds. `front` cards get the drag ref and the buttons; `back`
 * cards are inert previews. All handlers come from Deck so keys and buttons
 * share them: onFly(dir) · onTap(value) · onToggle(opt) · onConfirm() ·
 * onPerf('one'|'several') · onLastDate(iso) · onPerfReset().
 */
export default function Card({ card, facts, type, front, dragRef, capPos, eventDate, today, sel = [], several = false, picked = null, h }) {
  const q = cardQuestion(card, type);
  const help = has(`card.${card.id}.help`) ? ts(`card.${card.id}.help`) : null;
  const why = front && facts ? askedBecause(card, facts) : null;
  const eyebrow = card.kind === 'cap' && capPos
    ? `${ts('section.capabilities')} · ${ts('ui.deck.capCount', { i: capPos.i, n: capPos.n })}`
    : ts(`section.${card.section}`);
  const cls = `card ${front ? 'front' : 'back'}`;
  const props = front ? { ref: dragRef, role: 'group', 'aria-label': ts('ui.a11y.cardGroup', { q }) } : { 'aria-hidden': true, tabIndex: -1 };
  // A card may name its own answers ("Ei mahdu / Mahtuu"); else the kind's defaults.
  const left = has(`card.${card.id}.left`) ? ts(`card.${card.id}.left`) : card.kind === 'venue' ? ts('card.venue.opt.none') : card.kind === 'cap' ? ts('ui.deck.hasNot') : ts('ui.deck.no');
  const right = has(`card.${card.id}.right`) ? ts(`card.${card.id}.right`) : card.kind === 'venue' ? ts('card.venue.opt.own') : card.kind === 'cap' ? ts('ui.deck.has') : ts('ui.deck.yes');
  const withUp = canUp(card);
  const up = !withUp ? null : card.kind === 'cap' ? ts('ui.deck.unknown') : upLabel(card);
  const upCls = card.kind === 'cap' ? 'ghost' : 'venue';
  const upBtn = (wide) => (withUp ? <button type="button" className={`btn ${upCls}${wide ? ' wide' : ''}`} onClick={() => h.onFly('up')}>↑{'\u00a0'}{up}</button> : null);

  let body = null, actions = null;
  if (card.kind === 'opt') {
    body = (
      <div className="opts">
        {card.options.map((o, i) => (
          <button key={o} type="button" className="opt" aria-pressed={picked === o} onClick={() => h.onTap(o)}><span className="key" aria-hidden="true">{i + 1}</span>{ts(`card.${card.id}.opt.${o}`)}</button>
        ))}
      </div>
    );
    actions = withUp ? <div className="actions">{upBtn(true)}</div> : null;
  } else if (card.kind === 'multi') {
    body = (
      <div className="opts">
        {card.options.map((o, i) => (
          <button key={o} type="button" className="opt" aria-pressed={sel.includes(o)} onClick={() => h.onToggle(o)}>
            {i < 4 && <span className="key" aria-hidden="true">{i + 1}</span>}{ts(`card.${card.id}.opt.${o}`)}
          </button>
        ))}
      </div>
    );
    actions = (
      <div className={withUp ? 'actions two' : 'actions'}>
        {upBtn(false)}
        <button type="button" className={`btn primary${withUp ? '' : ' wide'}`} disabled={!sel.length && !card.optional} onClick={() => h.onConfirm()}>{ts(`card.${card.id}.confirm`)}{'\u00a0'}→</button>
      </div>
    );
  } else if (card.kind === 'perf') {
    const minIso = toIso(addDays(parseIso(eventDate), 1));
    body = several ? (
      <div className="opts">
        <span className="eyebrow navy">{ts('card.performances.lastDate', { date: fmtShort(eventDate) })}</span>
        <Calendar value={minIso} min={minIso} today={today} onPick={(iso) => h.onLastDate(iso)} />
        <button type="button" className="btn text sm" onClick={() => h.onPerfReset()}>{ts('card.performances.reset')}</button>
      </div>
    ) : (
      <div className="opts">
        {card.options.map((o, i) => (
          <button key={o} type="button" className="opt" aria-pressed={picked === o} onClick={() => h.onPerf(o)}><span className="key" aria-hidden="true">{i + 1}</span>{ts(`card.${card.id}.opt.${o}`)}</button>
        ))}
      </div>
    );
    actions = withUp ? <div className="actions">{upBtn(true)}</div> : null;
  } else {
    actions = (
      <div className={withUp ? 'actions three' : 'actions two'}>
        <button type="button" className="btn ghost" onClick={() => h.onFly('left')}>←{'\u00a0'}{left}</button>
        {upBtn(false)}
        <button type="button" className="btn primary" onClick={() => h.onFly('right')}>{right}{'\u00a0'}→</button>
      </div>
    );
  }

  return (
    <div className={cls} {...props}>
      {front && <Stamps card={card} />}
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="serif q">{q}</h2>
      {help && !(card.kind === 'perf' && several) && <p className="h">{help}</p>}
      {why && <p className="muted why">{why}</p>}
      {front ? body : body && <div inert="">{body}</div>}
      <div className="hints">
        {front && actions}
      </div>
    </div>
  );
}
