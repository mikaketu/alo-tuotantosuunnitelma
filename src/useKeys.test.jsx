// @vitest-environment jsdom
// Keyboard parity: each key maps to the same handler the button calls.
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, vi } from 'vitest';
import { keyAction, useKeys } from './useKeys.js';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const ev = (key) => ({ key });
const deck = { view: 'deck', tapOnly: false, sheet: false };

describe('keyAction', () => {
  it('maps the deck keys', () => {
    expect(keyAction(ev('ArrowLeft'), deck)).toEqual({ name: 'left' });
    expect(keyAction(ev('ArrowRight'), deck)).toEqual({ name: 'right' });
    expect(keyAction(ev('ArrowUp'), deck)).toEqual({ name: 'up' });
    expect(keyAction(ev('m'), deck)).toEqual({ name: 'later' });
    expect(keyAction(ev('M'), deck)).toEqual({ name: 'later' });
    expect(keyAction(ev('3'), deck)).toEqual({ name: 'option', arg: 2 });
    expect(keyAction(ev('5'), deck)).toBeNull();
    expect(keyAction(ev('Enter'), deck)).toEqual({ name: 'confirm' });
    expect(keyAction(ev('Escape'), deck)).toEqual({ name: 'exit' });
  });
  it('← → are ignored on tap-only cards, ↑ is not', () => {
    const tap = { ...deck, tapOnly: true };
    expect(keyAction(ev('ArrowLeft'), tap)).toBeNull();
    expect(keyAction(ev('ArrowRight'), tap)).toBeNull();
    expect(keyAction(ev('ArrowUp'), tap)).toEqual({ name: 'up' });
  });
  it('Z undoes on every view; Esc does nothing on cover and exit; deck keys do nothing elsewhere', () => {
    expect(keyAction(ev('z'), { view: 'cover' })).toEqual({ name: 'undo' });
    expect(keyAction(ev('Z'), { view: 'exit' })).toEqual({ name: 'undo' });
    expect(keyAction(ev('Escape'), { view: 'cover' })).toBeNull();
    expect(keyAction(ev('Escape'), { view: 'exit' })).toBeNull();
    expect(keyAction(ev('ArrowLeft'), { view: 'cover' })).toBeNull();
  });
  it('Enter (and →) continues past the reveal; nothing else reacts on the plan', () => {
    expect(keyAction(ev('Enter'), { view: 'reveal' })).toEqual({ name: 'confirm' });
    expect(keyAction(ev('ArrowRight'), { view: 'reveal' })).toEqual({ name: 'confirm' });
    expect(keyAction(ev('Enter'), { view: 'plan' })).toBeNull();
    expect(keyAction(ev('ArrowRight'), { view: 'plan' })).toBeNull();
  });
  it('with the privacy sheet open only Esc acts, and it closes the sheet', () => {
    expect(keyAction(ev('Escape'), { ...deck, sheet: true })).toEqual({ name: 'closeSheet' });
    expect(keyAction(ev('ArrowLeft'), { ...deck, sheet: true })).toBeNull();
    expect(keyAction(ev('z'), { ...deck, sheet: true })).toBeNull();
  });
});

function Harness({ handlers }) {
  const ref = React.useRef(handlers);
  ref.current = handlers;
  useKeys(ref);
  return <input aria-label="x" />;
}

describe('useKeys listener', () => {
  it('calls the handler the buttons use, ignores keys inside inputs and with modifiers', () => {
    const handlers = { ...deck, left: vi.fn(() => true), undo: vi.fn(), exit: vi.fn(() => true) };
    const host = document.createElement('div'); document.body.appendChild(host);
    const root = createRoot(host);
    act(() => { root.render(<Harness handlers={handlers} />); });
    const fire = (target, key, extra = {}) => act(() => { target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...extra })); });
    fire(document.body, 'ArrowLeft');
    expect(handlers.left).toHaveBeenCalledTimes(1);
    fire(host.querySelector('input'), 'ArrowLeft');
    expect(handlers.left).toHaveBeenCalledTimes(1);
    fire(document.body, 'ArrowLeft', { ctrlKey: true });
    expect(handlers.left).toHaveBeenCalledTimes(1);
    fire(document.body, 'z');
    expect(handlers.undo).toHaveBeenCalledTimes(1);
    fire(document.body, 'Escape');
    expect(handlers.exit).toHaveBeenCalledTimes(1);
    act(() => { root.unmount(); }); host.remove();
  });
});
