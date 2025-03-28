# zod2gql

> Seamlessly convert Zod schemas to GraphQL queries, mutations, and subscriptions

[![npm version](https://img.shields.io/npm/v/zod2gql.svg)](https://www.npmjs.com/package/zod2gql)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

`zod2gql` extends Zod's schema objects with GraphQL generation capabilities, allowing you to automatically convert your Zod schemas into GraphQL queries, mutations, and subscriptions.

## Features

- 🚀 **Simple API**: Extend Zod schemas with `.toGQL()` method
- 🔄 **All Operation Types**: Support for queries, mutations, and subscriptions
- 🧩 **Complex Schema Support**: Handles nested objects, arrays, circular references, enums, and more
- 🔍 **Fully Type-Safe**: Written in TypeScript with complete type definitions
- 🛠️ **Customizable**: Control operation names, variables, input types, and recursion depth
- 🧠 **Intelligent**: Can infer operation field names from schema type names
- ⚡ **Lightweight**: Zero dependencies beyond Zod itself

## Installation

```bash
# npm
npm install zod2gql

# yarn
yarn add zod2gql

# pnpm
pnpm add zod2gql
```

## Quick Start

```tsx
import { z } from 'zod';
import { GQLType } from 'zod2gql';
import 'zod2gql/query'; // Import the extension

// Define a Zod schema
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  age: z.number(),
});

// Generate a GraphQL query
const query = userSchema.toGQL(GQLType.Query, {
  operationName: 'GetUser',
  variables: { id: '123' }
});

console.log(query);
/*
query GetUser($id: String!) {
  user(id: $id) {
    id
    name
    email
    age
  }
}
*/
```

## Helper Functions

Instead of using the method directly, you can use the helper functions for better readability:

```tsx
import { z } from 'zod';
import { createQuery, createMutation, createSubscription } from 'zod2gql';

// Query
const query = createQuery(userSchema, {
  operationName: 'GetUser',
  variables: { id: '123' }
});

// Mutation
const mutation = createMutation(userSchema, {
  operationName: 'UpdateUser',
  variables: { id: '123', name: 'New Name' }
});

// Subscription
const subscription = createSubscription(userSchema, {
  operationName: 'UserUpdated',
  variables: { userId: '123' }
});
```

## Operation Name Inference

zod2gql can infer the operation field name from the schema's type name if available:

```tsx
// Add a type name to your schema
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string()
});
(userSchema as any)._def.typeName = 'User';

// The operation field name "user" will be inferred
const query = createQuery(userSchema, {
  variables: { id: '123' }
});

console.log(query);
/*
query($id: String!) {
  user(id: $id) {
    id
    name
    email
  }
}
*/
```

## Handling Complex Schemas

zod2gql handles nested schemas, arrays, and circular references:

```tsx
const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  zipCode: z.string()
});

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: addressSchema,
  friends: z.array(z.lazy(() => userSchema))
});

const query = createQuery(userSchema, {
  operationName: 'GetUser',
  variables: { id: '123' }
});
```

## Controlling Recursion Depth

You can control the depth of the generated query to limit nesting:

```tsx
const query = createQuery(complexSchema, {
  operationName: 'GetComplex',
  variables: { id: '123' },
  maxDepth: 3 // Limit recursion depth
});
```

## Input Type Mapping for Mutations

For mutations with complex input types, you can provide type mappings:

```tsx
const mutation = createMutation(userSchema, {
  operationName: 'CreateUser',
  variables: {
    userData: { name: 'John', email: 'john@example.com' }
  },
  inputTypeMap: {
    userData: 'UserInput' // Map 'userData' to 'UserInput!' in GraphQL
  }
});
```

## API Reference

### Core Types

```tsx
enum GQLType {
  Query = 'query',
  Mutation = 'mutation',
  Subscription = 'subscription'
}

interface ToGQLOptions {
  operationName?: string;
  variables?: Record<string, any>;
  maxDepth?: number;
  inputTypeMap?: Record<string, string>;
}
```

### Methods

```tsx
// Extension method added to ZodObject
toGQL(
  queryType?: GQLType,
  options?: ToGQLOptions,
  depth?: number
): string;

// Helper functions
createQuery(schema: z.ZodObject<any>, options?: ToGQLOptions): string;
createMutation(schema: z.ZodObject<any>, options?: ToGQLOptions): string;
createSubscription(schema: z.ZodObject<any>, options?: ToGQLOptions): string;
```

## License

MIT © [Your Name]