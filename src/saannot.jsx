// Browser entry for saannot.html — the rule table, rendered from rules.json + the
// engine so it cannot drift from what the tool does. Everything is in the bundle.
import React from 'react';
import { createRoot } from 'react-dom/client';
import Saannot from './saannot/Saannot.jsx';

createRoot(document.getElementById('root')).render(<Saannot />);
