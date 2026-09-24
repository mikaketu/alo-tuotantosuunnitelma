import React from 'react';
import { ts } from '../copy/ts.js';
import * as store from '../store.js';
import { SourceLink } from './Privacy.jsx';
import TopBar, { Wordmark } from './TopBar.jsx';
import ResetBlock from './ResetBlock.jsx';
import FileBox from './FileBox.jsx';

/** "Tallenna ja lopeta": the plan stays in this browser; save it as a file to take it elsewhere. Nothing is sent to anyone. */
export default function Exit({ s }) {
  return (
    <div className="app exit">
      <TopBar left={<Wordmark />} />
      <h1 className="serif title">{ts('ui.exit.title')}</h1>
      <p className="intro">{ts('ui.exit.text')}</p>
      <FileBox s={s} />
      <button type="button" className="btn primary wide big" onClick={() => store.resume()}>{ts('ui.exit.resume')} →</button>
      <p className="muted note">{ts('ui.exit.note')}</p>
      <ResetBlock />
      <footer className="foot">
        <button type="button" className="btn text sm" onClick={() => store.openSheet(true)}>{ts('ui.privacy.link')}</button>
        <SourceLink />
      </footer>
    </div>
  );
}
