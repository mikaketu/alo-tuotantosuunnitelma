// Lazy-mounted toast singleton. Reuses `<div id="toast">` if the page already
// has one (e.g. tapahtuma.html provides its own styled element); otherwise
// creates a centred bottom toast with the brand colours.

let _toastTimer = null;

export function showToast(msg, ms = 2500) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#18216D;color:#FFF1D0;padding:10px 18px;border-radius:8px;font-size:13px;z-index:9999;opacity:0;transition:opacity 0.2s;pointer-events:none';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.style.opacity = '0'; }, ms);
}
