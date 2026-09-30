// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  GQLSchemaError,
  GQLType,
  formatFieldArguments,
  formatVariablesDeclaration,
  getOperationFieldName,
  pluralize,
  processArrayMutation,
  processArrayQuery,
  processArraySubscription,
  processFields,
  toGQL,
} from './index';

describe('pluralize', () => {
  it('returns empty for empty', () => {
    expect(pluralize('')).toBe('');
  });

  it.each([
    ['user', 'users'],
    ['city', 'cities'],
    ['party', 'parties'],
    ['box', 'boxes'],
    ['watch', 'watches'],
    ['fish', 'fishes'],
    ['glass', 'glasses'],
  ])('pluralizes %s -> %s', (input, expected) => {
    expect(pluralize(input)).toBe(expected);
  });
});

describe('getOperationFieldName', () => {
  it('strips operation prefixes and lowercases first', () => {
    const schema = z.object({ id: z.string() });
    expect(getOperationFieldName(schema, 'GetUser')).toBe('user');
    expect(getOperationFieldName(schema, 'CreateUser')).toBe('user');
    expect(getOperationFieldName(schema, 'UpdateUser')).toBe('user');
    expect(getOperationFieldName(schema, 'DeleteUser')).toBe('user');
    expect(getOperationFieldName(schema, 'SubscribeUser')).toBe('user');
  });

  it('falls back to schema description', () => {
    const schema = z.object({ id: z.string() }).describe('User');
    expect(getOperationFieldName(schema)).toBe('user');
  });

  it('returns empty when schema has no description and unknown typeName', () => {
    const schema = z.object({ id: z.string() });
    expect(getOperationFieldName(schema)).toBe('');
  });

  it('pluralizes for ZodArray of ZodObject', () => {
    const schema = z.array(z.object({ id: z.string() }).describe('User'));
    expect(getOperationFieldName(schema)).toBe('users');
  });

  it('returns empty for ZodArray of non-object', () => {
    const schema = z.array(z.string());
    expect(getOperationFieldName(schema)).toBe('');
  });
});

describe('formatVariablesDeclaration', () => {
  it('returns empty when no variables', () => {
    expect(formatVariablesDeclaration()).toBe('');
    expect(formatVariablesDeclaration({})).toBe('');
  });

  it('uses inputTypeMap when present', () => {
    expect(formatVariablesDeclaration({ id: 'x' }, { id: 'ID' })).toBe('($id: ID!)');
  });

  it('infers Int / Float / Boolean / String', () => {
    expect(formatVariablesDeclaration({ a: 1 })).toBe('($a: Int!)');
    expect(formatVariablesDeclaration({ a: 1.5 })).toBe('($a: Float!)');
    expect(formatVariablesDeclaration({ a: true })).toBe('($a: Boolean!)');
    expect(formatVariablesDeclaration({ a: 'x' })).toBe('($a: String!)');
    expect(formatVariablesDeclaration({ a: null })).toBe('($a: String!)');
  });

  it('infers FieldInput for objects, capitalising the key', () => {
    expect(formatVariablesDeclaration({ user: { id: 1 } })).toBe('($user: UserInput!)');
  });

  it('infers list type from first element', () => {
    expect(formatVariablesDeclaration({ ids: [1, 2] })).toBe('($ids: [Int]!)');
    expect(formatVariablesDeclaration({ ids: [] })).toBe('($ids: [String]!)');
  });
});

describe('formatFieldArguments', () => {
  it('returns empty when no variables', () => {
    expect(formatFieldArguments()).toBe('');
    expect(formatFieldArguments({})).toBe('');
  });

  it('renders $-prefixed args', () => {
    expect(formatFieldArguments({ id: '1', name: 'x' })).toBe('(id: $id, name: $name)');
  });
});

describe('processFields', () => {
  it('emits scalar fields one per line', () => {
    const schema = z.object({ id: z.string(), name: z.string() });
    const out = processFields(schema, GQLType.Query);
    expect(out).toBe('id\nname\n');
  });

  it('recursively expands nested ZodObject', () => {
    const schema = z.object({
      id: z.string(),
      profile: z.object({ name: z.string() }),
    });
    const out = processFields(schema, GQLType.Query);
    expect(out).toBe('id\nprofile {\n  name\n}\n');
  });

  it('unwraps ZodOptional and ZodNullable', () => {
    const schema = z.object({
      a: z.optional(z.string()),
      b: z.nullable(z.object({ x: z.string() })),
    });
    const out = processFields(schema, GQLType.Query);
    expect(out).toBe('a\nb {\n  x\n}\n');
  });

  it('expands array-of-object element fields', () => {
    const schema = z.object({
      tags: z.array(z.object({ name: z.string() })),
    });
    const out = processFields(schema, GQLType.Query);
    expect(out).toBe('tags {\n  name\n}\n');
  });

  it('emits scalar field name for array-of-scalar', () => {
    const schema = z.object({ ids: z.array(z.string()) });
    const out = processFields(schema, GQLType.Query);
    expect(out).toBe('ids\n');
  });

  it('renders nesting up to maxDepth', () => {
    const schema = z.object({ a: z.object({ b: z.object({ x: z.string() }) }) });
    expect(processFields(schema, GQLType.Query, { maxDepth: 2 })).toBe('a {\n  b {\n    x\n  }\n}\n');
  });

  it('throws at the first object past maxDepth rather than dropping its fields', () => {
    const inner = z.object({ x: z.string() });
    const schema = z.object({ a: z.object({ b: z.object({ c: inner }) }) });
    expect(() => processFields(schema, GQLType.Query, { maxDepth: 1 })).toThrow(
      'zod2gql: a.b: selection nests deeper than maxDepth (1); raise maxDepth or select fewer levels',
    );
  });
});

describe('toGQL routing', () => {
  it('routes ZodObject query by default', () => {
    const schema = z.object({ id: z.string() }).describe('User');
    const q = toGQL(schema);
    expect(q).toMatch(/^query {\n {2}user {\n {4}id\n {2}}\n}$/);
  });

  it('routes ZodArray to the pluralised array operation', () => {
    const schema = z.array(z.object({ id: z.string() }).describe('User'));
    expect(toGQL(schema, GQLType.Query)).toBe(processArrayQuery(schema));
    expect(toGQL(schema, GQLType.Mutation)).toBe(processArrayMutation(schema));
    expect(toGQL(schema, GQLType.Subscription)).toBe(processArraySubscription(schema));
  });

  it('rejects an array whose element is not an object', () => {
    expect(() => toGQL(z.array(z.string()))).toThrow('Array element must be a ZodObject for toGQL');
  });

  it('leaves zod untouched (no prototype patching)', () => {
    expect('toGQL' in z.object({})).toBe(false);
    expect('toGQL' in z.array(z.object({}))).toBe(false);
  });

  it('selects sub-fields through nullable().optional() wrappers', () => {
    const schema = z.object({ team: z.object({ id: z.string() }).nullable().optional() }).describe('User');
    expect(toGQL(schema)).toContain('team {\n      id\n    }');
  });

  it('routes ZodObject mutation with variables and inputTypeMap', () => {
    const schema = z.object({ id: z.string() }).describe('User');
    const q = toGQL(schema, GQLType.Mutation, {
      operationName: 'CreateUser',
      variables: { input: { name: 'a' } },
      inputTypeMap: { input: 'CreateUserInput' },
    });
    expect(q).toContain('mutation CreateUser($input: CreateUserInput!)');
    expect(q).toContain('user(input: $input)');
  });

  it('routes ZodObject subscription', () => {
    const schema = z.object({ id: z.string() }).describe('Notification');
    const q = toGQL(schema, GQLType.Subscription);
    expect(q).toContain('subscription');
    expect(q).toContain('notification');
  });
});

describe('toGQL name validation', () => {
  it('selects fields named after GraphQL keywords, which are legal field names', () => {
    const schema = z
      .object({ query: z.string(), type: z.string(), on: z.string(), fragment: z.object({ enum: z.string() }) })
      .describe('Thing');
    expect(toGQL(schema)).toBe('query {\n  thing {\n    query\n    type\n    on\n    fragment {\n      enum\n    }\n  }\n}');
  });

  it('rejects a hyphenated field and names its path', () => {
    const schema = z.object({ team: z.object({ 'display-name': z.string() }) }).describe('User');
    expect(() => toGQL(schema)).toThrow(GQLSchemaError);
    expect(() => toGQL(schema)).toThrow('zod2gql: user.team.display-name: field "display-name" is not a valid GraphQL name');
  });

  it.each(['first name', '1st', 'naïve'])('rejects the field name %j', (name) => {
    const schema = z.object({ [name]: z.string() }).describe('User');
    expect(() => toGQL(schema)).toThrow(`field ${JSON.stringify(name)} is not a valid GraphQL name`);
  });

  it('rejects an invalid operationName', () => {
    const schema = z.object({ id: z.string() }).describe('User');
    expect(() => toGQL(schema, GQLType.Query, { operationName: 'Get-User' })).toThrow(
      'operationName "Get-User" is not a valid GraphQL name',
    );
  });

  it('rejects a description that is not a usable field name', () => {
    const schema = z.object({ id: z.string() }).describe('User profile');
    expect(() => toGQL(schema)).toThrow('operation field "user profile" is not a valid GraphQL name');
  });

  it('rejects a schema whose root field cannot be named', () => {
    expect(() => toGQL(z.object({ id: z.string() }))).toThrow("cannot derive the operation's root field name");
  });

  it('rejects an invalid variable name', () => {
    const schema = z.object({ id: z.string() }).describe('User');
    expect(() => toGQL(schema, GQLType.Query, { variables: { 'user-id': '1' } })).toThrow(
      'variable "user-id" is not a valid GraphQL name',
    );
  });
});

describe('toGQL invalid schemas', () => {
  it('rejects an empty object schema instead of rendering an empty selection', () => {
    expect(() => toGQL(z.object({}).describe('User'))).toThrow(
      'zod2gql: user: object has no fields, and a GraphQL selection set cannot be empty',
    );
    expect(() => toGQL(z.array(z.object({}).describe('User')))).toThrow('zod2gql: users: object has no fields');
  });

  it('rejects a recursive schema with a path from the root field', () => {
    const CommentSchema = z
      .object({
        body: z.string(),
        get replies() {
          return z.array(CommentSchema);
        },
      })
      .describe('Comment');
    expect(() => toGQL(CommentSchema, GQLType.Subscription)).toThrow(
      'zod2gql: comment.replies: circular reference: this object schema is already selected at comment',
    );
  });

  it('rejects an unsupported field type with a path from the root field', () => {
    expect(() => toGQL(z.object({ id: z.string(), callback: z.symbol() }).describe('User'), GQLType.Mutation)).toThrow(
      'zod2gql: user.callback: zod type "symbol" has no GraphQL representation',
    );
  });

  it('counts maxDepth from the root field, not from the indentation', () => {
    const schema = z.object({ team: z.object({ id: z.string() }) }).describe('User');
    expect(toGQL(schema, GQLType.Query, { maxDepth: 1 })).toBe('query {\n  user {\n    team {\n      id\n    }\n  }\n}');
    expect(() => toGQL(schema, GQLType.Query, { maxDepth: 0 })).toThrow('zod2gql: user.team: selection nests deeper');
  });
});

describe('processArray*', () => {
  it('renders array query with pluralised field name', () => {
    const schema = z.array(z.object({ id: z.string() }).describe('User'));
    expect(processArrayQuery(schema)).toContain('query');
    expect(processArrayQuery(schema)).toContain('users');
  });

  it('renders array mutation', () => {
    const schema = z.array(z.object({ id: z.string() }).describe('User'));
    expect(processArrayMutation(schema)).toContain('mutation');
  });

  it('renders array subscription', () => {
    const schema = z.array(z.object({ id: z.string() }).describe('User'));
    expect(processArraySubscription(schema)).toContain('subscription');
  });

  it('throws when array element is not a ZodObject', () => {
    const schema = z.array(z.string());
    expect(() => processArrayQuery(schema)).toThrow('Array element must be a ZodObject');
  });
});
