import React from 'react';
import { ts } from '../copy/ts.js';
import * as store from '../store.js';
import { readTextFile } from '../file.js';
import { showToast } from '../toast.js';

/** "Avaa tallennettu tiedosto": a file input styled as a text button; the file is read in the browser only. */
export default function OpenFile() {
  const onChange = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try { store.importJson(await readTextFile(f)); showToast(ts('ui.toast.opened')); }
    catch (_) { showToast(ts('ui.toast.openFailed')); }
  };
  return (
    <label className="btn text sm openfile">
      {ts('ui.cover.open')}
      <input type="file" accept=".json,application/json" onChange={onChange} />
    </label>
  );
}
