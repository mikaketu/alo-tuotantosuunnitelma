import React, { useState } from 'react';
import { ts } from '../copy/ts.js';
import { rules } from '../engine/index.js';
import { taskTitle, whyLines } from '../engine/render.js';
import * as store from '../store.js';
import { fmtDate } from '../fmt.js';

/** The date column (prototype rPlan `d`): pending / was / now / by / plain, plus a range for X-41-style windows. */
export function dateLabel(t) {
  if (t.pending) return ts('ui.plan.date.pending');
  if (t.late) return ts('ui.plan.date.was', { date: fmtDate(t.date) });
  if (t.dateEnd) return ts('ui.plan.date.range', { from: fmtDate(t.date), to: fmtDate(t.dateEnd) });
  if (t.phase === 0 && !t.fixed) return ts('ui.plan.date.now');
  if (t.fixed) return ts('ui.plan.date.by', { date: fmtDate(t.date) });
  return fmtDate(t.date);
}

/** The owner chip of a task marked to the venue. */
export function ownerChipText(t) {
  if (t.prepareSign) return ts('ui.plan.chip.prepareSign');
  return ts('ui.plan.chip.owner');
}

/** The chips under a title: [{cls, text}]. */
export function chipsFor(t, ownDone) {
  const out = [];
  if (t.statutory) out.push({ cls: t.late ? 'late' : 'statutory', text: ts(t.late ? 'ui.plan.chip.late' : 'ui.plan.chip.statutory') });
  if (t.owner === 'venue') out.push({ cls: 'venue', text: ownerChipText(t) });
  else if (t.prepareSign) out.push({ cls: '', text: ts('ui.plan.chip.sign') });
  if (t.locked && ownDone) out.push({ cls: '', text: ts('ui.plan.chip.organiser') });
  if (t.owner === 'later') out.push({ cls: '', text: ts('ui.plan.chip.later') });
  if (t.owner === 'none') out.push({ cls: 'none', text: ts('ui.plan.chip.notNeeded') });
  if (t.sustainable) out.push({ cls: 'sustainable', text: ts('ui.plan.chip.sustainable') });
  return out;
}

export function rowClass(t, base = 'task') {
  return [base, t.pending ? 'pending' : '', t.late ? 'late' : '', t.owner === 'none' ? 'none' : '', t.done ? 'done' : ''].filter(Boolean).join(' ');
}

/** The why block: every line from explain() (engine/render.js), so visitor, tuottaja and the rules page say the same thing. */
export function WhyDetails({ t, ctx }) {
  return <ul className="why">{whyLines(t, ctx).map((l, i) => <li key={i}>{l}</li>)}</ul>;
}

export function Check({ t, title }) {
  return (
    <label className="chk">
      <input type="checkbox" checked={!!t.done} onChange={() => store.toggleDone(t.id)} aria-label={ts('ui.plan.doneLabel', { title })} />
    </label>
  );
}

/** One task in the phase list. Ticking never scrolls; "Miksi tämä on täällä?" opens the why lines in place. */
export default function TaskRow({ t, ctx, ownDone }) {
  const [open, setOpen] = useState(false);
  const title = taskTitle(t);
  const chips = chipsFor(t, ownDone);
  return (
    <div className={rowClass(t)}>
      <div className="body">
        <Check t={t} title={title} />
        <div className="tx">
          <span className="eyebrow cat">{ts(`cat.${t.cat}`)}</span>
          <div className="t">{t.statutory && <span className="par">§</span>}{title}</div>
          {chips.length > 0 && <div className="tags">{chips.map((c) => <span key={c.text} className={`chip ${c.cls}`}>{c.text}</span>)}</div>}
          <button type="button" className="btn text sm whybtn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>{open ? ts('ui.plan.whyClose') : ts('ui.plan.why')}</button>
          {open && <WhyDetails t={t} ctx={ctx} />}
        </div>
      </div>
      <div className="d">{dateLabel(t)}</div>
    </div>
  );
}

/** The matrix cell version (≥ 900 px): checkbox, title, date, owner chip, and a circled "?"
 *  that shows the same why lines as the list's "Miksi tämä on täällä?" on hover or focus. */
export function MiniRow({ t, ctx }) {
  const title = taskTitle(t);
  const tag = t.owner === 'venue' ? <span className="chip venue">{ownerChipText(t)}</span>
    : t.owner === 'later' ? <span className="chip">{ts('ui.plan.chip.later')}</span> : null;
  return (
    <div className={rowClass(t, 'mini')}>
      <Check t={t} title={title} />
      <div className="mb">
        <div className="t">{t.statutory && <span className="par">§</span>}{title}</div>
        <div className="m"><span>{dateLabel(t)}</span>{tag}</div>
      </div>
      {ctx && (
        <div className="whyq">
          <button type="button" className="q" aria-label={ts('ui.plan.why')}>?</button>
          <div className="whytip" role="tooltip"><WhyDetails t={t} ctx={ctx} /></div>
        </div>
      )}
    </div>
  );
}

/** The ctx `whyLines` needs, built once per plan render. */
export function whyCtx(ev, plan) {
  return { deck: ev.facts.deck, type: plan.cover.type, headcount: plan.cover.headcount, rules, E: ev.E };
}
