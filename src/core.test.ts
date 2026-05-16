import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  GQLType,
  formatFieldArguments,
  formatVariablesDeclaration,
  getOperationFieldName,
  isZodObject,
  pluralize,
  processArrayMutation,
  processArrayQuery,
  processArraySubscription,
  processFields,
} from './core';

describe('core: pluralize', () => {
  it('returns empty for empty', () => {
    expect(pluralize('')).toBe('');
  });

  it.each([
    ['cat', 'cats'],
    ['city', 'cities'],
    ['bus', 'buses'],
    ['dish', 'dishes'],
  ])('pluralizes %s -> %s', (input, expected) => {
    expect(pluralize(input)).toBe(expected);
  });
});

describe('core: isZodObject', () => {
  it('returns true for ZodObject', () => {
    expect(isZodObject(z.object({ a: z.string() }))).toBe(true);
  });

  it('returns false for non-object Zod types', () => {
    expect(isZodObject(z.string())).toBe(false);
    expect(isZodObject(z.array(z.string()))).toBe(false);
  });
});

describe('core: getOperationFieldName', () => {
  it('derives from operationName by stripping CRUD prefix', () => {
    const schema = z.object({ id: z.string() });
    expect(getOperationFieldName(schema, 'GetUser')).toBe('user');
    expect(getOperationFieldName(schema, 'CreatePost')).toBe('post');
    expect(getOperationFieldName(schema, 'DeleteThing')).toBe('thing');
  });

  it('pluralizes for array schemas', () => {
    const schema = z.array(z.object({ id: z.string() }).describe('User'));
    expect(getOperationFieldName(schema)).toBe('users');
  });

  it('returns empty when no name discoverable', () => {
    expect(getOperationFieldName(z.string())).toBe('');
  });
});

describe('core: formatVariablesDeclaration', () => {
  it('returns empty when no variables', () => {
    expect(formatVariablesDeclaration()).toBe('');
    expect(formatVariablesDeclaration({})).toBe('');
  });

  it('formats numeric int as Int', () => {
    expect(formatVariablesDeclaration({ age: 30 })).toBe('($age: Int!)');
  });

  it('formats float as Float', () => {
    expect(formatVariablesDeclaration({ ratio: 1.5 })).toBe('($ratio: Float!)');
  });

  it('formats boolean as Boolean', () => {
    expect(formatVariablesDeclaration({ active: true })).toBe('($active: Boolean!)');
  });

  it('formats nested object as <Key>Input', () => {
    expect(formatVariablesDeclaration({ user: { id: '1' } })).toBe('($user: UserInput!)');
  });

  it('uses explicit inputTypeMap when provided', () => {
    expect(formatVariablesDeclaration({ id: 'x' }, { id: 'UUID' })).toBe('($id: UUID!)');
  });

  it('handles array of objects with element type', () => {
    expect(formatVariablesDeclaration({ tags: [{ id: 'x' }] })).toBe('($tags: [TagsInput]!)');
  });
});

describe('core: formatFieldArguments', () => {
  it('returns empty when no variables', () => {
    expect(formatFieldArguments()).toBe('');
    expect(formatFieldArguments({})).toBe('');
  });

  it('maps each var to "$key: $key"', () => {
    expect(formatFieldArguments({ id: '1', name: 'a' })).toBe('(id: $id, name: $name)');
  });
});

describe('core: processFields', () => {
  it('emits scalar field on its own line', () => {
    const schema = z.object({ id: z.string() });
    expect(processFields(schema, GQLType.Query)).toBe('id\n');
  });

  it('nests object fields', () => {
    const schema = z.object({ user: z.object({ id: z.string() }) });
    expect(processFields(schema, GQLType.Query)).toBe('user {\n  id\n}\n');
  });

  it('respects maxDepth=0 by returning empty for any depth', () => {
    const schema = z.object({ id: z.string() });
    expect(processFields(schema, GQLType.Query, { maxDepth: 0 }, 1)).toBe('');
  });
});

describe('core: processArray* operations', () => {
  const schema = z.array(z.object({ id: z.string() }).describe('User'));

  it('processArrayQuery wraps in query', () => {
    expect(processArrayQuery(schema)).toContain('query');
    expect(processArrayQuery(schema)).toContain('users');
  });

  it('processArrayMutation wraps in mutation', () => {
    expect(processArrayMutation(schema)).toContain('mutation');
  });

  it('processArraySubscription wraps in subscription', () => {
    expect(processArraySubscription(schema)).toContain('subscription');
  });

  it('throws when element is not a ZodObject', () => {
    const bad = z.array(z.string());
    expect(() => processArrayQuery(bad)).toThrow('Array element must be a ZodObject');
  });
});
