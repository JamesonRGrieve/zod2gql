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
| `maxDepth`      | How many selection sets may nest below the root field's (default 10). A deeper object throws.                  |

Optional and nullable wrappers are looked through, so `z.object({...}).nullable().optional()` still yields a sub-selection.

## How Zod types map

| Zod                                                                                                         | Selection                                                                                       |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `object`                                                                                                    | Sub-selection of its fields.                                                                    |
| `array`, `set`                                                                                              | Whatever the element selects; lists need no extra syntax.                                       |
| `intersection` of objects                                                                                   | Sub-selection of the merged fields.                                                             |
| `union`, `discriminatedUnion` of objects                                                                    | One `... on TypeName { ... }` inline fragment per member; see below.                            |
| `optional`, `nullable`, `nonoptional`, `default`, `prefault`, `catch`, `readonly`, `promise`, `lazy`, brand | Looked through to the inner schema.                                                             |
| `transform`, `pipe`                                                                                         | The pipe's input, which is what the server sends. For `z.preprocess` the output schema is used. |
| `string`, `number`, `boolean`, `bigint`, `date`, `enum`, `literal`, `templateLiteral`                       | Selected by name (a scalar or enum on the server).                                              |
| `record`, `map`, `any`, `unknown`, `custom`, tuples of scalars                                              | Selected by name, as an opaque scalar such as `JSON`.                                           |
| `nan`, `void`, `undefined`, `never`, `null`, `symbol`, `file`, bare `z.transform`, tuples holding objects   | Throw: nothing of that type can come back in a GraphQL response.                                |

### Unions

A GraphQL union is selected through inline fragments, which need each member's type name. zod2gql takes it from `.describe()`, the same place the root field name comes from:

```ts
const Cat = z.object({ meows: z.boolean() }).describe('Cat');
const Dog = z.object({ barks: z.boolean() }).describe('Dog');

toGQL(z.object({ id: z.string(), pet: z.union([Cat, Dog]) }).describe('Owner'));
```

```graphql
query {
  owner {
    id
    pet {
      ... on Cat {
        meows
      }
      ... on Dog {
        barks
      }
    }
  }
}
```

An object member without a name throws. `null` and `undefined` members only make the field nullable, so `z.union([Cat, z.null()])` selects `Cat`'s fields directly. A union of scalars is selected by name. A union that mixes objects and scalars throws, since a GraphQL union holds only object types.

## Errors

A schema that cannot become a valid GraphQL document throws a `GQLSchemaError` instead of rendering broken output. Its message and its `path` property name the field where rendering stopped, starting from the operation's root field (`user.team.display-name`).

Field names, variable names, the operation name and the root field name must be GraphQL names, matching `/^[_A-Za-z][_0-9A-Za-z]*$/`: no hyphens, spaces, leading digits or non-ASCII letters. GraphQL has no reserved words, so fields called `query`, `type`, `on` or `fragment` are fine. The root field comes from `operationName` or from the schema's `.describe()` name; if neither gives one, rendering throws.

Rendering also throws, rather than dropping fields, when:

- an object sits deeper than `maxDepth`. Cutting it off would leave an empty `{}` selection or a missing field, so raise `maxDepth` or pass a shallower schema.
- an object schema contains itself on the current path, through `z.lazy` or a getter in the shape. A selection set is finite, so a recursive type has to be queried through a non-recursive projection that stops at the depth you need. The same schema in sibling fields is fine.
- an object has no fields, since GraphQL has no empty selection set.

## License

AGPL-3.0-or-later
