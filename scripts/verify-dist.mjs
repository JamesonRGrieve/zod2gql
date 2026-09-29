// SPDX-License-Identifier: AGPL-3.0-or-later
// Loads the built package through Node's own ESM loader, the way a Node consumer or a
// test runner would. Bundlers tolerate extensionless relative imports; Node does not,
// so a dist/ that only a bundler can load fails here.
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const entry = pathToFileURL(resolve('dist/index.js')).href;
const mod = await import(entry);
if (typeof mod.toGQL !== 'function') {
  console.error('[verify-dist] dist/index.js loaded but does not export toGQL');
  process.exit(1);
}
console.warn('[verify-dist] OK: dist/index.js loads under Node ESM');
