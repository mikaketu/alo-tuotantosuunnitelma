import React, { useState } from 'react';
import { evaluate, rules } from '../engine/index.js';
import { parseIso } from '../engine/dates.js';
import fixtures from '../engine/__fixtures__/runs.json' with { type: 'json' };
import { ts } from '../copy/ts.js';
import { PlanTable, TYPE, Chip } from './shared.jsx';

export function runResult(run) {
  const today = parseIso(fixtures.today);
  const plan = { v: 2, cover: run.cover, answers: run.answers, later: [], owners: {}, done: {} };
  return evaluate(plan, today);
}

export default function RunViewer({ initial = 'A' }) {
  const [id, setId] = useState(initial);
  const run = fixtures.runs.find((r) => r.id === id);
  const res = runResult(run);
  const services = rules.types[run.cover.type].services || [];
  const answered = (k, v) => `${ts(`card.${k}.label`)}: ${Array.isArray(v) ? v.map((x) => ts(`card.${k}.opt.${x}`)).join(', ') : ts(`card.${k}.opt.${v}`) === `card.${k}.opt.${v}` ? v : ts(`card.${k}.opt.${v}`)}`;
  return (
    <>
      <div className="ss-filters">
        {fixtures.runs.map((r) => <button key={r.id} type="button" className={r.id === id ? 'on' : ''} onClick={() => setId(r.id)}>{r.id}</button>)}
      </div>
      <h2>Ajo {run.id} — {run.title}</h2>
      <div className="ss-cols">
        <div>
          <h3>Kansi</h3>
          <div>{TYPE(run.cover.type)} · {run.cover.date} · {run.cover.headcount} henkeä · {run.cover.pub ? 'julkinen' : 'yksityinen'}</div>
          <h3>Vastaukset</h3>
          <ul className="ss-answers">{Object.entries(run.answers).filter(([k]) => k !== 'lastDate').map(([k, v]) => <li key={k}>{answered(k, v)}</li>)}{run.answers.lastDate ? <li>viimeinen esitys: {run.answers.lastDate}</li> : null}</ul>
          <h3>Tyypin palvelut</h3>
          <div>{services.map((s) => <Chip key={s} kind="venue">{ts(`service.${s}`)}</Chip>)}</div>
        </div>
        <div>
          <h3>Luvut</h3>
          <table className="ss-table small"><tbody>
            <tr><td>kortteja</td><td>{res.cards.length}</td><td className="muted">ajodokumentti {run.doc.cards}</td></tr>
            <tr><td>tehtäviä</td><td>{res.tasks.filter((t) => !t.pending).length}{res.tasks.some((t) => t.pending) ? ` + ${res.tasks.filter((t) => t.pending).length} odottaa tilaa` : ''}</td><td className="muted">ajodokumentti {run.doc.tasks}{run.doc.pending ? ` + ${run.doc.pending}` : ''}</td></tr>
            <tr><td>lakisääteisiä</td><td>{res.tasks.filter((t) => t.statutory).map((t) => t.id).join(', ') || '–'}</td><td className="muted">ajodokumentti {run.doc.statutory}</td></tr>
            <tr><td>vaiheita</td><td>{res.phases.length}</td><td></td></tr>
          </tbody></table>
          <h3>Miksi luvut eroavat dokumentista</h3>
          <p className="note">{run.notes}</p>
          <h3>Kysytyt kortit</h3>
          <div className="muted">{res.cards.map((c) => c.id).join(' · ')}</div>
        </div>
      </div>
      <PlanTable result={res} />
    </>
  );
}
