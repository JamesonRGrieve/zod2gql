#!/usr/bin/env node
/**
 * Strict-tsc ratchet. Runs `tsc --noEmit -p <config>` (default
 * tsconfig.strict.json — next-tier strictness flags on top of the main
 * tsconfig) and counts distinct files with at least one error.
 *
 * Baseline file: .strict-baseline (plain count of failing files).
 *
 * Also reusable via:
 *   node scripts/strict-ratchet.mjs --config tsconfig.test.json --baseline .test-typecheck-baseline
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const argv = process.argv.slice(2);
function arg(name, fallback) {
  const i = argv.indexOf(name);
  if (i === -1) return fallback;
  return argv[i + 1];
}

const config = arg('--config', 'tsconfig.strict.json');
const baselinePath = arg('--baseline', '.strict-baseline');
const label = arg('--label', 'strict-ratchet');
const updateMode = argv.includes('--update');

const BASELINE = resolve(process.cwd(), baselinePath);
const CONFIG = resolve(process.cwd(), config);

if (!existsSync(CONFIG)) {
  console.error(`[${label}] missing ${CONFIG}`);
  process.exit(2);
}

let tscOutput = '';
try {
  tscOutput = execSync(`./node_modules/.bin/tsc --noEmit --pretty false -p ${config}`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 128 * 1024 * 1024,
  });
} catch (err) {
  tscOutput = (err.stdout?.toString() ?? '') + (err.stderr?.toString() ?? '');
}

const LINE_RE = /^(.+?)\((\d+),(\d+)\):\s+error\s+TS\d+:/;
const failingFiles = new Set();
let totalErrors = 0;
for (const line of tscOutput.split('\n')) {
  const m = LINE_RE.exec(line);
  if (!m) continue;
  failingFiles.add(m[1]);
  totalErrors++;
}

const current = failingFiles.size;

if (updateMode) {
  writeFileSync(BASELINE, `${current}\n`, 'utf8');
  console.log(`[${label}] baseline updated to ${current} files (${totalErrors} total errors)`);
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  writeFileSync(BASELINE, `${current}\n`, 'utf8');
  console.log(`[${label}] baseline initialised at ${current} files (${totalErrors} total errors)`);
  process.exit(0);
}

const baseline = parseInt(readFileSync(BASELINE, 'utf8').trim(), 10);
if (Number.isNaN(baseline)) {
  console.error(`[${label}] cannot parse baseline at ${BASELINE}`);
  process.exit(2);
}

if (current > baseline) {
  console.error(`[${label}] FAIL: failing files rose ${baseline} -> ${current} (+${current - baseline}).`);
  console.error('---first 20 error lines---');
  console.error(
    tscOutput
      .split('\n')
      .filter((l) => LINE_RE.test(l))
      .slice(0, 20)
      .join('\n'),
  );
  console.error(`Either fix the new errors or, if intentional, run with --update.`);
  process.exit(1);
}

if (current < baseline) {
  console.log(`[${label}] OK: failing files dropped ${baseline} -> ${current}. Lower the baseline in the same commit.`);
  process.exit(0);
}

console.log(`[${label}] OK: failing files unchanged at ${current}.`);
process.exit(0);
