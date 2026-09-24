import React from 'react';
import { rules } from '../engine/index.js';
import { ts } from '../copy/ts.js';
import { deadlineText } from './shared.jsx';

export default function StatutesTable() {
  const rowsFor = (k) => rules.rows.filter((r) => (r.deadline.fixed && r.deadline.fixed.statute === k) || (r.deadline.notice && r.deadline.notice.statute === k));
  return (
    <>
      <p className="muted">Kiinteät määräajat eivät koskaan skaalaudu aikaan. Myöhässä oleva lakisääteinen rivi näkyy punaisena, ei siirry. Kopio ei koskaan väitä velvollisuutta, jota ei ehkä ole.</p>
      <table className="ss-table">
        <thead><tr><th>Säädös</th><th>Rivit</th><th>Määräaika</th><th>Mitä kopio sanoo</th><th>Tarkistettu</th></tr></thead>
        <tbody>
          {Object.entries(rules.statutes).map(([k, s]) => (
            <tr key={k}>
              <td><a href={s.url} target="_blank" rel="noreferrer">{ts(`statute.${k}.label`)}</a></td>
              <td>{rowsFor(k).map((r) => <div key={r.id}><span className="mono">{r.id}</span> {ts(`row.${r.id}.title`)}</div>)}</td>
              <td>{rowsFor(k).map((r) => <div key={r.id}>{deadlineText(r.deadline)}</div>)}</td>
              <td>{ts(`statute.${k}.note`)}</td>
              <td>{s.reviewed}</td>
            </tr>
          ))}
          <tr><td>Sopimusperusteiset</td><td>{rules.rows.filter((r) => r.deadline.fixed && r.deadline.fixed.kind === 'contractual').map((r) => <div key={r.id}><span className="mono">{r.id}</span> {ts(`row.${r.id}.title`)}</div>)}</td><td>{rules.rows.filter((r) => r.deadline.fixed && r.deadline.fixed.kind === 'contractual').map((r) => <div key={r.id}>{deadlineText(r.deadline)}</div>)}</td><td>{ts('why.contractual')}</td><td>—</td></tr>
        </tbody>
      </table>
    </>
  );
}
