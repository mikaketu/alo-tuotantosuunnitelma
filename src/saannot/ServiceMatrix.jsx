import React from 'react';
import { rules } from '../engine/index.js';
import { ts } from '../copy/ts.js';
import { CAT, Chip } from './shared.jsx';

export default function ServiceMatrix() {
  const types = Object.keys(rules.types);
  return (
    <>
      <p className="muted">
        Tapahtumatyypin palvelut ovat sääntötaulukon tietoa (<code>types.&lt;tyyppi&gt;.services</code>): mitä tämäntyyppisissä
        tapahtumissa yleensä tarvitaan. Ehdotettu palvelu tuottaa tehtävän; tilan valmius, joka on olemassa, kumoaa ehdotuksen.
      </p>
      <table className="ss-table">
        <thead><tr><th>Palvelu</th><th>Avain</th><th>Ehdotetaan tyypeille</th><th>Ehdotuksesta syntyvät rivit</th></tr></thead>
        <tbody>
          {rules.services.map((k) => {
            const rows = rules.rows.filter((r) => r.service === k);
            const forTypes = types.filter((t) => (rules.types[t].services || []).includes(k));
            return (
              <tr key={k}>
                <td>{ts(`service.${k}`)}</td>
                <td className="mono">{k}</td>
                <td>{forTypes.length ? forTypes.map((t) => <Chip key={t} kind="venue">{ts(`type.${t}`)}</Chip>) : <span className="muted">—</span>}</td>
                <td>{rows.length ? rows.map((r) => <div key={r.id}><span className="mono">{r.id}</span> {ts(`row.${r.id}.title`)} <span className="muted">· {CAT(r.cat)}</span></div>) : <span className="muted">—</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h3>Tukahdutus</h3>
      <ul>
        {rules.rows.filter((r) => r.service && JSON.stringify(r.trigger).includes('"venue.')).map((r) => (
          <li key={r.id}><span className="mono">{r.id}</span> {ts(`row.${r.id}.title`)} — ei laukea, jos tilassa on se, mitä ehto kysyy; näytetään ryhmässä "Ei suunnitelmassa, koska tila hoitaa".</li>
        ))}
      </ul>
    </>
  );
}
