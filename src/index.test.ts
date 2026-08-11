// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  GQLType,
  formatFieldArguments,
  formatVariablesDeclaration,
  getOperationFieldName,
  pluralize,
  processArrayMutation,
  processArrayQuery,
  processArraySubscription,
  processFields,
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

  it('respects maxDepth', () => {
    const inner = z.object({ x: z.string() });
    const schema = z.object({ a: z.object({ b: z.object({ c: inner }) }) });
    const out = processFields(schema, GQLType.Query, { maxDepth: 1 });
    expect(out).toContain('a {');
    expect(out).not.toContain('c {');
  });
});

describe('schema.toGQL routing', () => {
  it('routes ZodObject query', () => {
    const schema = z.object({ id: z.string() }).describe('User');
    const q = schema.toGQL(GQLType.Query);
    expect(q).toMatch(/^query {\n {2}user {\n {4}id\n {2}}\n}$/);
  });

  it('routes ZodObject mutation with variables and inputTypeMap', () => {
    const schema = z.object({ id: z.string() }).describe('User');
    const q = schema.toGQL(GQLType.Mutation, {
      operationName: 'CreateUser',
      variables: { input: { name: 'a' } },
      inputTypeMap: { input: 'CreateUserInput' },
    });
    expect(q).toContain('mutation CreateUser($input: CreateUserInput!)');
    expect(q).toContain('user(input: $input)');
  });

  it('routes ZodObject subscription', () => {
    const schema = z.object({ id: z.string() }).describe('Notification');
    const q = schema.toGQL(GQLType.Subscription);
    expect(q).toContain('subscription');
    expect(q).toContain('notification');
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
