import { describe, it, expect } from 'vitest';
import { evalTrigger, explainTrigger, pendingLeaves, factsIn, PENDING } from './trigger.js';

const facts = { deck: 'public', programme: ['live', 'dj'], head: 2, 'venue.pa': PENDING, 'venue.tech': 'no', alcohol: 'none' };

describe('evalTrigger', () => {
  it('true is a base row', () => expect(evalTrigger(true, facts)).toBe(true));
  it('eq on a list is membership', () => expect(evalTrigger({ f: 'programme', eq: 'dj' }, facts)).toBe(true));
  it('in on a list is any-member', () => expect(evalTrigger({ f: 'programme', in: ['speakers', 'live'] }, facts)).toBe(true));
  it('ge on numbers', () => { expect(evalTrigger({ f: 'head', ge: 2 }, facts)).toBe(true); expect(evalTrigger({ f: 'head', ge: 3 }, facts)).toBe(false); });
  it('a pending fact makes eq/in pending', () => expect(evalTrigger({ f: 'venue.pa', eq: 'no' }, facts)).toBe(PENDING));
  it('ne on a pending fact passes', () => expect(evalTrigger({ f: 'venue.pa', ne: 'yes' }, facts)).toBe(true));
  it('all: false beats pending beats true', () => {
    expect(evalTrigger({ all: [{ f: 'venue.pa', eq: 'no' }, { f: 'alcohol', eq: 'we_sell' }] }, facts)).toBe(false);
    expect(evalTrigger({ all: [{ f: 'venue.pa', eq: 'no' }, { f: 'deck', eq: 'public' }] }, facts)).toBe(PENDING);
  });
  it('any: true beats pending beats false', () => {
    expect(evalTrigger({ any: [{ f: 'venue.pa', eq: 'no' }, { f: 'venue.tech', eq: 'no' }] }, facts)).toBe(true);
    expect(evalTrigger({ any: [{ f: 'venue.pa', eq: 'no' }, { f: 'alcohol', eq: 'we_sell' }] }, facts)).toBe(PENDING);
  });
  it('not(pending) stays pending', () => expect(evalTrigger({ not: { f: 'venue.pa', eq: 'no' } }, facts)).toBe(PENDING));
  it('unknown fact names throw (integrity, not silence)', () => expect(() => evalTrigger({ f: 'nope', eq: 1 }, facts)).toThrow());
});

describe('explainTrigger', () => {
  it('returns the satisfied branches of an any with the wanted values', () => {
    const leaves = explainTrigger({ any: [{ f: 'venue.pa', eq: 'no' }, { all: [{ f: 'programme', in: ['live', 'speakers'] }, { f: 'venue.tech', eq: 'no' }] }] }, facts);
    expect(leaves.map((l) => l.f)).toEqual(['programme', 'venue.tech']);
    expect(leaves[0].want).toEqual(['live']);
  });
  it('marks ne leaves as negated', () => expect(explainTrigger({ f: 'alcohol', ne: 'we_sell' }, facts)[0].negated).toBe(true));
  it('lists pending leaves', () => expect(pendingLeaves({ all: [{ f: 'venue.pa', eq: 'no' }, { f: 'deck', eq: 'public' }] }, facts)).toEqual([{ f: 'venue.pa' }]));
  it('collects fact names', () => expect([...factsIn({ any: [{ f: 'a', eq: 1 }, { not: { f: 'b', eq: 2 } }] })]).toEqual(['a', 'b']));
});
