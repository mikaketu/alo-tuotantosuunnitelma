// Keyboard parity: every direction has a
// key, and the key calls the same handler the button does. Keys are ignored
// inside inputs and while the privacy sheet is open; Z undoes on every view.
//   deck: ← → (not on tap cards) · ↑ · M later · 1–4 options · Enter confirm · Esc exit
//   reveal: Enter / → continue
//   own: the deck keys again (← none · → me · ↑ the venue · M later · Enter = deal the category)
import { useEffect } from 'react';

const EDITABLE = 'input, textarea, select, [contenteditable="true"]';

/** Pure: map a keydown to a handler name (+ arg), or null. `ctx` = {view, tapOnly, sheet}. */
export function keyAction(ev, ctx) {
  if (ctx.sheet) return ev.key === 'Escape' ? { name: 'closeSheet' } : null;
  const k = ev.key;
  if (k === 'z' || k === 'Z') return { name: 'undo' };
  if (k === 'Escape') return ctx.view === 'cover' || ctx.view === 'exit' ? null : { name: 'exit' };
  if (ctx.view === 'reveal' && (k === 'Enter' || k === 'ArrowRight')) return { name: 'confirm' };
  if (ctx.view !== 'deck' && ctx.view !== 'own') return null;
  if (k === 'ArrowLeft') return ctx.tapOnly ? null : { name: 'left' };
  if (k === 'ArrowRight') return ctx.tapOnly ? null : { name: 'right' };
  if (k === 'ArrowUp') return { name: 'up' };
  if (k === 'm' || k === 'M') return { name: 'later' };
  if (/^[1-4]$/.test(k)) return { name: 'option', arg: Number(k) - 1 };
  if (k === 'Enter') return { name: 'confirm' };
  return null;
}

/**
 * `handlersRef.current` = { view, tapOnly, sheet, undo, exit, left, right, up, later, option(i), confirm, closeSheet }.
 * Screens refresh the ref on every render; the listener is installed once.
 */
export function useKeys(handlersRef, target = typeof document !== 'undefined' ? document : null) {
  useEffect(() => {
    if (!target) return undefined;
    const onKey = (ev) => {
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
      if (ev.target && ev.target.closest && ev.target.closest(EDITABLE)) return;
      const h = handlersRef.current || {};
      const a = keyAction(ev, h);
      if (!a || typeof h[a.name] !== 'function') return;
      const handled = h[a.name](a.arg);
      if (handled !== false && a.name !== 'undo') ev.preventDefault();
    };
    target.addEventListener('keydown', onKey);
    return () => target.removeEventListener('keydown', onKey);
  }, [handlersRef, target]);
}
