import React, { useState } from 'react';
import { ts } from '../copy/ts.js';
import { parseIso, toIso } from '../engine/dates.js';
import { fmtWeekday, monthTitle, weekdayHeaders } from '../fmt.js';

/** Inline month grid: Monday first, days before `min` disabled, ‹ disabled at the minimum month. */
export default function Calendar({ value, min, today, onPick }) {
  const minD = parseIso(min);
  const start = value ? parseIso(value) : minD;
  const [ym, setYm] = useState({ y: Math.max(start.getFullYear(), minD.getFullYear()), m: start.getMonth() });
  // Clamp a view before the minimum month to it.
  const minIdx = minD.getFullYear() * 12 + minD.getMonth();
  const { y, m } = ym.y * 12 + ym.m < minIdx ? { y: minD.getFullYear(), m: minD.getMonth() } : ym;
  const atMin = y * 12 + m === minIdx;
  const first = new Date(y, m, 1, 12);
  const lead = (first.getDay() + 6) % 7;
  const last = new Date(y, m + 1, 0, 12).getDate();
  const todayIso = toIso(today);
  const prev = () => setYm(m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 });
  const next = () => setYm(m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 });
  const cells = [];
  for (let i = 0; i < lead; i += 1) cells.push(<span key={`e${i}`} />);
  for (let d = 1; d <= last; d += 1) {
    const iso = toIso(new Date(y, m, d, 12));
    const disabled = iso < min;
    cells.push(
      <button key={iso} type="button" disabled={disabled} className={iso === todayIso ? 'today' : ''}
        aria-pressed={iso === value} aria-label={fmtWeekday(iso)} onClick={() => onPick(iso)}>{d}</button>,
    );
  }
  return (
    <div className="cal" role="group" aria-label={ts('ui.cal.label')}>
      <div className="mh">
        <button type="button" onClick={prev} disabled={atMin} aria-label={ts('ui.cal.prev')}>‹</button>
        <b>{monthTitle(y, m)}</b>
        <button type="button" onClick={next} aria-label={ts('ui.cal.next')}>›</button>
      </div>
      <div className="wd" aria-hidden="true">{weekdayHeaders().map((w) => <span key={w}>{w}</span>)}</div>
      <div className="days">{cells}</div>
    </div>
  );
}
