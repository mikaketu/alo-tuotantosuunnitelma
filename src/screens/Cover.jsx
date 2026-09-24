import React, { useState } from 'react';
import { ts, lang } from '../copy/ts.js';
import { rules } from '../engine/index.js';
import { bucketOf } from '../engine/facts.js';
import { diffDays, parseIso, toIso } from '../engine/dates.js';
import { fmtWeekday } from '../fmt.js';
import * as store from '../store.js';
import { SourceLink } from './Privacy.jsx';
import TopBar, { Wordmark } from './TopBar.jsx';
import Calendar from './Calendar.jsx';
import ResetBlock from './ResetBlock.jsx';
import OpenFile from './OpenFile.jsx';

const CalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

/** The only date control in the flow; target < 15 s from landing to card 1. */
/** FI · EN on the landing page (owner 2026-09-24). */
export function LangSwitch() {
  return (
    <span className="lang" role="group" aria-label={ts('ui.lang.label')}>
      {['fi', 'en'].map((l) => <button key={l} type="button" className="btn text sm" aria-pressed={lang === l} onClick={() => store.setLanguage(l)}>{ts(`ui.lang.${l}`)}</button>)}
    </span>
  );
}

export default function Cover({ s, deckSize, left = deckSize, today }) {
  const { cover, started } = s.plan;
  const [calOpen, setCalOpen] = useState(false);
  const R = cover.date ? diffDays(today, parseIso(cover.date)) : null;
  const n = cover.headcount;
  const ready = !!cover.type && R !== null && R >= 0 && Number.isFinite(n) && n >= 1;
  const pick = (k) => store.setCover({ type: k, pub: !!rules.types[k].pub });
  const onHead = (e) => { const v = e.target.value === '' ? null : Math.max(0, Math.floor(Number(e.target.value))); store.setCover({ headcount: Number.isFinite(v) ? v : null }); };
  return (
    <div className="app cover">
      <TopBar left={<Wordmark />} right={<span className="row"><LangSwitch /><span className="muted">{ts('ui.nologin')}</span></span>} />
      <h1 className="serif title">{ts('ui.cover.title')}</h1>
      <p className="intro">{ts('ui.cover.intro')}</p>

      <div className="stack-v">
        <span className="eyebrow">{ts('ui.cover.what')}</span>
        <div className="tiles" role="group" aria-label={ts('ui.cover.what')}>
          {Object.keys(rules.types).map((k) => (
            <button key={k} type="button" className="tile" aria-pressed={cover.type === k} onClick={() => pick(k)}>{ts(`type.${k}`)}</button>
          ))}
        </div>
      </div>

      <div className="stack-v">
        <span className="eyebrow" id="cover-when">{ts('ui.cover.when')}</span>
        <div className="row">
          <button type="button" className="datebtn" aria-expanded={calOpen} aria-haspopup="dialog" aria-labelledby="cover-when" onClick={() => setCalOpen((v) => !v)}>
            <span>{cover.date ? fmtWeekday(cover.date) : ''}</span><CalIcon />
          </button>
          <span className={`muted runway${R !== null && R < 0 ? ' past' : ''}`}>{R === null ? '' : R < 0 ? ts('ui.cover.past') : ts('ui.cover.runway', { n: R })}</span>
        </div>
        {calOpen && (
          <Calendar value={cover.date} min={toIso(today)} today={today} onPick={(iso) => { store.setCover({ date: iso }); setCalOpen(false); }} />
        )}
      </div>

      <div className="stack-v">
        <label className="eyebrow lbl" htmlFor="cover-head">{ts('ui.cover.head')}</label>
        <div className="row">
          <input id="cover-head" className="num" type="number" inputMode="numeric" min="1" max="100000" placeholder={ts('ui.cover.headcountPlaceholder')}
            value={n === null || n === undefined ? '' : n} onChange={onHead} />
          <span className="unit">{ts('ui.cover.headcountUnit')}</span>
          <span className="muted bucket">{Number.isFinite(n) && n >= 1 ? ts(`head.${rules.headcount[bucketOf(rules, n)]}`) : ''}</span>
        </div>
      </div>

      <div className="stack-v">
        <div className="seg2" role="group">
          <button type="button" aria-pressed={!!cover.pub} onClick={() => store.setCover({ pub: true })}>{ts('ui.cover.public')}</button>
          <button type="button" aria-pressed={!cover.pub} onClick={() => store.setCover({ pub: false })}>{ts('ui.cover.private')}</button>
        </div>
        <span className="muted">{ts('ui.cover.presetNote')}</span>
      </div>

      <div className="stack-v go">
        <button type="button" className="btn primary wide big" disabled={!ready} onClick={() => store.start()}>
          {!started ? ts('ui.cover.start') : left ? ts('ui.cover.continue') : ts('ui.cover.backToPlan')} →
        </button>
        <span className="muted note">{deckSize ? ts('ui.cover.deckSize', { n: deckSize }) : ts('ui.cover.deckSizeApprox')} · {ts('ui.cover.promise')}</span>
        <span className="muted note">{ts('ui.cover.disclaimer')}</span>
      </div>

      {started && <ResetBlock />}
      <footer className="foot">
        {!started && <OpenFile />}
        <button type="button" className="btn text sm" onClick={() => store.openSheet(true)}>{ts('ui.privacy.link')}</button>
        <SourceLink />
      </footer>
    </div>
  );
}
