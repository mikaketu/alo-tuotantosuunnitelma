import React, { useState } from 'react';
import { ts } from '../copy/ts.js';
import * as store from '../store.js';
import { showToast } from '../toast.js';

/** "Aloita alusta": a link that arms an inline confirmation — never confirm(). */
export default function ResetBlock() {
  const [armed, setArmed] = useState(false);
  if (!armed) return <div className="reset"><button type="button" className="btn text" onClick={() => setArmed(true)}>{ts('ui.cover.resetLink')}</button></div>;
  return (
    <div className="reset box" role="group">
      <p>{ts('ui.cover.resetAsk')}</p>
      <div className="accel">
        <button type="button" className="btn primary md" onClick={() => { store.reset(); showToast(ts('ui.toast.reset')); }}>{ts('ui.cover.resetYes')}</button>
        <button type="button" className="btn ghost md" onClick={() => setArmed(false)}>{ts('ui.cover.resetNo')}</button>
      </div>
    </div>
  );
}
