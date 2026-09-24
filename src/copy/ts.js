// The tool's own copy tables, fi and en (generated from docs/copy-master.md). The landing
// page's FI · EN switch picks one (store.setLanguage); `?lang=en` or the visitor's last
// choice sets it on load. Every visible string goes through ts(); components never carry literals.
import FI from './fi.json' with { type: 'json' };
import EN from './en.json' with { type: 'json' };

export const COPY = FI;
const TABLES = { fi: FI, en: EN };
let table = FI;
export let lang = 'fi';

/** Pick the copy table once, before the first render. Unknown languages stay Finnish. */
export function setLang(l) { lang = TABLES[l] ? l : 'fi'; table = TABLES[lang]; }

/** Translate `key`, filling `{name}` from vars. A missing key returns the key itself so it is visible, never silent. */
export function ts(key, vars) {
  const s = table[key];
  if (s === undefined) return key;
  return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] === undefined ? m : String(vars[k]))) : s;
}

export function has(key) { return table[key] !== undefined; }

