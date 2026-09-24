// The card's drag physics: rotation dx×0.05°, downward ×0.3, resisted directions ×0.2,
// commit at 35 % of width / 25 % of height, 220 ms fly-out (0 under reduced
// motion). Pointer capture on the card itself, so a finger that leaves the
// card keeps dragging; pointercancel / lostpointercapture snap back.
//
// The hook returns a ref for the card element and an imperative api
// { setT, stamps, fly } that the buttons, the keys and the coach share, so
// every way of answering moves the same card the same way.
import { useEffect, useMemo, useRef } from 'react';

export const FLY_MS = 220;
export const COMMIT_X = 0.35;
export const COMMIT_Y = 0.25;

export function prefersReducedMotion() {
  try { return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) { return false; }
}

/** Pure: pointer delta → damped delta for this card's allowances. */
export function dampen(dx, dy, allow) {
  let x = dx, y = dy;
  if (!allow.lr) x = 0;
  if (allow.left === false && x < 0) x *= 0.2;
  if (allow.up === false && y < 0) y *= 0.2;
  if (y > 0) y *= 0.3;
  return { x, y };
}

/** Pure: damped delta → stamp progress {px, py, upWins} for a W×H card. */
export function progress(x, y, W, H, allow) {
  const px = allow.lr ? Math.min(1, Math.max(0, Math.abs(x) / (W * COMMIT_X))) : 0;
  const py = allow.up ? Math.min(1, Math.max(0, -y / (H * COMMIT_Y))) : 0;
  return { px, py, upWins: py > px };
}

/** Pure: which direction a release commits, or null. */
export function commitDir(x, y, W, H, allow) {
  const { px, py } = progress(x, y, W, H, allow);
  if (py >= 1 && py > px) return 'up';
  if (px >= 1 && (x > 0 || allow.left !== false)) return x > 0 ? 'right' : 'left';
  return null;
}

/** `key` — the card id; a new key re-attaches the listeners to the new element. */
export function useDrag({ allow, onCommit, enabled = true, key = null }) {
  const ref = useRef(null);
  const st = useRef({ dragging: false, flying: false, sx: 0, sy: 0, x: 0, y: 0, pid: null });
  const cb = useRef(onCommit);
  cb.current = onCommit;
  const allowRef = useRef(allow);
  allowRef.current = allow;

  const api = useMemo(() => {
    const el = () => ref.current;
    const setT = (x, y, anim) => {
      const e = el(); if (!e) return;
      st.current.x = x; st.current.y = y;
      e.classList.toggle('anim', !!anim);
      e.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${x * 0.05}deg)`;
    };
    const stamps = (l, r, u) => {
      const e = el(); if (!e) return;
      const q = (k) => e.querySelector(`[data-stamp="${k}"]`);
      const sl = q('l'), sr = q('r'), su = q('u');
      if (sl) sl.style.opacity = String(l);
      if (sr) sr.style.opacity = String(r);
      if (su) su.style.opacity = String(u);
    };
    const fly = (dir, done) => {
      const e = el(); if (!e || st.current.flying) return;
      st.current.flying = true;
      const W = e.offsetWidth || 350, H = e.offsetHeight || 470;
      const x = dir === 'left' ? -W * 1.6 : dir === 'right' ? W * 1.6 : 0;
      const y = dir === 'up' ? -H * 1.4 : st.current.y;
      stamps(dir === 'left' ? 1 : 0, dir === 'right' ? 1 : 0, dir === 'up' ? 1 : 0);
      setT(x, y, true);
      e.style.opacity = '0';
      setTimeout(() => { st.current.flying = false; if (done) done(dir); }, prefersReducedMotion() ? 0 : FLY_MS);
    };
    return { setT, stamps, fly, state: st };
  }, []);

  useEffect(() => {
    const e = ref.current;
    if (!e || !enabled) return undefined;
    const size = () => ({ W: e.offsetWidth || 350, H: e.offsetHeight || 470 });
    const paint = () => {
      const a = allowRef.current, { W, H } = size();
      const { px, py, upWins } = progress(st.current.x, st.current.y, W, H, a);
      api.stamps(!upWins && st.current.x < 0 ? px : 0, !upWins && st.current.x > 0 ? px : 0, upWins ? py : 0);
    };
    const down = (ev) => {
      if (st.current.flying || (ev.target.closest && ev.target.closest('button, a, input'))) return;
      if (ev.button !== undefined && ev.button !== 0) return;
      st.current.dragging = true; st.current.sx = ev.clientX; st.current.sy = ev.clientY; st.current.pid = ev.pointerId;
      try { e.setPointerCapture(ev.pointerId); } catch (_) { /* jsdom */ }
      e.classList.add('drag');
    };
    const move = (ev) => {
      if (!st.current.dragging) return;
      const { x, y } = dampen(ev.clientX - st.current.sx, ev.clientY - st.current.sy, allowRef.current);
      api.setT(x, y, false);
      paint();
    };
    const end = () => {
      if (!st.current.dragging) return;
      st.current.dragging = false;
      e.classList.remove('drag');
      const { W, H } = size();
      const dir = commitDir(st.current.x, st.current.y, W, H, allowRef.current);
      if (dir) api.fly(dir, (d) => cb.current && cb.current(d));
      else { api.setT(0, 0, true); api.stamps(0, 0, 0); }
    };
    const cancel = () => {
      if (!st.current.dragging) return;
      st.current.dragging = false;
      e.classList.remove('drag');
      api.setT(0, 0, true); api.stamps(0, 0, 0);
    };
    e.addEventListener('pointerdown', down);
    e.addEventListener('pointermove', move);
    e.addEventListener('pointerup', end);
    e.addEventListener('pointercancel', cancel);
    e.addEventListener('lostpointercapture', cancel);
    return () => {
      e.removeEventListener('pointerdown', down);
      e.removeEventListener('pointermove', move);
      e.removeEventListener('pointerup', end);
      e.removeEventListener('pointercancel', cancel);
      e.removeEventListener('lostpointercapture', cancel);
    };
  }, [api, enabled, key]);

  return useMemo(() => ({ ref, api }), [api]);
}
