import React from 'react';
import { rules } from '../engine/index.js';
import { triggerText } from '../engine/render.js';
import { ts, has } from '../copy/ts.js';
import { Chip } from './shared.jsx';

const KIND = { venue: 'tila (ei vielä / kyllä)', yesno: 'kyllä / ei', opt: 'yksi vaihtoehto', multi: 'monivalinta', perf: 'esitykset + päivä', cap: 'tilan valmius (ei / on / en tiedä)' };

export default function CardsTable() {
  const presets = Object.entries(rules.types).flatMap(([t, v]) => Object.keys(v.preset).map((c) => [c, t, v.preset[c]]));
  return (
    <>
      <p className="muted">Kortit ajojärjestyksessä. Tyyppi voi esivastata kortin, jolloin sitä ei näytetä. Tyhjä tila (V0 = kyllä) esivastaa merkityt valmiudet kielteisiksi.</p>
      <table className="ss-table">
        <thead><tr><th>#</th><th>Kortti</th><th>Kysymys</th><th>Laji</th><th>Vaihtoehdot</th><th>Kysytään kun</th><th>Esivastattu</th></tr></thead>
        <tbody>
          {rules.cards.map((c, i) => (
            <tr key={c.id} id={`kortti-${c.id}`}>
              <td>{i + 1}</td>
              <td className="mono">{c.id}<div className="muted">{ts(`section.${c.section}`)}</div></td>
              <td>{ts(`card.${c.id}.q`)}{has(`card.${c.id}.help`) ? <div className="muted">{ts(`card.${c.id}.help`)}</div> : null}</td>
              <td>{KIND[c.kind]}{c.v0pre ? <div><Chip>V0 esivastaa: ei</Chip></div> : null}</td>
              <td>{(c.options || []).map((o) => <div key={o}>{ts(`card.${c.id}.opt.${o}`)}{c.optionWhen && c.optionWhen[o] ? <span className="muted"> — vain {triggerText(c.optionWhen[o])}</span> : null}</div>)}
                {c.hideOptionsFor ? Object.entries(c.hideOptionsFor).map(([t, hs]) => <div key={t} className="muted">{ts(`type.${t}`)}: ilman {hs.map((h) => ts(`card.${c.id}.opt.${h}`)).join(', ')}</div>) : null}
                {c.kind === 'cap' ? <div className="muted">ei · on · en tiedä (en tiedä = rivit + varmista tilalta)</div> : null}
                {c.kind === 'venue' ? <div className="muted">← ei vielä · → kyllä</div> : null}
                {c.kind === 'yesno' ? <div className="muted">← ei · → kyllä{c.up ? ' · ↑ tila hoitaa' : ''}</div> : null}</td>
              <td className="when">{c.asked === true ? 'aina' : triggerText(c.asked)}{c.kind === 'cap' && c.applies !== true ? <div className="muted">valmius koskee, kun {triggerText(c.applies)}</div> : null}</td>
              <td>{presets.filter(([cid]) => cid === c.id).map(([, t, v]) => <div key={t}>{ts(`type.${t}`)}: {Array.isArray(v) ? v.map((x) => ts(`card.${c.id}.opt.${x}`)).join(', ') : ts(`card.${c.id}.opt.${v}`)}</div>)}
                {c.up && rules.venueHandles[c.id] ? <div className="muted">↑ tila hoitaa = {ts(`card.${c.id}.opt.${rules.venueHandles[c.id]}`)}</div> : null}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
