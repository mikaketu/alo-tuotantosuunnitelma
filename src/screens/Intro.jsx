import React from 'react';
import { ts } from '../copy/ts.js';
import * as store from '../store.js';
import TopBar, { Wordmark } from './TopBar.jsx';
import { LangSwitch } from './Cover.jsx';

/** The intro page: what the tool is, before the cover's questions.
 *  A fresh visitor lands here; a plan in progress skips it. */
export default function Intro() {
  return (
    <div className="app intro-page">
      <TopBar left={<Wordmark />} right={<span className="row"><LangSwitch /><span className="muted">{ts('ui.nologin')}</span></span>} />
      <h1 className="serif title">{ts('ui.cover.title')}</h1>
      <div className="stack-v">
        {['ui.intro.p1', 'ui.intro.p2'].map((k) => <p key={k} className="intro">{ts(k)}</p>)}
      </div>
      <div className="stack-v go">
        <button type="button" className="btn primary wide big" onClick={() => store.closeIntro()}>{ts('ui.intro.start')} →</button>
        <span className="muted note">{ts('ui.cover.promise')}</span>
      </div>
    </div>
  );
}
