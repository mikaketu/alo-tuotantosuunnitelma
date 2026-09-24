// Näin suunnitelma syntyy — the reading view of rules.json. Seven tabs,
// hash-routed so a row or a run can be linked to. The chrome here is literal
// Finnish; everything the visitor would see comes through the copy table via
// the engine's renderer, so this page cannot drift from the tool.

import React, { useEffect, useState } from 'react';
import RulesTable from './RulesTable.jsx';
import CardsTable from './CardsTable.jsx';
import ServiceMatrix from './ServiceMatrix.jsx';
import StatutesTable from './StatutesTable.jsx';
import RunViewer from './RunViewer.jsx';
import CopyView from './CopyView.jsx';
import Simulator from './Simulator.jsx';
import { rules } from '../engine/index.js';

export const TABS = [
  ['rivit', 'Tehtävärivit', RulesTable],
  ['kortit', 'Kortit', CardsTable],
  ['palvelut', 'Palvelut', ServiceMatrix],
  ['saadokset', 'Säädökset', StatutesTable],
  ['ajot', 'Ajot A–I', RunViewer],
  ['kopio', 'Kopio', CopyView],
  ['simulaattori', 'Simulaattori', Simulator],
];

function hashTab() {
  if (typeof window === 'undefined') return 'rivit';
  const h = window.location.hash.replace(/^#/, '').split('/')[0];
  return TABS.some(([k]) => k === h) ? h : 'rivit';
}

export default function Saannot({ initialTab } = {}) {
  const [tab, setTab] = useState(initialTab || hashTab());
  useEffect(() => {
    const on = () => setTab(hashTab());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const Active = TABS.find(([k]) => k === tab)[2];
  return (
    <>
      <header>
        <a className="logo" href="./">Tuotantosuunnitelma</a>
        <a className="back-btn" href="./">&larr; Työkaluun</a>
      </header>
      <main>
        <h1>Näin suunnitelma syntyy</h1>
        <p className="subtitle">
          Tämä sivu piirtyy suoraan sääntötaulukosta (<code>rules.json</code> v{rules.version}) ja samasta
          moottorista, joka tekee kävijän suunnitelman — se ei voi jäädä jälkeen koodista.
          {' '}{rules.rows.length} tehtäväriviä, {rules.cards.length} korttia, {Object.keys(rules.statutes).length} säädöstä.
          Tekstejä muokataan kopiotaulukon kautta (<code>docs/copy-master.md</code>), ei tällä sivulla.
        </p>
        <nav className="ss-tabs" aria-label="Näkymät">
          {TABS.map(([k, label]) => (
            <a key={k} href={`#${k}`} className={k === tab ? 'on' : ''} aria-current={k === tab ? 'page' : undefined} onClick={() => setTab(k)}>{label}</a>
          ))}
        </nav>
        <section className="ss-panel"><Active /></section>
      </main>
    </>
  );
}
