# Claude Code Instructions — @zephyrex/zod2gql

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
- `index.ts` — barrel export + prototype extension (`z.ZodObject.prototype.toGQL`)

### Usage

```typescript
import '@zephyrex/zod2gql';
import { z } from 'zod';

const UserSchema = z.object({ id: z.string(), email: z.string(), name: z.string() });
const query = UserSchema.toGQL('query', { operationName: 'GetUser' });
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

Strict-clean (`strict: true`, `allowJs: false`). All ratchets green. Currently on Zod 3 — needs porting to Zod 4 to match sibling packages.

## License

AGPL-3.0-or-later. SPDX header on every source file.
