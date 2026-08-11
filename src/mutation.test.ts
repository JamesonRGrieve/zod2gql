// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { createMutation, processMutation } from './mutation';
// Side-effect import: registers ZodObject.prototype.toGQL used by createMutation.
import './index';

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
    // Mutation's inferMutationType collapses all numbers to Int (it does not
    // try to distinguish Int from Float the way the query variable formatter
    // does — that asymmetry is intentional / pre-existing behavior).
    expect(out).toContain('$age: Int!');
    expect(out).toContain('$active: Boolean!');
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
  it('delegates to schema.toGQL with mutation queryType', () => {
    const schema = z.object({ id: z.string() }).describe('Post');
    const direct = processMutation(schema, { operationName: 'CreatePost' });
    const helper = createMutation(schema, { operationName: 'CreatePost' });
    expect(helper).toBe(direct);
  });
});
