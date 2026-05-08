import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  formatFieldArguments,
  formatVariablesDeclaration,
  getOperationFieldName,
  GQLType,
  pluralize,
  processFields,
} from './index';
import './index';

describe('pluralize', () => {
  it('returns empty string for empty input', () => {
    expect(pluralize('')).toBe('');
  });

  it('replaces trailing y with ies', () => {
    expect(pluralize('category')).toBe('categories');
    expect(pluralize('story')).toBe('stories');
  });

  it('appends es for sibilant endings', () => {
    expect(pluralize('bus')).toBe('buses');
    expect(pluralize('box')).toBe('boxes');
    expect(pluralize('match')).toBe('matches');
    expect(pluralize('dish')).toBe('dishes');
  });

  it('appends s for default case', () => {
    expect(pluralize('user')).toBe('users');
    expect(pluralize('post')).toBe('posts');
  });
});

describe('getOperationFieldName', () => {
  it('lowercases the first letter of an explicit operationName', () => {
    const schema = z.object({ id: z.string() });
    expect(getOperationFieldName(schema, 'User')).toBe('user');
  });

  it('strips standard prefixes from operationName', () => {
    const schema = z.object({ id: z.string() });
    expect(getOperationFieldName(schema, 'GetUser')).toBe('user');
    expect(getOperationFieldName(schema, 'CreateUser')).toBe('user');
    expect(getOperationFieldName(schema, 'UpdateUser')).toBe('user');
    expect(getOperationFieldName(schema, 'DeleteUser')).toBe('user');
    expect(getOperationFieldName(schema, 'SubscribeUser')).toBe('user');
  });

  it('uses the description when no operationName is supplied', () => {
    const schema = z.object({ id: z.string() }).describe('Account');
    expect(getOperationFieldName(schema)).toBe('account');
  });

  it('pluralizes when the schema is an array', () => {
    const inner = z.object({ id: z.string() }).describe('User');
    const schema = z.array(inner);
    expect(getOperationFieldName(schema)).toBe('users');
  });
});

describe('formatVariablesDeclaration', () => {
  it('returns empty string when no variables', () => {
    expect(formatVariablesDeclaration()).toBe('');
    expect(formatVariablesDeclaration({})).toBe('');
  });

  it('infers GraphQL types from JS values', () => {
    const out = formatVariablesDeclaration({ id: 'abc', count: 3, ratio: 1.5, active: true });
    expect(out).toContain('$id: String!');
    expect(out).toContain('$count: Int!');
    expect(out).toContain('$ratio: Float!');
    expect(out).toContain('$active: Boolean!');
  });

  it('honors inputTypeMap overrides', () => {
    const out = formatVariablesDeclaration({ where: { id: 'x' } }, { where: 'WhereInput' });
    expect(out).toBe('($where: WhereInput!)');
  });
});

describe('formatFieldArguments', () => {
  it('returns empty string when no variables', () => {
    expect(formatFieldArguments()).toBe('');
    expect(formatFieldArguments({})).toBe('');
  });

  it('binds each variable to a $-prefixed identifier', () => {
    expect(formatFieldArguments({ id: 'x', name: 'y' })).toBe('(id: $id, name: $name)');
  });
});

describe('processFields', () => {
  it('emits indented field names for a flat object', () => {
    const schema = z.object({ id: z.string(), name: z.string() });
    const out = processFields(schema, GQLType.Query, {}, 1);
    expect(out).toContain('  id\n');
    expect(out).toContain('  name\n');
  });

  it('recurses into nested ZodObject and ZodArray', () => {
    const schema = z.object({
      id: z.string(),
      profile: z.object({ bio: z.string() }),
      posts: z.array(z.object({ title: z.string() })),
    });
    const out = processFields(schema, GQLType.Query, {}, 1);
    expect(out).toContain('profile {');
    expect(out).toContain('posts {');
    expect(out).toContain('bio');
    expect(out).toContain('title');
  });

  it('respects maxDepth', () => {
    const schema = z.object({ id: z.string() });
    expect(processFields(schema, GQLType.Query, { maxDepth: 0 }, 5)).toBe('');
  });
});

describe('toGQL augmentation', () => {
  it('emits a query for a ZodObject', () => {
    const schema = z.object({ id: z.string(), name: z.string() }).describe('User');
    const out = schema.toGQL(GQLType.Query, { operationName: 'GetUser' });
    expect(out).toContain('query GetUser');
    expect(out).toContain('user');
    expect(out).toContain('id');
    expect(out).toContain('name');
  });

  it('emits a pluralized array query for a ZodArray', () => {
    const inner = z.object({ id: z.string(), title: z.string() }).describe('Post');
    const schema = z.array(inner);
    const out = schema.toGQL(GQLType.Query);
    expect(out).toContain('query');
    expect(out).toContain('posts');
    expect(out).toContain('title');
  });

  it('emits a mutation when GQLType.Mutation is requested', () => {
    const schema = z.object({ id: z.string() }).describe('User');
    const out = schema.toGQL(GQLType.Mutation, { operationName: 'CreateUser', variables: { input: { name: 'a' } } });
    expect(out).toContain('mutation CreateUser');
    expect(out).toContain('$input: InputInput!');
  });

  it('emits a subscription when GQLType.Subscription is requested', () => {
    const schema = z.object({ id: z.string() }).describe('Event');
    const out = schema.toGQL(GQLType.Subscription, { operationName: 'SubscribeEvent' });
    expect(out).toContain('subscription SubscribeEvent');
    expect(out).toContain('event');
  });

  it('throws when an array element is not a ZodObject', () => {
    const schema = z.array(z.string());
    expect(() => schema.toGQL(GQLType.Query)).toThrow(/ZodObject/);
  });
});
