// "Käy tehtävät läpi yksitellen" on a second pass (owner report 2026-09-24): the one-by-one
// walk goes through every task of the category by position, decided ones too, instead of
// finding nothing undecided and jumping to the next category.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { evaluate } from '../engine/index.js';
import { taskTitle } from '../engine/render.js';
import * as store from '../store.js';
import Ownership, { ownCats } from './Ownership.jsx';

const today = new Date('2026-09-24T12:00:00');
const base = { ...store.freshPlan(today), started: true, revealed: true, cover: { type: 'keikka', date: '2026-12-20', headcount: 120, pub: true }, answers: { venue: 'own' } };
const ev = () => evaluate(store.getState().plan, today);
const html = () => renderToStaticMarkup(<Ownership s={store.getState()} ev={ev()} keys={{ current: {} }} />).replace(/ /g, ' ');

beforeEach(() => { vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} }); store.setToday(today); });

describe('one by one on a second pass', () => {
  it('shows the decided tasks in order and moves on one at a time', () => {
    const cat = ownCats(evaluate(base, today).tasks)[0];
    const owners = Object.fromEntries(cat.tasks.map((t) => [t.id, 'me']));
    store._reset({ plan: { ...base, owners, own: { cat: 0, mode: 'cat', done: true } } });
    store.restartOwn();
    store.dealCat();
    expect(store.getState().plan.own).toMatchObject({ cat: 0, mode: 'tasks', i: 0 });
    const [first, second] = cat.tasks;
    expect(html()).toContain(taskTitle(first));
    store.ownDecide(first, 'me');
    expect(store.getState().plan.own.i).toBe(1);
    if (second) expect(html()).toContain(taskTitle(second));
    store.undo();
    expect(store.getState().plan.own.i).toBe(0);
  });
  it('the next category starts from its first task', () => {
    store._reset({ plan: { ...base, own: { cat: 0, mode: 'tasks', i: 3, done: false } } });
    store.nextCat();
    expect(store.getState().plan.own).toMatchObject({ cat: 1, mode: 'cat', i: 0 });
  });
});
