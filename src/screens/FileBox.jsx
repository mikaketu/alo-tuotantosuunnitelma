import React from 'react';
import { ts } from '../copy/ts.js';
import * as store from '../store.js';
import { downloadJson } from '../file.js';

export function jsonFilename(dateIso) { return `${ts('ui.export.jsonFilename')}-${dateIso}.json`; }

/** "Tallenna tiedostona": the plan as a file the visitor keeps, the only way it leaves this browser. */
export default function FileBox({ s }) {
  const save = () => downloadJson(store.exportJson(), jsonFilename(s.plan.cover.date));
  return (
    <div className="box filebox">
      <span className="eyebrow">{ts('ui.exit.file.eyebrow')}</span>
      <button type="button" className="btn ghost md" onClick={save}>{ts('ui.exit.file.save')}</button>
      <span className="muted small">{ts('ui.exit.file.note')}</span>
    </div>
  );
}
