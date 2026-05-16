#!/usr/bin/env node
/**
 * dependency-cruiser ratchet. Runs `depcruise --output-type json src` and
 * tallies violation counts split by severity (errors, warnings) plus per-rule
 * counts. Baseline file: .depcruise-baseline (JSON: { errors, warnings, byRule, strict }).
 *
 * Per-severity totals cannot rise. Per-rule counts cannot rise. When a rule's
 * count reaches 0 it auto-flips to strict mode — further violations are a
 * hard fail with no `--update` escape.
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASELINE = resolve(process.cwd(), '.depcruise-baseline');
const args = new Set(process.argv.slice(2));
const updateMode = args.has('--update');

let raw = '';
try {
  raw = execSync('./node_modules/.bin/depcruise --config .dependency-cruiser.cjs --output-type json src', {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 256 * 1024 * 1024,
  });
} catch (err) {
  raw = err.stdout?.toString() ?? '';
}

let report;
try {
  report = JSON.parse(raw);
} catch (e) {
  console.error('[depcruise-ratchet] could not parse depcruise JSON:');
  console.error(raw.slice(0, 500));
  process.exit(2);
}

const byRule = {};
let errors = 0;
let warnings = 0;

function bumpRule(rule) {
  if (!rule?.name) return;
  byRule[rule.name] = (byRule[rule.name] ?? 0) + 1;
  if (rule.severity === 'error') errors++;
  else warnings++;
}

for (const mod of report.modules ?? []) {
  for (const rule of mod.rules ?? []) bumpRule(rule);
  for (const dep of mod.dependencies ?? []) {
    for (const rule of dep.rules ?? []) bumpRule(rule);
  }
}

// dep-cruiser provides a summary.violations array as a clean source of truth.
if (Array.isArray(report?.summary?.violations) && report.summary.violations.length) {
  // Reset and use summary as the authoritative count if present.
  errors = 0;
  warnings = 0;
  for (const k of Object.keys(byRule)) delete byRule[k];
  for (const v of report.summary.violations) {
    const name = v.rule?.name;
    if (!name) continue;
    byRule[name] = (byRule[name] ?? 0) + 1;
    if (v.rule?.severity === 'error') errors++;
    else warnings++;
  }
}

const baseExists = existsSync(BASELINE);
const prior = baseExists ? JSON.parse(readFileSync(BASELINE, 'utf8')) : null;
const priorByRule = prior?.byRule ?? {};
const priorErrors = Number(prior?.errors ?? 0);
const priorWarnings = Number(prior?.warnings ?? 0);
const priorStrict = new Set(Array.isArray(prior?.strict) ? prior.strict : []);

const strict = new Set(priorStrict);
const newlyStrict = [];
const allRules = new Set([...Object.keys(byRule), ...Object.keys(priorByRule)]);
for (const rule of allRules) {
  const count = byRule[rule] ?? 0;
  if (count === 0 && !strict.has(rule)) {
    strict.add(rule);
    newlyStrict.push(rule);
  }
}

const strictViolations = [];
for (const rule of [...strict].sort()) {
  if ((byRule[rule] ?? 0) > 0) strictViolations.push(`${rule}: ${byRule[rule]} (strict — must be 0)`);
}
if (strictViolations.length) {
  console.error('[depcruise-ratchet] STRICT-MODE VIOLATION:');
  for (const v of strictViolations) console.error('  ' + v);
  console.error('`--update` will NOT silence this.');
  process.exit(1);
}

const out = {
  strict: [...strict].sort(),
  errors,
  warnings,
  byRule: Object.fromEntries(
    Object.keys(byRule)
      .sort()
      .map((r) => [r, byRule[r]]),
  ),
};
const serialized = JSON.stringify(out, null, 2) + '\n';

if (updateMode) {
  writeFileSync(BASELINE, serialized, 'utf8');
  console.log(`[depcruise-ratchet] baseline updated. errors=${errors} warnings=${warnings}`);
  process.exit(0);
}

if (!baseExists) {
  writeFileSync(BASELINE, serialized, 'utf8');
  console.log(`[depcruise-ratchet] baseline initialised. errors=${errors} warnings=${warnings}`);
  process.exit(0);
}

const failures = [];
if (errors > priorErrors) failures.push(`errors: ${priorErrors} -> ${errors} (+${errors - priorErrors})`);
if (warnings > priorWarnings) failures.push(`warnings: ${priorWarnings} -> ${warnings} (+${warnings - priorWarnings})`);
for (const rule of Object.keys(byRule)) {
  if (strict.has(rule)) continue;
  const c = byRule[rule];
  const b = priorByRule[rule] ?? null;
  if (b === null) continue;
  if (c > b) failures.push(`${rule}: ${b} -> ${c} (+${c - b})`);
}

if (failures.length) {
  console.error('[depcruise-ratchet] FAIL:');
  for (const f of failures) console.error('  ' + f);
  console.error('Either fix or run: npm run deps:ratchet:update');
  process.exit(1);
}

const brandNew = Object.keys(byRule).filter((r) => !(r in priorByRule));
if (newlyStrict.length || brandNew.length) {
  writeFileSync(BASELINE, serialized, 'utf8');
  if (newlyStrict.length) console.log(`[depcruise-ratchet] GRADUATED to strict: ${newlyStrict.join(', ')}`);
  if (brandNew.length) console.log(`[depcruise-ratchet] new rules: ${brandNew.join(', ')}`);
}

console.log(`[depcruise-ratchet] OK: errors=${errors} warnings=${warnings}`);
if (strict.size) console.log(`[depcruise-ratchet] strict rules (must remain 0): ${[...strict].sort().join(', ')}`);
process.exit(0);
