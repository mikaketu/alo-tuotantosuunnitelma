import React from 'react';
import { ts, has } from '../copy/ts.js';
import * as store from '../store.js';
import { fmtShort } from '../fmt.js';
import TopBar, { Wordmark } from './TopBar.jsx';
import { canUp, upLabel } from './Card.jsx';

/** One card's saved answer in words: the option labels, "kyllä / ei / en tiedä", or the card's own ↑ label. */
export function answerText(card, value, lastDate) {
  const opt = (v) => (has(`card.${card.id}.opt.${v}`) ? ts(`card.${card.id}.opt.${v}`) : has(`value.${v}`) ? ts(`value.${v}`) : String(v));
  if (Array.isArray(value)) return value.length ? value.map(opt).join(', ') : ts('ui.answers.empty');
  if (value === 'venue' && card.id !== 'venue') return canUp(card) ? upLabel(card) : ts('ui.plan.chip.owner');
  if (card.id === 'performances' && value === 'several' && lastDate) return `${opt(value)} (${fmtShort(lastDate)})`;
  return opt(value);
}

/** "Muuta vastauksia": every question with its answer; a tap opens just that card, answering returns here. */
export default function Answers({ s, ev }) {
  const { plan } = s;
  return (
    <div className="app answers">
      <TopBar left={<Wordmark />} right={<button type="button" className="btn ghost sm" onClick={() => store.setView('plan')}>{ts('ui.answers.back')}</button>} />
      <h1 className="serif title">{ts('ui.answers.title')}</h1>
      <p className="intro">{ts('ui.answers.intro')}</p>
      <ul className="answerlist">
        {ev.cards.map((c) => {
          const v = plan.answers[c.id];
          const text = v !== undefined ? answerText(c, v, plan.answers.lastDate) : plan.later.includes(c.id) ? ts('ui.answers.later') : ts('ui.answers.none');
          return (
            <li key={c.id}>
              <button type="button" className="arow" onClick={() => store.editAnswer(c.id)}>
                <span className="q">{ts(`card.${c.id}.label`)}</span>
                <span className={`a${v === undefined ? ' open' : ''}`}>{text}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <button type="button" className="btn primary wide" onClick={() => store.setView('plan')}>{ts('ui.answers.back')}</button>
    </div>
  );
}
