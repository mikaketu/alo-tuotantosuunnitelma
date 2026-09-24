import React, { useEffect, useRef } from 'react';
import { ts } from '../copy/ts.js';
import * as store from '../store.js';
import { prefersReducedMotion } from '../useDrag.js';
import TopBar, { Wordmark } from './TopBar.jsx';

/** The numbers the reveal counts up: tasks, categories, statutory deadlines, days. */
export function revealStats(ev) {
  const T = ev.tasks;
  return {
    tasks: T.length,
    cats: new Set(T.map((t) => t.cat)).size,
    statutory: T.filter((t) => t.statutory).length,
    days: ev.R,
    pending: T.filter((t) => t.pending).length,
    venue: T.filter((t) => t.owner === 'venue').length,
  };
}

/** Shown once after the last card (`revealed`): the count-up and one button. No confetti. */
export default function Reveal({ s, ev, keys }) {
  const { plan } = s;
  const st = revealStats(ev);
  const line = st.pending ? ts('ui.reveal.pending', { n: st.pending }) : st.venue ? ts('ui.reveal.marked', { n: st.venue }) : ts('ui.reveal.allYours');
  const go = () => { store.setFlag('revealed'); return true; };
  keys.current = { ...keys.current, view: 'reveal', confirm: go };
  const answered = ev.cards.filter((c) => plan.answers[c.id] !== undefined).length;
  const sections = [];
  for (const c of ev.cards) { const g = sections.find((x) => x.key === c.section); if (g) g.n += 1; else sections.push({ key: c.section, n: 1 }); }
  const box = useRef(null);

  useEffect(() => {
    const els = box.current ? [...box.current.querySelectorAll('.stat b')] : [];
    if (!els.length || prefersReducedMotion()) return undefined;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - t0 - 350) / 700);
      const e = p < 0 ? 0 : 1 - Math.pow(1 - p, 3);
      for (const el of els) el.textContent = String(Math.round(Number(el.dataset.n) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const stat = (n, label) => <div className="stat"><b data-n={n}>{n}</b><span>{label}</span></div>;
  return (
    <div className="app screen deck">
      <TopBar left={<Wordmark />} />
      <div className="prog">
        <div className="segs" aria-hidden="true">{sections.map((g) => <span key={g.key} className="seg" style={{ flexGrow: g.n }}><i style={{ width: '100%' }} /></span>)}</div>
        <div className="l"><span className="eyebrow navy">{ts('ui.reveal.done')}</span><span className="muted">{ts('ui.deck.progress', { i: answered, n: ev.cards.length })}</span></div>
      </div>
      <div className="stage">
        <div className="card front reveal" ref={box} style={{ cursor: 'default' }}>
          <span className="eyebrow navy">{ts('ui.reveal.eyebrow')}</span>
          <h2 className="serif q">{ts('ui.reveal.title')}</h2>
          <div className="stats">
            {stat(st.tasks, ts('ui.reveal.tasks'))}
            {stat(st.cats, ts('ui.reveal.cats'))}
            {st.statutory > 0 && stat(st.statutory, ts('ui.reveal.statutory'))}
            {stat(st.days, ts('ui.reveal.days'))}
          </div>
          <p className="h line">{line}</p>
        </div>
      </div>
      <div className="actions">
        <button type="button" className="btn primary wide big" onClick={go}>{ts('ui.reveal.go')} →</button>
        <p className="note">{ts('ui.reveal.note')}</p>
      </div>
    </div>
  );
}
