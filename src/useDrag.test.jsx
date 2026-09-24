// @vitest-environment jsdom
// Drag physics: thresholds, damping, rotation, stamps, snap-back on cancel, fly timing.
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dampen, progress, commitDir, useDrag, FLY_MS } from './useDrag.js';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const W = 350, H = 470;
const ALL = { lr: true, up: true };

describe('pure physics', () => {
  it('commits sideways at 35 % of the width and up at 25 % of the height, not before', () => {
    expect(commitDir(W * 0.34, 0, W, H, ALL)).toBeNull();
    expect(commitDir(W * 0.36, 0, W, H, ALL)).toBe('right');
    expect(commitDir(-W * 0.36, 0, W, H, ALL)).toBe('left');
    expect(commitDir(0, -H * 0.24, W, H, ALL)).toBeNull();
    expect(commitDir(0, -H * 0.26, W, H, ALL)).toBe('up');
  });
  it('up wins over sideways when its progress is higher', () => {
    expect(commitDir(W * 0.2, -H * 0.5, W, H, ALL)).toBe('up');
    expect(commitDir(W * 0.5, -H * 0.2, W, H, ALL)).toBe('right');
    // Both axes past their threshold: sideways wins.
    expect(commitDir(W * 0.5, -H * 0.5, W, H, ALL)).toBe('right');
  });
  it('a resisted left (locked card) never commits and moves at ×0.2; downward is damped ×0.3', () => {
    const a = { lr: true, up: true, left: false };
    expect(dampen(-100, 0, a)).toEqual({ x: -20, y: 0 });
    expect(commitDir(-W, 0, W, H, a)).toBeNull();
    expect(dampen(0, 100, ALL)).toEqual({ x: 0, y: 30 });
    expect(dampen(0, -100, { lr: true, up: false })).toEqual({ x: 0, y: -20 });
  });
  it('tap-only cards ignore horizontal motion entirely', () => {
    expect(dampen(200, 0, { lr: false, up: true })).toEqual({ x: 0, y: 0 });
    expect(progress(200, 0, W, H, { lr: false, up: true }).px).toBe(0);
  });
  it('stamp progress is proportional and capped at 1', () => {
    expect(progress(W * 0.175, 0, W, H, ALL).px).toBeCloseTo(0.5);
    expect(progress(W * 2, 0, W, H, ALL).px).toBe(1);
    expect(progress(0, -H * 0.125, W, H, ALL).py).toBeCloseTo(0.5);
  });
});

function Harness({ onCommit, allow = ALL }) {
  const { ref, api } = useDrag({ allow, onCommit, key: 'k' });
  Harness.api = api;
  return (
    <div ref={ref} className="card front" style={{ width: W, height: H }}>
      <span data-stamp="l" /><span data-stamp="r" /><span data-stamp="u" />
      <button type="button">b</button>
    </div>
  );
}

function ptr(el, type, x, y, extra = {}) {
  const ev = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0, ...extra });
  el.dispatchEvent(ev);
}

describe('useDrag on an element', () => {
  let host, root, el, commit;
  beforeEach(() => {
    vi.useFakeTimers();
    host = document.createElement('div'); document.body.appendChild(host);
    root = createRoot(host); commit = vi.fn();
    act(() => { root.render(<Harness onCommit={commit} />); });
    el = host.querySelector('.card');
    Object.defineProperty(el, 'offsetWidth', { value: W, configurable: true });
    Object.defineProperty(el, 'offsetHeight', { value: H, configurable: true });
  });
  afterEach(() => { act(() => { root.unmount(); }); host.remove(); vi.useRealTimers(); });

  it('rotates dx×0.05° while dragging and paints the matching stamp', () => {
    ptr(el, 'pointerdown', 100, 100);
    expect(el.classList.contains('drag')).toBe(true);
    ptr(el, 'pointermove', 160, 100);
    expect(el.style.transform).toContain('rotate(3deg)');
    expect(el.style.transform).toContain('60px');
    expect(Number(el.querySelector('[data-stamp="r"]').style.opacity)).toBeCloseTo(60 / (W * 0.35));
    expect(el.querySelector('[data-stamp="l"]').style.opacity).toBe('0');
  });
  it('snaps back below the threshold and on pointercancel', () => {
    ptr(el, 'pointerdown', 100, 100); ptr(el, 'pointermove', 150, 100); ptr(el, 'pointerup', 150, 100);
    expect(commit).not.toHaveBeenCalled();
    expect(el.style.transform).toContain('+ 0px');
    ptr(el, 'pointerdown', 100, 100); ptr(el, 'pointermove', 300, 100); ptr(el, 'pointercancel', 300, 100);
    expect(commit).not.toHaveBeenCalled();
    expect(el.classList.contains('drag')).toBe(false);
    expect(el.style.transform).toContain('+ 0px');
  });
  it('commits right past 35 % after the 220 ms fly, and up past 25 % of the height', () => {
    ptr(el, 'pointerdown', 0, 0); ptr(el, 'pointermove', W * 0.4, 0); ptr(el, 'pointerup', W * 0.4, 0);
    expect(commit).not.toHaveBeenCalled();
    expect(el.style.opacity).toBe('0');
    vi.advanceTimersByTime(FLY_MS);
    expect(commit).toHaveBeenCalledWith('right');
  });
  it('a pointerdown on a button inside the card starts no drag', () => {
    ptr(el.querySelector('button'), 'pointerdown', 0, 0);
    expect(el.classList.contains('drag')).toBe(false);
  });
  it('the api flies the card for buttons and keys and calls back once', () => {
    Harness.api.fly('left', commit);
    Harness.api.fly('right', commit); // ignored while flying
    vi.advanceTimersByTime(FLY_MS);
    expect(commit).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledWith('left');
  });
  it('reduced motion flies in 0 ms', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    Harness.api.fly('up', commit);
    vi.advanceTimersByTime(0);
    expect(commit).toHaveBeenCalledWith('up');
    vi.unstubAllGlobals();
  });
});
