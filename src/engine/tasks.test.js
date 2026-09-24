import { describe, it, expect } from 'vitest';
import { evaluate, impact, rules } from './index.js';
import { parseIso, toIso, addDays } from './dates.js';

const today = parseIso('2026-10-01');
const base = (over = {}, answers = {}) => ({ v: 1, cover: { type: 'keikka', date: '2026-11-15', headcount: 120, pub: true, ...over }, answers: { venue: 'own', programme: ['live'], ...answers }, later: [], owners: {}, done: {} });
const ids = (r) => r.tasks.map((t) => t.id);

describe('engine semantics', () => {
  it('"en tiedä" fails open: the rows fire as no and a V-00 confirm row is added', () => {
    const r = evaluate(base({}, { v_pa: 'unknown' }), today);
    expect(ids(r)).toContain('X-10'); expect(ids(r)).toContain('V-00:pa');
    expect(r.tasks.find((t) => t.id === 'X-10').unknown).toBe(true);
  });
  it('no venue: venue rows are pending, F-rows fire, nothing is dated', () => {
    const r = evaluate(base({}, { venue: 'none' }), today);
    const x10 = r.tasks.find((t) => t.id === 'X-10');
    expect(x10.pending).toBe(true); expect(x10.date).toBe(null);
    expect(ids(r)).toEqual(expect.arrayContaining(['F-01', 'F-02', 'F-03']));
  });
  it('a venue that has it suppresses the profile suggestion with the reason', () => {
    const r = evaluate(base({}, { v_tech: 'yes', v_pa: 'yes' }), today);
    expect(ids(r)).not.toContain('X-11');
    expect(r.suppressed.find((s) => s.id === 'X-11').because).toContainEqual({ f: 'venue.tech', value: 'yes' });
  });
  it('X-91 needs bare space and a late night, exempts Häät and Yksityistilaisuus, and is pending while the late card is unanswered', () => {
    expect(ids(evaluate(base({ type: 'yritys', pub: false }, { v_bare: 'yes', ends: 'after23' }), today))).toContain('X-91');
    expect(ids(evaluate(base({ type: 'haat', pub: false }, { v_bare: 'yes', ends: 'after23' }), today))).not.toContain('X-91');
    const pending = evaluate(base({}, { v_bare: 'yes' }), today).tasks.find((t) => t.id === 'X-91');
    expect(pending.pending).toBe(true);
  });
  it('the 200-person rows fail open from 150 with the "probable" wording and are plain from 200', () => {
    const r = evaluate(base({ headcount: 180 }), today);
    expect(r.tasks.find((t) => t.id === 'X-90').variant).toBe('probable');
    expect(r.tasks.find((t) => t.id === 'P-30').variant).toBe('probable');
    expect(evaluate(base({ headcount: 200 }), today).tasks.find((t) => t.id === 'X-90').variant).toBe(null);
    expect(evaluate(base({ headcount: 200 }), today).tasks.find((t) => t.id === 'P-30').variant).toBe(null);
    expect(ids(evaluate(base({ headcount: 149 }), today))).not.toContain('P-30');
    expect(ids(evaluate(base({ headcount: 149 }), today))).not.toContain('X-90');
  });
  it('several performances repeat X-96 per day, capped at 7, and P5 counts from the last day', () => {
    const r = evaluate(base({}, { performances: 'several', lastDate: '2026-11-25' }), today);
    const reps = r.tasks.filter((t) => t.id.startsWith('X-96@'));
    expect(reps.length).toBe(7);
    expect(toIso(r.Elast)).toBe('2026-11-25');
    expect(toIso(r.tasks.find((t) => t.id === 'P-54').date)).toBe(toIso(addDays(parseIso('2026-11-25'), 7)));
  });
  it('a fixed statutory deadline already past is late, not moved', () => {
    const r = evaluate(base({ date: '2026-10-03', headcount: 250 }), today);
    const p30 = r.tasks.find((t) => t.id === 'P-30');
    expect(p30.late).toBe(true); expect(toIso(p30.date)).toBe('2026-09-28');
    expect(r.phases.length).toBe(2);
  });
  it('an up-swiped card defaults the rows behind it to the venue, except locked rows', () => {
    const r = evaluate(base({}, { tickets: 'venue' }), today);
    expect(r.tasks.find((t) => t.id === 'P-03').def).toBe('venue');
    expect(r.tasks.find((t) => t.id === 'X-92').def).toBe('me');
  });
  it('locked rows ignore explicit owners; other rows keep them', () => {
    const p = base(); p.owners = { 'C-12': 'venue', 'P-22': 'venue' };
    const r = evaluate(p, today);
    expect(r.tasks.find((t) => t.id === 'C-12').owner).toBe('me');
    expect(r.tasks.find((t) => t.id === 'P-22').owner).toBe('venue');
  });
  it('registration is asked for a seminar on either deck; tickets only public and not for seminars', () => {
    const pub = evaluate(base({ type: 'seminaari', pub: true }, { programme: ['speakers'] }), today);
    expect(pub.cards.map((c) => c.id)).toContain('registration'); expect(pub.cards.map((c) => c.id)).not.toContain('tickets');
  });
  it('cardImpact reports what an answer adds', () => {
    const p = base({}, { merch: undefined });
    const d = impact(p, today, 'merch', 'yes');
    expect(d.adds).toContain('X-97');
  });
  it('up on the alcohol card means the venue handles it: X-33 fires, X-30–X-32 do not, and X-33 defaults to the venue', () => {
    const r = evaluate(base({}, { alcohol: 'venue', v_licence: 'no' }), today);
    expect(ids(r)).toContain('X-33'); expect(ids(r)).not.toContain('X-31'); expect(ids(r)).not.toContain('X-32');
    expect(r.tasks.find((t) => t.id === 'X-33').def).toBe('venue');
    expect(r.cards.find((c) => c.id === 'alcohol').options).toEqual(['none', 'we_bring', 'we_sell']);
  });
  it('the ends card feeds X-91: after 22 in a bare space fires it, before 22 does not, unanswered is pending', () => {
    expect(ids(evaluate(base({ type: 'yritys', pub: false }, { v_bare: 'yes', ends: 'late22' }), today))).toContain('X-91');
    expect(ids(evaluate(base({ type: 'yritys', pub: false }, { v_bare: 'yes', ends: 'before22' }), today))).not.toContain('X-91');
  });
  it('outdoor = yes fires the new X-100 row', () => expect(ids(evaluate(base({}, { outdoor: 'yes' }), today))).toContain('X-100'));
  it('the service profile is the event type\'s own list: Klubi suggests a safer-space contact, Stand-up does not', () => {
    expect(ids(evaluate(base({ type: 'klubi' }), today))).toContain('S-03');
    expect(ids(evaluate(base({ type: 'standup' }), today))).not.toContain('S-03');
    expect(evaluate(base({ type: 'standup' }), today).facts.profile).toEqual(rules.types.standup.services);
  });
  it('the venue card hands nothing over: it is never an ↑ card for ownership', () => {
    const r = evaluate(base({}, { venue: 'own' }), today);
    expect(r.tasks.every((t) => !t.why.upCards.includes('venue'))).toBe(true);
    expect(r.tasks.every((t) => t.def === 'me')).toBe(true);
  });
  it('the category order is the eight categories', () => expect(rules.categories).toEqual(['financing', 'security', 'venue', 'programming', 'logistics', 'communications', 'staffing', 'catering']));
});
