// Re-entry: first unanswered card, never card 1; plan / summary once done; the reveal once.
import { describe, it, expect } from 'vitest';
import { landingView } from './landing.js';
import { evaluate, rules } from './engine/index.js';
import { freshPlan } from './store.js';

const today = new Date('2026-09-23T12:00:00');
const base = () => ({ ...freshPlan(today), started: true, cover: { type: 'keikka', date: '2026-11-20', headcount: 120, pub: true } });
const ev = (plan) => evaluate(plan, today);

describe('landingView', () => {
  it('no type or not started → cover', () => {
    expect(landingView(freshPlan(today), [])).toBe('cover');
    expect(landingView({ ...base(), started: false }, [{ id: 'venue' }])).toBe('cover');
  });
  it('an unfinished deck lands on the first unanswered card, never card 1', () => {
    const plan = base();
    plan.answers.venue = 'own';
    const e = ev(plan);
    expect(landingView(plan, e.queue)).toBe('deck');
    expect(e.queue[0].id).not.toBe('venue');
    expect(e.queue[0].id).toBe(e.cards[1].id);
  });
  it('a finished deck lands on the reveal, then the plan, then the summary', () => {
    const plan = base();
    for (const c of rules.cards) if (c.kind !== 'cap') plan.answers[c.id] = c.kind === 'multi' ? ['live'] : c.kind === 'yesno' ? 'no' : c.options ? c.options[0] : 'none';
    plan.answers.venue = 'none';
    let e = ev(plan);
    expect(e.queue).toHaveLength(0);
    expect(landingView(plan, e.queue)).toBe('reveal');
    plan.answers.venue = 'own';
    for (const c of rules.cards) if (c.kind === 'cap') plan.answers[c.id] = 'yes';
    e = ev(plan);
    expect(landingView(plan, e.queue)).toBe('reveal');
    expect(landingView({ ...plan, revealed: true }, e.queue)).toBe('plan');
    expect(landingView({ ...plan, revealed: true, own: { cat: 3, mode: 'cat', done: true } }, e.queue)).toBe('summary');
  });
  it('nothing about the screen is stored: a plan saved on the exit screen lands by the rule', () => {
    const plan = { ...base(), view: 'exit' };
    const e = ev(plan);
    expect(landingView(plan, e.queue)).toBe('deck');
  });
});
