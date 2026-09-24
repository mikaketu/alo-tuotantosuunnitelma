import React, { useState } from 'react';
import { COPY } from '../copy/ts.js';
import { rules } from '../engine/index.js';
import { triggerText } from '../engine/render.js';
import { scopedTrigger } from '../engine/tasks.js';

const GROUPS = [['row.', 'Tehtävät'], ['card.', 'Kortit'], ['statute.', 'Säädökset'], ['venue.', 'Tilan asiat'], ['why.', 'Miksi-rivit'], ['rule.', 'Sääntölauseet'], ['ui.', 'Käyttöliittymä'], ['', 'Muut']];

function where(key) {
  let m;
  if ((m = key.match(/^row\.([A-Z]+-\d+)\.title(?:\.(\w+))?$/))) { const r = rules.rows.find((x) => x.id === m[1]); const v = m[2] && (r.variants || []).find((x) => x.key === m[2]); return `${r.cat} · ${triggerText(scopedTrigger(r))}${v ? ` ja ${triggerText(v.when)}` : ''}`; }
  if ((m = key.match(/^card\.([a-z_]+)\./))) { const c = rules.cards.find((x) => x.id === m[1]); return c && c.asked !== true ? `kysytään kun ${triggerText(c.asked)}` : 'aina'; }
  return '';
}

export default function CopyView() {
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('row.');
  const needle = q.trim().toLowerCase();
  const keys = Object.keys(COPY).filter((k) => (group === '' ? !GROUPS.slice(0, -1).some(([p]) => k.startsWith(p)) : k.startsWith(group)) && (!needle || k.toLowerCase().includes(needle) || COPY[k].toLowerCase().includes(needle)));
  return (
    <>
      <p className="muted">Kaikki kävijän näkemä teksti, avaimittain. Muokkaus: <code>docs/copy-master.md</code> → <code>npm run copy:generate</code>. {Object.keys(COPY).length} avainta.</p>
      <div className="ss-filters">
        {GROUPS.map(([p, label]) => <button key={p} type="button" className={p === group ? 'on' : ''} onClick={() => setGroup(p)}>{label}</button>)}
        <input type="search" placeholder="Hae" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Hae kopiota" />
        <span className="muted">{keys.length}</span>
      </div>
      <table className="ss-table">
        <thead><tr><th>Avain</th><th>Teksti</th><th>Milloin</th></tr></thead>
        <tbody>{keys.map((k) => <tr key={k}><td className="mono">{k}</td><td>{COPY[k]}</td><td className="when">{where(k)}</td></tr>)}</tbody>
      </table>
    </>
  );
}
