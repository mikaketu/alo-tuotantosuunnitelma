// Locale output for dates (weekday, day.month.year, month titles) via Intl —
// this is formatting, not copy, so it does not live in fi.json.
import { parseIso } from './engine/dates.js';

import { lang } from './copy/ts.js';

const FORMATS = {
  weekday: { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' },
  month: { month: 'long', year: 'numeric' },
  short: { day: 'numeric', month: 'numeric' },
  wd: { weekday: 'short' },
};
const cache = {};
/** One Intl formatter per (language, format); the language is fixed before the first render. */
const fmt = (name) => { const k = `${lang}:${name}`; return cache[k] || (cache[k] = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'fi-FI', FORMATS[name])); };

/** 'pe 20.11.2026' */
export function fmtWeekday(iso) { return fmt('weekday').format(parseIso(iso)).replace(/\.$/, ''); }
/** 'marraskuu 2026' */
export function monthTitle(year, month) { return fmt('month').format(new Date(year, month, 15, 12)); }
/** '20.11.' */
export function fmtShort(iso) { return fmt('short').format(parseIso(iso)); }
/** Date object → '20.11.2026' (the plan's date column). */
export function fmtDate(d) { return d ? `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}` : ''; }
/** Date object → 'pe 20.11.2026' */
export function fmtWeekdayD(d) { return fmt('weekday').format(d).replace(/\.$/, ''); }
/** ['ma','ti','ke','to','pe','la','su'] */
export function weekdayHeaders() {
  const mon = new Date(2024, 0, 1, 12); // a Monday
  return [0, 1, 2, 3, 4, 5, 6].map((i) => fmt('wd').format(new Date(mon.getTime() + i * 86400000)).replace(/\.$/, ''));
}
