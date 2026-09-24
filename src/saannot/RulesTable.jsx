import React, { useState } from 'react';
import { rules } from '../engine/index.js';
import { triggerText } from '../engine/render.js';
import { scopedTrigger } from '../engine/tasks.js';
import { ts } from '../copy/ts.js';
import { CAT, TYPE, deadlineText, Chip } from './shared.jsx';

const DECK = { both: 'molemmat', closed: 'yksityinen', public: 'julkinen' };

export default function RulesTable() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [deck, setDeck] = useState('');
  const needle = q.trim().toLowerCase();
  const rows = rules.rows.filter((r) => (!cat || r.cat === cat) && (!deck || r.deck === deck || r.deck === 'both')
    && (!needle || r.id.toLowerCase().includes(needle) || ts(`row.${r.id}.title`).toLowerCase().includes(needle) || triggerText(scopedTrigger(r)).toLowerCase().includes(needle)));
  return (
    <>
      <div className="ss-filters">
        <input type="search" placeholder="Hae tunnuksella, otsikolla tai ehdolla" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Hae rivejä" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Kokonaisuus"><option value="">Kaikki kokonaisuudet</option>{rules.categories.map((c) => <option key={c} value={c}>{CAT(c)}</option>)}</select>
        <select value={deck} onChange={(e) => setDeck(e.target.value)} aria-label="Pakka"><option value="">Molemmat pakat</option><option value="closed">Yksityinen</option><option value="public">Julkinen</option></select>
        <span className="muted">{rows.length} / {rules.rows.length} riviä</span>
      </div>
      <table className="ss-table">
        <thead><tr><th>Sääntö</th><th>Tehtävä</th><th>Kun</th><th>Kokonaisuus</th><th>Pakka</th><th>Määräaika</th><th>Omistaja</th><th>Palvelu</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} id={`rivi-${r.id}`}>
              <td className="mono">{r.id}</td>
              <td>
                {ts(`row.${r.id}.title`)}
                {(r.variants || []).map((v) => <div key={v.key} className="variant"><Chip>{v.key}</Chip> {ts(`row.${r.id}.title.${v.key}`)} <span className="muted">— kun {triggerText(v.when)}</span></div>)}
                {r.repeat ? <div className="muted">toistuu: {r.repeat === 'performance_dates' ? 'jokaiselle esityspäivälle' : 'jokaiselle "en tiedä" -vastaukselle'}</div> : null}
              </td>
              <td className="when">{triggerText(scopedTrigger(r))}</td>
              <td>{CAT(r.cat)}</td>
              <td>{DECK[r.deck]}{r.type ? <div className="muted">{TYPE(r.type)}</div> : null}</td>
              <td>{deadlineText(r.deadline)}</td>
              <td>{r.owner === 'prepare_sign' ? 'valmistelee / allekirjoittaa' : 'järjestäjä'}{r.locked ? <div><Chip>lukittu</Chip></div> : null}</td>
              <td>{r.service ? <Chip kind="venue">{ts(`service.${r.service}`)}</Chip> : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
