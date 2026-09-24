// The plan as a file: the only way a plan leaves this browser, and only by the
// visitor's own hand. A download of the document, and a read of one back.
export function downloadJson(obj, filename, doc = typeof document !== 'undefined' ? document : null) {
  const text = JSON.stringify(obj, null, 1);
  if (!doc || typeof Blob === 'undefined' || !URL.createObjectURL) return text;
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = doc.createElement('a');
  a.href = url; a.download = filename;
  doc.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return text;
}

export function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ''));
    r.onerror = () => reject(r.error);
    r.readAsText(file);
  });
}
