import React, { useEffect, useState } from 'react';
import { ts } from '../copy/ts.js';
import { rules } from '../engine/index.js';
import { taskTitle } from '../engine/render.js';
import { planCsv, csvFilename } from '../engine/exportCsv.js';
import { diffDays } from '../engine/dates.js';
import * as store from '../store.js';
import { fmtDate, fmtWeekday } from '../fmt.js';
import TopBar, { Wordmark } from './TopBar.jsx';
import TaskRow, { MiniRow, whyCtx } from './TaskRow.jsx';

// 1200, not 900: at ~900 px five phase columns left a card title ~45 px,
// headings overlapped and long words spilled out.
export const WIDE_PX = 1200;

/** Matrix at ≥ 1200 px, the list below. */
export function useWide(initial = false) {
  const [wide, setWide] = useState(initial);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(`(min-width: ${WIDE_PX}px)`);
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener ? mq.addEventListener('change', on) : mq.addListener(on);
    return () => (mq.removeEventListener ? mq.removeEventListener('change', on) : mq.removeListener(on));
  }, []);
  return wide;
}

/** Phase header dates: the phase's window, clamped to the event day except for "after". */
export function phaseRange(p, E) {
  const to = p.to > E && p.key !== 'after' ? E : p.to;
  return ts('ui.plan.date.range', { from: fmtDate(p.from), to: fmtDate(to) });
}

export function phaseExplain(p, E) {
  return ts(`phase.${p.key}.explain`, { n: diffDays(p.from, E) });
}

/** "Lataa taulukkona": the CSV built in the browser (engine/exportCsv.js). */
export function downloadCsv(ev, plan, doc = typeof document !== 'undefined' ? document : null) {
  const csv = planCsv(ev.phases, ev.E);
  if (!doc || typeof Blob === 'undefined' || !URL.createObjectURL) return csv;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = doc.createElement('a');
  a.href = url; a.download = csvFilename(plan.cover.date);
  doc.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return csv;
}

function LateBox({ late }) {
  return (
    <div className="latebox" role="alert">
      <div><span className="chip late">{late.length === 1 ? ts('ui.plan.late.chipOne') : ts('ui.plan.late.chip', { n: late.length })}</span></div>
      <div>{late.map((t) => <span key={t.id} className="red">{ts('ui.plan.late.line', { title: taskTitle(t), date: fmtDate(t.date) })} </span>)}{ts('ui.plan.late.advice')}</div>
      <div className="muted">{ts('ui.plan.late.note')}</div>
    </div>
  );
}

function VenueNudge({ pending, onDismiss }) {
  return (
    <div className="box nudge">
      <span className="eyebrow navy">{ts('ui.plan.nudge.eyebrow')}</span>
      <p>{ts('ui.plan.nudge.text', { n: pending })}</p>
      <div className="row accel">
        <button type="button" className="btn primary md" onClick={() => { store.setVenue('own'); store.setView('deck'); }}>{ts('ui.plan.nudge.own')} →</button>
      </div>
      <div className="later"><button type="button" className="btn text sm" onClick={onDismiss}>{ts('ui.plan.nudge.later')}</button></div>
    </div>
  );
}

/** Plan-screen prompt: three or more "En tiedä" venue answers. Shows once per plan; closing is final. */
function PlanPrompt({ text, action, flag }) {
  return (
    <div className="box nudge">
      <p>{text}</p>
      {action && <div className="row accel">{action}</div>}
      <div className="later"><button type="button" className="btn text sm" onClick={() => store.setFlag(flag)}>{ts('ui.plan.prompt.close')}</button></div>
    </div>
  );
}

function SuppressedGroup({ suppressed }) {
  return (
    <details className="suppressed">
      <summary>{ts('ui.plan.suppressed', { n: suppressed.length })}</summary>
      <ul>
        {suppressed.map((x) => (
          <li key={x.id}><span>{ts(`row.${x.row}.title`)}</span> <span className="muted">{ts('why.suppressed', { things: x.because.map((b) => ts(`venue.${b.f.slice(6)}`)).join(', ') })}</span></li>
        ))}
      </ul>
    </details>
  );
}

/** The plan: header, banners, boxes, legend, phases (list or matrix), suppressed rows, export, links. */
export default function Plan({ s, ev, keys, wide: wideProp }) {
  const { plan } = s;
  const wide = useWide(!!wideProp);
  const T = ev.tasks, E = ev.E, R = ev.R;
  const ctx = whyCtx(ev, plan);
  const late = T.filter((t) => t.late), pending = T.filter((t) => t.pending), doneN = T.filter((t) => t.done).length;
  const venue = plan.answers.venue;
  const [nudgeOff, setNudgeOff] = useState(false);
  const showNudge = (venue === undefined || venue === 'none') && pending.length > 0 && !nudgeOff;
  // One prompt at a time, the venue nudge first.
  const unknownN = venue === 'own' ? ev.facts.venue_unknown.length : 0;
  const showUnknown = !showNudge && unknownN >= 3 && !plan.unknownPromptOff;
  const banner = R < 14 ? ts('ui.plan.bannerShort', { n: R }) : ev.two ? ts('ui.plan.bannerTwo') : null;
  const venueLabel = venue === 'own' ? ts('ui.plan.venueLabel.own') : ts('ui.plan.venueLabel.none');
  const phases = ev.phases.filter((p) => p.tasks.length);
  const cats = rules.categories.filter((c) => T.some((t) => t.cat === c));
  keys.current = { ...keys.current, view: 'plan' };
  const editAnswers = () => store.openAnswers();

  const legend = (
    <div className="legend">
      <span><span className="par">§</span> {ts('ui.plan.legend.statutory')}</span>
      <span><span className="ds" /> {ts('ui.plan.legend.pending')}</span>
      <span><span className="chip venue">{ts('ui.plan.chip.owner')}</span> {ts('ui.plan.legend.marked')}</span>
      {/* The money note explains the chip beside it (alone in the footer it read as an orphan). */}
      {ev.phases.some((p) => p.tasks.some((t) => t.sustainable)) && <span><span className="chip sustainable">{ts('ui.plan.chip.sustainable')}</span> {ts('ui.plan.sustainability.note')}</span>}
    </div>
  );
  const header = (
    <div className="hdr">
      <span className="eyebrow">{ts('ui.plan.eyebrow')}</span>
      <h1 className="serif ptitle">{ts(`type.${plan.cover.type}`)}, {fmtWeekday(plan.cover.date)}</h1>
      <div className="meta">{ts('ui.plan.people', { head: plan.cover.headcount })} · {ts(`deck.${ev.facts.deck}`)} · {venueLabel}</div>
      <div className="count">{ts('ui.plan.count', { n: T.length })}{doneN ? ` · ${ts('ui.plan.done', { n: doneN })}` : ''} · {ts('ui.plan.days', { n: R })}</div>
      <div className="pbar"><i style={{ width: `${T.length ? Math.round((doneN / T.length) * 100) : 0}%` }} /></div>
      {banner && <div className="banner">{banner}</div>}
    </div>
  );
  const boxes = (
    <>
      {late.length > 0 && <LateBox late={late} />}
      {showNudge && <VenueNudge pending={pending.length} onDismiss={() => setNudgeOff(true)} />}
      {showUnknown && <PlanPrompt flag="unknownPromptOff" text={ts('ui.plan.unknownPrompt.text', { n: unknownN })} />}
    </>
  );
  const foot = (
    <div className="pfoot">
      <button type="button" className="btn primary wide big" onClick={() => (plan.own.done ? store.setView('summary') : store.setView('own'))}>{plan.own.done ? ts('ui.plan.summary') : ts('ui.plan.own')} →</button>
      <button type="button" className="btn ghost wide" onClick={() => downloadCsv(ev, plan)}>{ts('ui.export.button')}</button>
      <button type="button" className="btn ghost wide" onClick={() => store.setView('exit')}>{ts('ui.plan.exit')}</button>
      <p className="note"><button type="button" className="btn text sm" onClick={editAnswers}>{ts('ui.plan.editAnswers')}</button> · <button type="button" className="btn text sm" onClick={() => store.setView('cover')}>{ts('ui.plan.editCover')}</button></p>
      <p className="note muted disclaimer">{ts('ui.plan.disclaimer')}</p>
    </div>
  );

  if (wide) {
    const cols = `170px repeat(${phases.length}, minmax(0, 1fr))`;
    return (
      <div className="app matrix plan">
        <TopBar left={<Wordmark />} right={<button type="button" className="btn ghost sm" onClick={() => store.setView('exit')}>{ts('ui.plan.exit')}</button>} />
        <div className="mx-top">{header}{legend}</div>
        {(late.length > 0 || showNudge || showUnknown) && <div className="row boxes">{boxes}</div>}
        <div className="mx mx-head" style={{ gridTemplateColumns: cols }}>
          <div />
          {phases.map((p) => (
            <div key={p.key}><div className="serif ph-n">{ts(`phase.${p.key}`)}</div><div className="muted">{phaseRange(p, E)} · {ts('ui.plan.phaseCount', { n: p.tasks.length })}{p.tasks.some((t) => t.done) ? ` · ${ts('ui.plan.phaseDone', { n: p.tasks.filter((t) => t.done).length })}` : ''}</div></div>
          ))}
        </div>
        {cats.map((cat) => (
          <div key={cat} className="mx mx-row" style={{ gridTemplateColumns: cols }}>
            <div className="mx-cat"><b>{ts(`cat.${cat}`)}</b><div className="muted">{ts('ui.plan.catCount', { n: T.filter((t) => t.cat === cat).length })}</div></div>
            {phases.map((p) => { const it = p.tasks.filter((t) => t.cat === cat); return it.length ? <div key={p.key} className="mx-cell">{it.map((t) => <MiniRow key={t.id} t={t} ctx={ctx} />)}</div> : <div key={p.key} className="mx-empty">{ts('ui.plan.matrix.empty')}</div>; })}
          </div>
        ))}
        {ev.suppressed.length > 0 && <SuppressedGroup suppressed={ev.suppressed} />}
        {foot}
      </div>
    );
  }

  return (
    <div className="app plan">
      <TopBar left={<Wordmark />} right={<button type="button" className="btn ghost sm" onClick={() => store.setView('exit')}>{ts('ui.plan.exit')}</button>} />
      {header}
      {boxes}
      {legend}
      {phases.map((p) => (
        <section key={p.key} className="phase">
          <div className="ph">
            <div className="n"><span className="serif ph-n">{ts(`phase.${p.key}`)}</span><span className="muted">{phaseRange(p, E)}</span></div>
            <span className="muted">{ts('ui.plan.phaseCount', { n: p.tasks.length })}{p.tasks.some((t) => t.done) ? ` · ${ts('ui.plan.phaseDone', { n: p.tasks.filter((t) => t.done).length })}` : ''}</span>
          </div>
          <p className="muted explain">{phaseExplain(p, E)}</p>
          <div className="tasks">{p.tasks.map((t) => <TaskRow key={t.id} t={t} ctx={ctx} ownDone={plan.own.done} />)}</div>
        </section>
      ))}
      {ev.suppressed.length > 0 && <SuppressedGroup suppressed={ev.suppressed} />}
      {foot}
    </div>
  );
}
