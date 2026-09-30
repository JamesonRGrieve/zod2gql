// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { createMutation, processMutation } from './mutation';

describe('processMutation', () => {
  it('produces a bare mutation with no name / no variables', () => {
    const schema = z.object({ id: z.string() }).describe('User');
    const out = processMutation(schema);
    expect(out).toContain('mutation ');
    expect(out).toContain('user');
    expect(out).toContain('id');
  });

  it('includes the operationName when provided', () => {
    const schema = z.object({ id: z.string() });
    const out = processMutation(schema, { operationName: 'CreateUser' });
    expect(out).toContain('mutation CreateUser');
    expect(out).toContain('user');
  });

  it('infers GraphQL variable types from JS primitives', () => {
    const schema = z.object({ id: z.string() });
    const out = processMutation(schema, {
      operationName: 'CreateUser',
      variables: { name: 'x', age: 5, active: true },
    });
    expect(out).toContain('$name: String!');
    expect(out).toContain('$age: Int!');
    expect(out).toContain('$active: Boolean!');
  });

  it('declares non-integral numbers as Float, like queries do', () => {
    const schema = z.object({ id: z.string() });
    const out = processMutation(schema, { operationName: 'RateUser', variables: { score: 4.5 } });
    expect(out).toContain('mutation RateUser($score: Float!)');
  });

  it('declares array variables as list types, like queries do', () => {
    const schema = z.object({ id: z.string() });
    const out = processMutation(schema, {
      operationName: 'TagUser',
      variables: { tags: ['a'], weights: [0.5], items: [{ id: 'x' }] },
    });
    expect(out).toContain('($tags: [String]!, $weights: [Float]!, $items: [ItemsInput]!)');
  });

  it('renders the same document shape as a query apart from the operation keyword', () => {
    const schema = z.object({ id: z.string(), team: z.object({ name: z.string() }) }).describe('User');
    const options = { variables: { id: '1', score: 2.5 } };
    expect(processMutation(schema, options)).toBe(
      'mutation($id: String!, $score: Float!) {\n  user(id: $id, score: $score) {\n    id\n    team {\n      name\n    }\n  }\n}',
    );
  });

  it('treats nested object variables as <Key>Input', () => {
    const schema = z.object({ id: z.string() });
    const out = processMutation(schema, {
      operationName: 'CreateUser',
      variables: { user: { name: 'x' } },
    });
    expect(out).toContain('$user: UserInput!');
  });

  it('honors inputTypeMap to override inferred input type', () => {
    const schema = z.object({ id: z.string() });
    const out = processMutation(schema, {
      operationName: 'CreateUser',
      variables: { input: { name: 'x' } },
      inputTypeMap: { input: 'CreateUserInput' },
    });
    expect(out).toContain('$input: CreateUserInput!');
  });

  it('emits field arguments referencing the declared variables', () => {
    const schema = z.object({ id: z.string() });
    const out = processMutation(schema, {
      operationName: 'CreateUser',
      variables: { name: 'x' },
    });
    expect(out).toContain('user(name: $name)');
  });
});

describe('createMutation', () => {
  it('renders exactly what processMutation renders', () => {
    const schema = z.object({ id: z.string() }).describe('Post');
    const direct = processMutation(schema, { operationName: 'CreatePost' });
    const helper = createMutation(schema, { operationName: 'CreatePost' });
    expect(helper).toBe(direct);
  });
});
