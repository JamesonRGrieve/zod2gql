# Claude Code Instructions — zod2gql

This is a **TypeScript translator library** that converts Zod schemas to GraphQL schemas. Consumed by `client-framework` and other downstream apps as a submodule. Workspace-level TS/JS standards (Direction, Casting, Ratchets, ESLint, TS, Test, Pre-commit, Hard Rules) live in `../CLAUDE.md` §7 and apply here. This file documents the rules **specific** to this repo.

Package manager: **pnpm** (exclusive). Toolchain: TypeScript + ESLint + Prettier + Vitest. (Storybook config exists for parity with sibling repos but the package itself has no UI.)

---

## State

At workspace grade as of the last ratchet pass:

- `strict: true`, `strictNullChecks: true`, `allowJs: false`, `target: ES2020` — strict-clean.
- Lint, typecheck, symmetry, and js-coverage ratchets all green at zero.
- Vitest in place; `src/index.test.ts` exhaustively covers `pluralize`, `getOperationFieldName`, variable / argument formatting, `processFields` (scalar, nested object, optional/nullable, array-of-object, array-of-scalar, maxDepth), the `schema.toGQL` router for query / mutation / subscription, and the `processArray*` family.

Outstanding nice-to-haves (not blocking):

- Add table-driven tests for less-common Zod combinators: `z.union`, `z.discriminatedUnion`, `z.record`, `z.tuple`, `z.lazy` (recursive), `z.intersection`, `z.literal`. Some of these the translator currently doesn't handle gracefully — those are real bugs that need fixing along with the tests.
- Consider tightening the `(schema._def as { typeName?: string })` cast in `fieldNameFromObject` once Zod ships a public way to access typeName.

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
pnpm install
pnpm run lint / pnpm run lint:fix
pnpm run format / pnpm run format:fix
pnpm run typecheck                     # tsc --noEmit
pnpm run test / pnpm run test:watch
pnpm run compile                       # tsc → dist/

# Ratchets
pnpm run lint:ratchet[:update]
pnpm run typecheck:ratchet[:update]
pnpm run symmetry:ratchet[:update]
pnpm run js-coverage:ratchet[:update]

pnpm run check                         # all four ratchets + format
```
