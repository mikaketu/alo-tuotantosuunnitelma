import React from 'react';
import { ts } from '../copy/ts.js';

/** One segment per section in first-appearance order, weighted by card count; the label names the current section. */
export function progressModel(cards, answers, current) {
  const sections = [];
  for (const c of cards) {
    let s = sections.find((x) => x.key === c.section);
    if (!s) { s = { key: c.section, n: 0, done: 0 }; sections.push(s); }
    s.n += 1;
    if (answers[c.id] !== undefined) s.done += 1;
  }
  const answered = cards.filter((c) => answers[c.id] !== undefined).length;
  return { sections, i: Math.min(answered + 1, cards.length), n: cards.length, section: current ? current.section : null };
}

export default function Progress({ cards, answers, current }) {
  const m = progressModel(cards, answers, current);
  return (
    <div className="prog" role="group" aria-label={ts('ui.a11y.progress')}>
      <div className="segs" aria-hidden="true">
        {m.sections.map((s) => (
          <span key={s.key} className="seg" style={{ flexGrow: s.n }}><i style={{ width: `${Math.round((s.done / s.n) * 100)}%` }} /></span>
        ))}
      </div>
      <div className="l">
        <span className="eyebrow">{m.section ? ts(`section.${m.section}`) : ''}</span>
        <span className="muted">{ts('ui.deck.progress', { i: m.i, n: m.n })}</span>
      </div>
      <span className="sr-only" aria-live="polite">{m.section ? ts('ui.deck.progressLive', { section: ts(`section.${m.section}`), i: m.i, n: m.n }) : ''}</span>
    </div>
  );
}
