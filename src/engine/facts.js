// cover + answers → facts. The only code-shaped logic in the engine; everything
// the rule table says is data evaluated by trigger.js.
import { evalTrigger, PENDING } from './trigger.js';
import { parseIso, diffDays } from './dates.js';

// Which deck card feeds each base fact — used to derive "this task defaults to
// the venue because you swiped that card up" and the card behind a why line.
export const FACT_CARDS = {
  venue: 'venue', programme: 'programme', programme_dj_only: 'programme', performances: 'performances',
  layout: 'layout', staffing: 'staffing', catering: 'catering', alcohol: 'alcohol', tickets: 'tickets',
  registration: 'registration', merch: 'merch', exhibitors: 'exhibitors', stage_slot: 'stage_slot',
  build_days: 'build_days', rigging: 'rigging', outdoor: 'outdoor', bare: 'v_bare', late: 'ends', ends: 'ends', headcount: 'headcount',
};

const YESNO = new Set(['merch', 'exhibitors', 'stage_slot', 'build_days', 'rigging', 'outdoor']);

/** Exact headcount → bucket index (alle 50 · 50–150 · 150–400 · yli 400). */
export function bucketOf(rules, n) { return rules.headcountBuckets.filter((b) => n >= b).length; }

/** Presets merged under raw answers; 'venue' (↑ = the venue handles it) on option/yes-no cards normalised. */
export function effectiveAnswers(rules, cover, answers) {
  const preset = (rules.types[cover.type] || {}).preset || {};
  const a = { ...preset, ...answers };
  const venueCards = new Set(Object.keys(answers).filter((k) => answers[k] === 'venue'));
  for (const k of Object.keys(rules.venueHandles)) if (a[k] === 'venue') a[k] = rules.venueHandles[k];
  for (const k of YESNO) if (a[k] === 'venue') a[k] = 'yes';
  // Staffing is a multi-select (empty = you do it all yourselves): a saved single
  // answer reads as its list, "Molempia" as both.
  if (typeof a.staffing === 'string') a.staffing = a.staffing === 'mix' ? ['friends', 'paid'] : [a.staffing];
  return { a, venueCards };
}

export function factsOf(rules, cover, answers, today) {
  const { a, venueCards } = effectiveAnswers(rules, cover, answers);
  const type = cover.type;
  const t = rules.types[type];
  if (!t) throw new Error(`unknown type ${type}`);
  const venue = a.venue === 'own' ? 'own' : 'none';
  const prog = a.programme === 'venue' ? ['venue'] : Array.isArray(a.programme) ? a.programme : [];
  const val = (k) => (a[k] === undefined ? 'unset' : a[k]);
  const f = {
    deck: cover.pub ? 'public' : 'closed',
    type,
    family: t.family,
    headcount: cover.headcount,
    head: bucketOf(rules, cover.headcount),
    runway: diffDays(today, parseIso(cover.date)),
    venue,
    programme: prog,
    programme_answered: prog.length > 0,
    programme_dj_only: prog.length === 1 && prog[0] === 'dj',
    performances: val('performances'),
    layout: val('layout'),
    staffing: val('staffing'),
    catering: val('catering'),
    alcohol: val('alcohol'),
    tickets: val('tickets'),
    registration: val('registration'),
    merch: val('merch'),
    exhibitors: val('exhibitors'),
    stage_slot: val('stage_slot'),
    build_days: val('build_days'),
    rigging: val('rigging'),
    outdoor: val('outdoor'),
    ends: val('ends'),
  };
  // Profile: the services this event type usually needs (rules.json types.<k>.services);
  // ticket sales drop out when tickets are free.
  const prof = new Set(t.services || []);
  if (a.tickets !== undefined && a.tickets === 'free') prof.delete('ticket_sales');
  f.profile = [...prof];
  // Derived booleans, declared in rules.json, evaluated in order.
  for (const [name, trig] of Object.entries(rules.derived)) f[name] = evalTrigger(trig, f);
  // Bare space (X-91's first term): no venue → pending. `late` (after 22) comes from the ends card.
  const vb = a.v_bare;
  f.bare = venue !== 'own' ? PENDING : vb === 'yes' ? 'yes' : vb === undefined ? PENDING : 'no';
  f.late = a.ends === undefined ? PENDING : a.ends === 'before22' ? 'no' : 'yes';
  // Venue capabilities: yes | no | na (not applicable) | pending. "en tiedä" counts as no (fail open) and is listed in venue_unknown.
  f.venue_unknown = [];
  for (const card of rules.cards) {
    if (card.kind !== 'cap') continue;
    const key = card.capability;
    const fact = `venue.${key}`;
    const applies = card.applies === true ? true : evalTrigger(card.applies, f);
    if (applies === false) { f[fact] = 'na'; continue; }
    if (venue !== 'own') { f[fact] = PENDING; continue; }
    const raw = a[card.id];
    if (raw === 'unknown') { f[fact] = 'no'; f.venue_unknown.push(key); continue; }
    if (raw === 'yes') { f[fact] = 'yes'; continue; }
    if (raw === 'no') { f[fact] = 'no'; continue; }
    // unanswered: pre-answered "no" by V0 = bare space, otherwise fail open as "no"
    f[fact] = 'no';
  }
  f.venue_cards = [...venueCards];
  return f;
}
