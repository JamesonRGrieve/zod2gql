# Claude Code Instructions — zod2gql

This is a **TypeScript translator library** that converts Zod schemas to GraphQL schemas. Consumed by `client-framework` and other downstream apps as a submodule. Workspace-level TS/JS standards (Direction, Casting, Ratchets, ESLint, TS, Test, Pre-commit, Hard Rules) live in `../CLAUDE.md` §7 and apply here. This file documents the rules **specific** to this repo.

Package manager: **npm**. Toolchain: TypeScript + Babel + ESLint + Prettier. (Storybook config exists for parity with sibling repos but the package itself has no UI.)

---

## Current State

This repo is **not yet at workspace-grade**. Tracked debt:

- `tsconfig.json` has `"strict": false` and `"strictNullChecks": false` flagged with `// TODO Make this work.` Same pathway as `auth/`: introduce `.tsc-error-baseline`, ratchet to zero, flip strict on.
- `target: "es5"` is stale; bump to `ESNext` once strict lands.
- Trailing comma after `plugins` array in `tsconfig.json` is a JSON syntax error suppressed only by JSON5-tolerant readers — fix it.
- No `vitest.config.ts` or `tests/` directory. The translator pipeline (Zod → GraphQL AST → GraphQL SDL) is **pure logic and 100% Vitest-coverable**; this is the highest-leverage thing this repo is missing. Aim for full unit coverage of every Zod type → GraphQL type mapping branch.
- No ratchet scripts. Adopt `dynamic-form/scripts/` runners.

Track in `todo.json` (create if absent).

---

## Repo-Specific Direction (in addition to workspace §7.1)

- **The translator is pure**: input → output, no globals, no I/O. All branches must be unit-testable. Resist any urge to import runtime context (Apollo client, Next request, etc.) into the translator core.
- **Coverage of every Zod type variant matters more than total LOC coverage.** A bug in `z.optional(z.union([...]))` handling that a single edge case test would have caught will silently break every consumer. Prefer table-driven tests that exhaustively iterate Zod combinator combinations.
- **Casting policy is strict** (workspace §7.2): `as Record<string, any>` casts in a translator that's meant to produce a precisely-typed GraphQL schema would be self-defeating. Use Zod's own narrowed types (`z.ZodTypeAny` only at the entry, narrowed to specific `z.ZodType<…>` at every branch).

---

## Path Aliases

None at the repo level — this is a leaf library. When consumed as a submodule in `client-framework`, the parent's `tsconfig.json` declares `zod2gql` → `./src/lib/zod2gql/src`. Don't add aliases here.

---

## Commands

```bash
npm install
npm run lint / npm run lint:fix
npm run format / npm run format:fix
npm run typecheck                     # tsc --noEmit
npm run compile                       # tsc → dist/
```

Add Vitest + the ratchet/symmetry commands as part of bringing this repo up to workspace grade.
