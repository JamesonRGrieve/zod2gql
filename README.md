# zod2gql

Generate GraphQL query, mutation and subscription documents from Zod 4 schemas.

The schema's shape becomes the selection set, nested objects and arrays of objects become sub-selections, and the operation field is taken from the operation name or from the schema's `.describe()` name. Zod itself is never modified.

## Install

```bash
pnpm add zod2gql zod
```

`zod` (`^4`) is a peer dependency, so the schemas you pass in are built with your own copy.

## Usage

```ts
import { z } from 'zod';
import { GQLType, toGQL } from 'zod2gql';

const User = z
  .object({
    id: z.string(),
    email: z.string(),
    team: z.object({ id: z.string(), name: z.string() }).nullable(),
  })
  .describe('User');

toGQL(User, GQLType.Query, { operationName: 'GetUser', variables: { id: '42' } });
```

```graphql
query GetUser($id: String!) {
  user(id: $id) {
    id
    email
    team {
      id
      name
    }
  }
}
```

An array schema selects the pluralised field:

```ts
toGQL(z.array(User)); // query { users { ... } }
```

## API

| Export                                                                    | Purpose                                                                                             |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `toGQL(schema, type?, options?)`                                          | Render an operation from a `ZodObject`, or a `ZodArray` of one. `type` defaults to `GQLType.Query`. |
| `createQuery` / `createMutation` / `createSubscription`                   | Object-schema shorthands for the three operation types.                                             |
| `processArrayQuery` / `processArrayMutation` / `processArraySubscription` | Array-schema renderers.                                                                             |
| `processFields(schema, type, options?, depth?)`                           | Render only a selection set.                                                                        |
| `GQLType`                                                                 | `Query`, `Mutation`, `Subscription`.                                                                |

`ToGQLOptions`:

| Option          | Effect                                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| `operationName` | Names the operation; a `Get`/`Create`/`Update`/`Delete`/`Subscribe` prefix is stripped to form the field name. |
| `variables`     | Declares `$name` variables (types inferred from the values) and passes them as field arguments.                |
| `inputTypeMap`  | Overrides an inferred variable type, e.g. `{ input: 'CreateUserInput' }`.                                      |
| `maxDepth`      | Stops descending into nested objects past this depth (default 10).                                             |

Optional and nullable wrappers are looked through, so `z.object({...}).nullable().optional()` still yields a sub-selection.

## Errors

A schema that cannot become a valid GraphQL document throws a `GQLSchemaError` instead of rendering broken output. Its message and its `path` property name the field where rendering stopped, starting from the operation's root field (`user.team.display-name`).

Field names, variable names, the operation name and the root field name must be GraphQL names, matching `/^[_A-Za-z][_0-9A-Za-z]*$/`: no hyphens, spaces, leading digits or non-ASCII letters. GraphQL has no reserved words, so fields called `query`, `type`, `on` or `fragment` are fine. The root field comes from `operationName` or from the schema's `.describe()` name; if neither gives one, rendering throws.

## License

AGPL-3.0-or-later
