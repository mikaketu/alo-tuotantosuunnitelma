// Shared bits for the rules page: deadline wording, chips, the plan table
// that RunViewer and Simulator both render.
import React from 'react';
import { ts } from '../copy/ts.js';
import { rules } from '../engine/index.js';
import { taskTitle, whyLines } from '../engine/render.js';

export const CAT = (k) => ts(`cat.${k}`);
export const TYPE = (k) => ts(`type.${k}`);

export function deadlineText(d) {
  if (d.phase) {
    let s = d.phase;
    if (d.phase_end) s += ` → ${d.phase_end}`;
    if (d.notice) s += ` · ilmoitus E − ${d.notice.offset} vrk`;
    return s;
  }
  const f = d.fixed;
  let s = f.offset >= 0 ? `E − ${f.offset} vrk` : `E + ${-f.offset} vrk`;
  s += f.kind === 'statutory' ? ' · lakisääteinen' : ' · sopimusperusteinen';
  if (f.earliest_offset) s += ` · aikaisintaan E − ${f.earliest_offset} vrk`;
  return s;
}

export function Chip({ kind, children }) {
  return <span className={`ss-chip ${kind || ''}`}>{children}</span>;
}

export function fmt(d) { return d ? `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}` : '–'; }

/** The visitor's plan as the reader sees it: phases, rows, owner, why lines. */
export function PlanTable({ result }) {
  const ctx = { deck: result.facts.deck, type: result.facts.type, headcount: result.facts.headcount, rules, E: result.E };
  const phases = result.phases.filter((p) => p.tasks.length);
  return (
    <div className="ss-plan">
      {phases.map((p) => (
        <div key={p.key} className="ss-phase">
          <h3>{ts(`phase.${p.key}`)} <span className="muted">{fmt(p.from)} – {fmt(p.to)} · {p.tasks.length} tehtävää</span></h3>
          <table className="ss-table">
            <thead><tr><th>Sääntö</th><th>Tehtävä</th><th>Kokonaisuus</th><th>Määräpäivä</th><th>Omistaja</th><th>Miksi</th></tr></thead>
            <tbody>
              {p.tasks.map((t) => (
                <tr key={t.id} className={t.pending ? 'pending' : t.late ? 'late' : ''}>
                  <td className="mono">{t.id}</td>
                  <td>{t.statutory ? <span className="par">§ </span> : null}{taskTitle(t)}
                    {t.variant ? <Chip>variantti: {t.variant}</Chip> : null}
                    {t.locked ? <Chip>järjestäjän</Chip> : null}
                    {t.unknown ? <Chip kind="warn">en tiedä</Chip> : null}
                  </td>
                  <td>{CAT(t.cat)}</td>
                  <td>{t.pending ? ts('ui.plan.date.pending') : (t.fixed ? 'viim. ' : '') + fmt(t.date)}{t.dateEnd ? ` → ${fmt(t.dateEnd)}` : ''}</td>
                  <td>{t.owner === 'venue' ? 'tila' : t.owner === 'me' ? 'minä' : t.owner}{t.prepareSign ? ' · valmistelee/allekirjoittaa' : ''}</td>
                  <td className="why">{whyLines(t, ctx).map((l, i) => <div key={i}>{l}</div>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {result.suppressed.length ? (
        <div className="ss-phase">
          <h3>Ei suunnitelmassa, koska tila hoitaa <span className="muted">{result.suppressed.length}</span></h3>
          <ul>{result.suppressed.map((s) => <li key={s.id}><span className="mono">{s.id}</span> {ts(`row.${s.row}.title`)} — {s.because.map((b) => ts(`venue.${b.f.slice(6)}`)).join(', ')}</li>)}</ul>
        </div>
      ) : null}
    </div>
  );
}
