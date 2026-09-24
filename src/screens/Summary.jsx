import React from 'react';
import { ts } from '../copy/ts.js';
import { rules } from '../engine/index.js';
import { taskTitle } from '../engine/render.js';
import * as store from '../store.js';
import { fmtWeekday } from '../fmt.js';
import TopBar, { Wordmark } from './TopBar.jsx';
import FileBox from './FileBox.jsx';

/** The split-bar counts: me / the venue / later / none. */
export function ownerCounts(tasks) {
  const n = (k) => tasks.filter((t) => t.owner === k).length;
  return { me: n('me'), venue: n('venue'), later: n('later'), none: n('none') };
}

/** After the ownership pass (`own.done`): the split, what was marked to the venue, the plan as a file. */
export default function Summary({ s, ev, keys }) {
  const { plan } = s;
  const T = ev.tasks;
  const c = ownerCounts(T);
  const venue = T.filter((t) => t.owner === 'venue');
  const groups = rules.categories.map((cat) => ({ cat, tasks: venue.filter((t) => t.cat === cat) })).filter((g) => g.tasks.length);
  const doneN = T.filter((t) => t.done).length;
  keys.current = { ...keys.current, view: 'summary' };
  const bar = [['me', c.me, 'b-me'], ['venue', c.venue, 'b-venue'], ['later', c.later, 'b-later'], ['none', c.none, 'b-none']];
  return (
    <div className="app summary">
      <TopBar left={<Wordmark />} right={<button type="button" className="btn ghost sm" onClick={() => store.setView('exit')}>{ts('ui.deck.exit')}</button>} />
      <div className="stack-v tight">
        <h1 className="serif title">{ts('ui.summary.title')}</h1>
        <div className="meta">{ts('ui.summary.meta', { type: ts(`type.${plan.cover.type}`), date: fmtWeekday(plan.cover.date), n: T.length, days: ev.R })}{doneN ? ` · ${ts('ui.plan.done', { n: doneN })}` : ''}</div>
      </div>
      <div className="stack-v">
        <div className="bar" aria-hidden="true">{bar.filter((b) => b[1]).map((b) => <i key={b[0]} className={b[2]} style={{ flexGrow: b[1] }} />)}</div>
        <div className="barl">{bar.map((b) => <span key={b[0]}><i className={b[2]} />{ts(`ui.summary.bar.${b[0]}`)} <b>{b[1]}</b></span>)}</div>
      </div>
      {venue.length ? (
        <div className="box">
          <span className="eyebrow navy">{ts('ui.summary.marked')}</span>
          <div className="marked">
            {groups.map((g) => (
              <div key={g.cat} className="g"><span className="eyebrow tiny">{ts(`cat.${g.cat}`)}</span>{g.tasks.map((t) => <div key={t.id}><i className="venue" />{taskTitle(t)}</div>)}</div>
            ))}
          </div>
          <p className="small">{ts('ui.summary.confirmWithVenue', { n: venue.length })}</p>
          <button type="button" className="btn ghost wide" onClick={() => store.restartOwn()}>{ts('ui.summary.editOwners')}</button>
        </div>
      ) : (
        <div className="box">
          <span className="eyebrow navy">{ts('ui.summary.allYours.eyebrow')}</span>
          <p className="small">{ts('ui.summary.allYours')}</p>
          <button type="button" className="btn ghost wide" onClick={() => store.restartOwn()}>{ts('ui.summary.editOwners')}</button>
        </div>
      )}
      <FileBox s={s} />
      <p className="note">{ts('ui.summary.done')}<br />
        <button type="button" className="btn text sm" onClick={() => store.restartOwn()}>{ts('ui.summary.editOwners')}</button> · <button type="button" className="btn text sm" onClick={() => store.setView('plan')}>{ts('ui.summary.backToPlan')}</button>
      </p>
    </div>
  );
}
