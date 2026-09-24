// Civil-date helpers (noon trick, no DST drift). Dates are 'YYYY-MM-DD' strings at the API surface.
export const DAY = 86400000;
export function parseIso(s) { return new Date(`${s}T12:00:00`); }
export function toIso(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
export function addDays(d, n) { const x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
export function diffDays(a, b) { return Math.round((b - a) / DAY); }
