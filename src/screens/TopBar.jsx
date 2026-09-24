import React from 'react';
import { ts } from '../copy/ts.js';

export function Wordmark() {
  return <span className="wordmark">{ts('ui.brand')}</span>;
}

/** The 36 px row above every screen: `left` / `right` are already-rendered nodes. */
export default function TopBar({ left, right }) {
  return <div className="top">{left || <span />}{right || <span />}</div>;
}
