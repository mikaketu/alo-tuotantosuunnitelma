// docs/copy-master.md is the single source for fi.json and en.json. Edit the
// table, run `npm run copy:generate`.
// This pins that the JSON files are exactly what the table generates.
import { execFileSync } from 'node:child_process';
import { describe, it, expect } from 'vitest';

describe('copy master', () => {
  it('fi.json and en.json match the master table', () => {
    const out = execFileSync('node', ['scripts/copy-master.mjs', '--check'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    expect(out).toContain('fi.json: 0 changed, 0 added, 0 removed');
    expect(out).toContain('en.json: 0 changed, 0 added, 0 removed');
    expect(out).toContain('check ok');
  });
});
