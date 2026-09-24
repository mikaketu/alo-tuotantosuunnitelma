import React, { useEffect, useRef } from 'react';
import { ts } from '../copy/ts.js';
import * as store from '../store.js';

const BLOCKS = [
  ['ui.privacy.stored.title', ['ui.privacy.stored.plan', 'ui.privacy.stored.none']],
  ['ui.privacy.file.title', ['ui.privacy.file.text']],
  ['ui.privacy.delete.title', ['ui.privacy.delete.text']],
];

/** "Lähdekoodi" beside "Tietosuoja" in the footers: this tool's source on GitHub. */
export function SourceLink() {
  return <a className="btn text sm" href={ts('ui.privacy.repoUrl')} target="_blank" rel="noopener noreferrer">{ts('ui.privacy.source.title')}</a>;
}

/** The tool's own privacy statement as a sheet. Esc closes it (useKeys → closeSheet). */
export default function Privacy() {
  const closeRef = useRef(null);
  const boxRef = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current && closeRef.current.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; prev && prev.focus && prev.focus(); };
  }, []);
  const trap = (e) => {
    if (e.key !== 'Tab' || !boxRef.current) return;
    const f = boxRef.current.querySelectorAll('button, a[href]');
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  const url = ts('ui.privacy.repoUrl');
  const source = ts('ui.privacy.source.text', { repoUrl: '\u0000' }).split('\u0000');
  return (
    <div className="sheet-back" onClick={() => store.openSheet(false)}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="privacy-title" ref={boxRef} onClick={(e) => e.stopPropagation()} onKeyDown={trap}>
        <div className="top">
          <h2 className="serif" id="privacy-title">{ts('ui.privacy.title')}</h2>
          <button type="button" ref={closeRef} className="btn ghost sm" onClick={() => store.openSheet(false)}>{ts('ui.privacy.close')}</button>
        </div>
        <p className="intro">{ts('ui.privacy.intro')}</p>
        {BLOCKS.map(([title, texts]) => (
          <section key={title}>
            <h3 className="eyebrow navy">{ts(title)}</h3>
            {texts.map((k) => <p key={k}>{ts(k)}</p>)}
          </section>
        ))}
        <section>
          <h3 className="eyebrow navy">{ts('ui.privacy.source.title')}</h3>
          <p>{source[0]}<a href={url} target="_blank" rel="noopener noreferrer">{url.replace(/^https?:\/\//, '')}</a>{source[1] || ''}</p>
        </section>
      </div>
    </div>
  );
}
