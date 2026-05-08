# Claude Code Instructions — zod2gql

`zod2gql` augments Zod schemas with a `.toGQL()` method that emits GraphQL queries, mutations, and subscriptions. The public surface is `z.ZodObject` and `z.ZodArray` extended via module augmentation, plus a handful of helpers (`processQuery`, `processMutation`, `processSubscription`, `pluralize`, `getOperationFieldName`, `formatVariablesDeclaration`, `formatFieldArguments`, `processFields`). Library code is in `src/`; everything ships from `dist/`.

The lib has a tiny code surface and a large blast radius — it sits underneath GraphQL clients in consuming apps. Correctness, type strictness, and stable output are the only things that matter.

---

## Direction (every change must advance these)

These are not optional polish items. Every PR, refactor, and new code path must move the codebase in these directions, or it does not land. A change that is neutral on all four is suspicious — ask whether it's worth doing.

1. **Full strong TypeScript coverage.** No new `any`. No new `as any`. No new `@ts-ignore` / `@ts-expect-error` (existing suppressions may stay until the underlying issue is fixed, but every PR should reduce, not grow, that count). New code is fully typed at signatures and return values; prefer narrow types over `unknown`. **Never resort to `any`** for convenience, even for Zod-internal type wrangling; reach for generics or structural types instead. **Fix the root cause, not the symptom**: if the compiler complains about a `_def` shape, tighten the underlying type definition rather than sprinkling casts. Inference is always preferred over casting.

2. **Stable GraphQL output.** The strings emitted by `processQuery` / `processMutation` / `processSubscription` are part of the public contract. Whitespace, indentation, field ordering, and pluralization rules are all observable. A change that alters output without a clear correctness win is a regression — even if all the unit tests still pass. When you do change output, the diff must be deliberate, captured in tests as a snapshot update, and called out in the commit message.

3. **Test coverage matches the code surface.** Every helper in `src/` has a vitest test. Every operation type (Query / Mutation / Subscription, Object / Array variant) has both a unit test and a Storybook story demonstrating realistic usage. New code lands with its tests in the same PR; new bug fixes land with a regression test that fails on `main` and passes after the fix.

4. **Zod-internal-API isolation.** This library is one of the few callers of Zod's internal `_def` and `instanceof z.ZodObject` machinery. When Zod releases a new minor (or major), expect to update this code. Concentrate Zod-internal access inside `src/` helpers — never let it leak into stories or tests beyond what's needed for fixtures. When a new Zod version forces a breaking change, bump the major version of `zod2gql` and document the matrix in `README.md`.

---

## Testing & coverage (required for every change)

These are not aspirational. Code without these is incomplete.

- **Vitest covers all functionality.** Pure logic (pluralization, type inference, field formatting, field traversal) all gets unit tests. `pnpm test` must pass before commit. Tests live co-located as `src/**/*.test.ts` or under `tests/` for cross-cutting integration tests.
- **Storybook stories for every operation surface.** Each operation type has a `*.stories.tsx` showing a realistic schema plus the resulting GraphQL string. Stories are interactive — viewers can change the input schema and watch the output update.
- **No "renders without throwing" stories alone.** If a story exists for a behavior, it asserts on the rendered output (the emitted GraphQL string), not just that React mounted.
- **Storybook + Playwright integration test.** `pnpm test:storybook:integration` builds the static site and walks every story to catch render-time exceptions. CI runs this on every push.

When you add a helper, its test is part of the same PR. When you fix a bug, also add a regression test — leave the area better covered than you found it.

---

## Coverage metrics & ratchets

Every direction in the previous section is backed by a coverage script and a ratchet. The ratchets enforce a one-way valve: any PR may improve a metric, no PR may regress one. When a metric drops, run the matching `*:ratchet:update` to lower the baseline in the same commit. The pre-commit hook runs all ratchets in sequence; bypassing with `--no-verify` requires explicit user authorization.

### Ratchet inventory

| Direction                                                                   | Ratchet                  | Baseline file              |
| --------------------------------------------------------------------------- | ------------------------ | -------------------------- |
| ESLint warnings                                                             | `pnpm lint:ratchet`      | `.eslint-warning-baseline` |
| `tsc --noEmit` total errors                                                 | `pnpm typecheck:ratchet` | `.tsc-error-baseline`      |
| Strong TS (`any`, `as any`, `@ts-expect-error`, `@ts-ignore` per directory) | `pnpm ts:ratchet`        | `.ts-coverage-baseline`    |

Each ratchet:

1. Computes a current count of "bad things" (warnings, type errors, untyped escapes).
2. Compares it to a committed baseline file.
3. **Fails the commit if the count went up**; passes if it went down or stayed the same.
4. When a metric drops, run `pnpm <metric>:ratchet:update` in the same commit so the new floor is locked in.

Errors (not warnings) from ESLint are never allowed regardless of baseline — fix them.

The baselines are committed. Treat lowering one as load-bearing: a PR that lowers `.eslint-warning-baseline` from 50 to 47 is doing real work.

---

## TS strictness coverage

`pnpm ts:coverage` regex-counts the four manual-suppression patterns agents are most likely to introduce when fixing types under time pressure:

- bare `: any` annotations
- ` as any` casts
- `@ts-expect-error` directives
- `@ts-ignore` directives

Counts are aggregated by top-level directory under `src/`. The ratchet refuses commits that increase any (directory, metric) pair. New directories are admitted at their current count and ratcheted from there forward.

The repo intentionally keeps this independent from the `tsc --noEmit` error ratchet — that gates the compiler's view; this gates the four escape hatches the compiler can't see.

---

## Pre-commit pipeline (in order)

1. `lint-staged` — Prettier + ESLint --fix on staged `.ts`/`.tsx`/`.json`/`.md`.
2. `typecheck:ratchet` — `tsc --noEmit`, count errors, compare to baseline.
3. `lint:ratchet` — `eslint`, count warnings, compare to baseline.
4. `ts:ratchet` — per-directory `any` / `as any` / `@ts-expect-error` / `@ts-ignore` counts, compare to baseline.
5. `vitest run` — full unit-test pass.

The Storybook + Playwright integration test runs in CI, not pre-commit (it builds the static site, which is too slow for every commit).

---

## Build, test, dev

- `pnpm build` — `tsc` to `dist/`. Runs `clean` first.
- `pnpm test` — `vitest run`. Add `--watch` for TDD.
- `pnpm test:coverage` — vitest with v8 coverage report.
- `pnpm storybook` — dev server on `localhost:6006`.
- `pnpm build-storybook` — static build into `storybook-static/`.
- `pnpm test:storybook:integration` — Playwright walk of the static build.
- `pnpm check` — `lint && format && typecheck && test`. The single one-shot CI command.

---

## Hard rules (operational)

- **Never `git push --force`** without explicit user authorization.
- **Never bypass `--no-verify`** without explicit user authorization. Ratchet failures are signal, not noise.
- **Never amend a published commit.** Create a new commit.
- **Don't add `// @ts-ignore` to silence the compiler.** Fix the type. If the type genuinely cannot be expressed, use `@ts-expect-error` with a description and accept the ratchet bump as a deliberate cost.
- **Don't introduce `any` to make tests pass.** A test that needs `any` is a test that hasn't been written against the right shape yet.
- **Public API changes are major version bumps.** The exported helper signatures and the `.toGQL()` augmentation are observable. Output-string changes are also observable. Breaking either bumps the major.

---

## Project quick reference

| What                       | Where                                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Library source             | `src/index.ts`, `src/query.ts`, `src/mutation.ts`, `src/subscription.ts`                                         |
| Vitest tests               | `src/**/*.test.ts`, `tests/**/*.test.ts`                                                                         |
| Storybook stories          | `src/**/*.stories.tsx`                                                                                           |
| Storybook docs (mdx)       | `docs/**/*.mdx`                                                                                                  |
| Playwright storybook tests | `tests/storybook/**/*.spec.ts`                                                                                   |
| Ratchet scripts            | `scripts/lint-ratchet.mjs`, `scripts/typecheck-ratchet.mjs`, `scripts/ts-coverage.mjs`, `scripts/ts-ratchet.mjs` |
| Baseline files             | `.eslint-warning-baseline`, `.tsc-error-baseline`, `.ts-coverage-baseline`                                       |
| Pre-commit hook            | `.husky/pre-commit`                                                                                              |
| Build output               | `dist/` (gitignored)                                                                                             |
