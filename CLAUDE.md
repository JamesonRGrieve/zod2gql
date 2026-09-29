# Claude Code Instructions — zod2gql

TypeScript library that converts Zod schemas to GraphQL queries, mutations, and subscriptions. Consumed by `@zephyrex/auth` and `zephyrex` (client framework).

## Stack Standards

Read **before your first edit**:

- `/home/jameson/Source/ai-prompts/typescript.md`

---

## Architecture

Pure TypeScript, no React dependency. 5 source files:

- `core.ts` — `GQLType` enum, `processFields`, variable formatting, field name extraction
- `query.ts` — `createQuery`, `processQuery`
- `mutation.ts` — `createMutation`, `processMutation`
- `subscription.ts` — `createSubscription`, `processSubscription`
- `index.ts` — barrel export + `toGQL(schema, type, options)` router (zod is never patched; `zod@^4` is a peer)

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
pnpm test             # Vitest (5 test files)
pnpm check            # All ratchets
```

## Status

Strict-clean (`strict: true`, `allowJs: false`). All ratchets green. Targets Zod 4, shared with the sibling packages as a peer dependency.

## License

AGPL-3.0-or-later. SPDX header on every source file.
