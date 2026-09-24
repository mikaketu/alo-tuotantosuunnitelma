import React, { useState } from 'react';
import { evaluate, rules } from '../engine/index.js';
import { toIso, addDays } from '../engine/dates.js';
import { ts } from '../copy/ts.js';
import { askedBecause } from '../engine/render.js';
import { PlanTable, TYPE } from './shared.jsx';

export default function Simulator({ today = new Date() }) {
  const t0 = new Date(today); t0.setHours(12, 0, 0, 0);
  const [cover, setCover] = useState({ type: 'keikka', date: toIso(addDays(t0, 60)), headcount: 120, pub: true });
  const [answers, setAnswers] = useState({ venue: 'own' });
  const plan = { v: 2, cover, answers, later: [], owners: {}, done: {} };
  const res = evaluate(plan, t0);
  const setType = (type) => setCover({ ...cover, type, pub: rules.types[type].pub });
  const set = (k, v) => setAnswers((a) => { const n = { ...a }; if (v === '' || v === undefined) delete n[k]; else n[k] = v; return n; });
  const upOpt = (c) => (c.up ? <option value="venue">↑ tila hoitaa</option> : null);
  return (
    <>
      <div className="ss-sim">
        <fieldset>
          <legend>Kansi</legend>
          <label>Tyyppi <select value={cover.type} onChange={(e) => setType(e.target.value)}>{Object.keys(rules.types).map((k) => <option key={k} value={k}>{TYPE(k)}</option>)}</select></label>
          <label>Päivä <input type="date" value={cover.date} onChange={(e) => setCover({ ...cover, date: e.target.value })} /></label>
          <label>Henkeä yhtä aikaa <input type="number" min="1" value={cover.headcount} onChange={(e) => setCover({ ...cover, headcount: Number(e.target.value) || 0 })} /></label>
          <label><input type="checkbox" checked={cover.pub} onChange={(e) => setCover({ ...cover, pub: e.target.checked })} /> julkinen tapahtuma</label>
          <div className="muted">Tyypin palvelut: {(rules.types[cover.type].services || []).map((s) => ts(`service.${s}`)).join(', ') || '–'}</div>
        </fieldset>
        <fieldset>
          <legend>Kortit ({res.cards.length})</legend>
          {res.cards.map((c) => {
            const why = askedBecause(c, res.facts);
            const v = answers[c.id];
            return (
              <div key={c.id} className="ss-card">
                <div><b>{ts(`card.${c.id}.q`)}</b> <span className="mono muted">{c.id}</span>{why ? <div className="muted">{why}</div> : null}</div>
                {c.kind === 'venue' ? <select value={v || ''} onChange={(e) => set('venue', e.target.value)}><option value="">–</option><option value="none">{ts('card.venue.opt.none')}</option><option value="own">{ts('card.venue.opt.own')}</option></select>
                : c.kind === 'multi' ? <div>{c.options.map((o) => <label key={o}><input type="checkbox" checked={Array.isArray(v) && v.includes(o)} onChange={(e) => { const cur = Array.isArray(v) ? v : []; set(c.id, e.target.checked ? [...cur, o] : cur.filter((x) => x !== o)); }} /> {ts(`card.${c.id}.opt.${o}`)}</label>)}{c.up ? <label><input type="checkbox" checked={v === 'venue'} onChange={(e) => set(c.id, e.target.checked ? 'venue' : undefined)} /> ↑ tila hoitaa</label> : null}</div>
                : c.kind === 'opt' || c.kind === 'perf' ? <div><select value={v || ''} onChange={(e) => set(c.id, e.target.value)}><option value="">–</option>{c.options.map((o) => <option key={o} value={o}>{ts(`card.${c.id}.opt.${o}`)}</option>)}{upOpt(c)}</select>{c.kind === 'perf' && v === 'several' ? <input type="date" value={answers.lastDate || ''} onChange={(e) => set('lastDate', e.target.value)} /> : null}</div>
                : c.kind === 'cap' ? <select value={v || ''} onChange={(e) => set(c.id, e.target.value)}><option value="">–</option><option value="no">{ts('ui.deck.hasNot')}</option><option value="yes">{ts('ui.deck.has')}</option><option value="unknown">{ts('ui.deck.unknown')}</option></select>
                : <select value={v || ''} onChange={(e) => set(c.id, e.target.value)}><option value="">–</option><option value="no">{ts('ui.deck.no')}</option><option value="yes">{ts('ui.deck.yes')}</option>{upOpt(c)}</select>}
              </div>
            );
          })}
        </fieldset>
      </div>
      <h2>Suunnitelma <span className="muted">{res.tasks.length} tehtävää · {res.phases.length} vaihetta</span></h2>
      <PlanTable result={res} />
    </>
  );
}
