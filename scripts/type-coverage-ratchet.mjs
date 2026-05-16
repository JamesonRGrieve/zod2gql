#!/usr/bin/env node
/**
 * type-coverage ratchet. Runs `type-coverage --strict --ignore-nested --no-detail`
 * and extracts the percentage of source positions whose inferred type is non-`any`.
 *
 * `--ignore-nested` discounts `any` appearing only inside type arguments
 * (e.g. Zod's `ZodType<any, any, any>`). The translator's input surface is
 * Zod schemas — internally Zod uses `any` in its generic params and we
 * can't eliminate that without forking the library. The flag lets us
 * measure coverage of *our* code without being held hostage to Zod's
 * internal typing choices.
 *
 * Baseline file: .type-coverage-baseline — plain number, e.g. `97.42`.
 *
 * Semantics: the percentage may NEVER fall below the baseline. When it
 * reaches 100, the ratchet auto-graduates to strict mode (baseline = 100)
 * and any future drop is a hard fail.
 *
 * Usage:
 *   node scripts/type-coverage-ratchet.mjs           # check
 *   node scripts/type-coverage-ratchet.mjs --update  # rewrite baseline
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASELINE = resolve(process.cwd(), '.type-coverage-baseline');
const args = new Set(process.argv.slice(2));
const updateMode = args.has('--update');

let stdout = '';
try {
  stdout = execSync('./node_modules/.bin/type-coverage --strict --ignore-nested --no-detail', {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 16 * 1024 * 1024,
  });
} catch (err) {
  stdout = err.stdout?.toString() ?? '';
}

// type-coverage prints e.g. `1234 / 1300\n94.92%` or `(1234 / 1300) 94.92%`
const m = /([\d.]+)\s*%/.exec(stdout);
if (!m) {
  console.error('[type-coverage-ratchet] could not parse type-coverage output:');
  console.error(stdout);
  process.exit(2);
}
const percent = Number(m[1]);
if (!Number.isFinite(percent)) {
  console.error('[type-coverage-ratchet] parsed percent is NaN');
  process.exit(2);
}

const baseExists = existsSync(BASELINE);
const prior = baseExists ? Number(readFileSync(BASELINE, 'utf8').trim()) : null;
const priorStrict = prior === 100;

function write(p) {
  writeFileSync(BASELINE, `${p}\n`, 'utf8');
}

if (priorStrict && percent < 100) {
  console.error('[type-coverage-ratchet] STRICT-MODE VIOLATION: previously 100%, now ' + percent + '%.');
  console.error('Run `npm run type-coverage` (or with --detail) to see the regressions.');
  console.error('`--update` will NOT silence this. Edit the baseline manually if intentional.');
  process.exit(1);
}

if (updateMode) {
  write(percent);
  console.log(`[type-coverage-ratchet] baseline updated to ${percent}%`);
  process.exit(0);
}

if (!baseExists) {
  write(percent);
  console.log(`[type-coverage-ratchet] baseline initialised at ${percent}%`);
  process.exit(0);
}

if (prior === null || Number.isNaN(prior)) {
  console.error(`[type-coverage-ratchet] cannot parse baseline at ${BASELINE}`);
  process.exit(2);
}

if (percent < prior) {
  console.error(`[type-coverage-ratchet] FAIL: type coverage dropped ${prior}% -> ${percent}%.`);
  console.error('Either fix the new `any` positions or, if intentional, run: npm run type-coverage:ratchet:update');
  process.exit(1);
}

if (percent === 100 && !priorStrict) {
  write(100);
  console.log('[type-coverage-ratchet] GRADUATED to strict: type coverage reached 100%.');
  process.exit(0);
}

if (percent > prior) {
  console.log(
    `[type-coverage-ratchet] OK: type coverage rose ${prior}% -> ${percent}%. Raise the baseline in the same commit: npm run type-coverage:ratchet:update`,
  );
} else {
  console.log(`[type-coverage-ratchet] OK: type coverage unchanged at ${percent}%.`);
}
process.exit(0);
