# Claude Code Instructions — zod2gql

TypeScript library that converts Zod schemas to GraphQL queries, mutations, and subscriptions. Consumed by `@zephyrex/auth` and `zephyrex` (client framework).

## Stack Standards

Read **before your first edit**:

- `/home/jameson/Source/ai-prompts/typescript.md`

---

## Architecture

Pure TypeScript, no React dependency. 7 source files:

- `core.ts` — `GQLType` enum, options, variable-type inference, field name extraction, `renderOperation` (the one operation renderer every entry point uses), `processFields`
- `selection.ts` — `renderSelectionSet`: classifies each field schema through zod's core constructors (leaf / object / union fragments), looks through wrappers, detects cycles, enforces `maxDepth`
- `errors.ts` — `GQLSchemaError` (carries the field `path`) and GraphQL `Name` validation
- `query.ts` — `createQuery`, `processQuery`
- `mutation.ts` — `createMutation`, `processMutation`
- `subscription.ts` — `createSubscription`, `processSubscription`
- `index.ts` — barrel export + `toGQL(schema, type, options)` router (zod is never patched; `zod@^4` is a peer)

A schema that cannot become a valid document throws `GQLSchemaError`; nothing is silently dropped. The README's "How Zod types map" table is the contract for each zod type.

### Usage

```typescript
import { z } from 'zod';
import { GQLType, toGQL } from 'zod2gql';

const UserSchema = z.object({ id: z.string(), email: z.string(), name: z.string() }).describe('User');
const query = toGQL(UserSchema, GQLType.Query, { operationName: 'GetUser' });
```

---

## Commands

```bash
pnpm install
pnpm compile          # Build to dist/
pnpm test             # Vitest (one test file per source file)
pnpm check            # All ratchets
```

## Status

Strict-clean (`strict: true`, `allowJs: false`). All ratchets green. Targets Zod 4, shared with the sibling packages as a peer dependency.

## License

AGPL-3.0-or-later. SPDX header on every source file.
