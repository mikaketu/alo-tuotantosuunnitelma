// Browser entry for index.html. No server, no cookies, no network: the saved plan
// is read from this browser's storage before the first render.
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './screens/App.jsx';
import * as store from './store.js';
import { setLang } from './copy/ts.js';

// Language: ?lang= in the address wins, then the visitor's last choice on the fi/en switch.
const remembered = (() => { try { return localStorage.getItem('ts-lang'); } catch (_) { return null; } })();
if ((new URLSearchParams(window.location.search).get('lang') || remembered) === 'en') { setLang('en'); document.documentElement.lang = 'en'; }

store.load();
createRoot(document.getElementById('root')).render(<App />);
