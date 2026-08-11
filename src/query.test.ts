// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { createQuery, processQuery } from './query';
import './index';

describe('processQuery', () => {
  it('produces a bare query', () => {
    const schema = z.object({ id: z.string() }).describe('User');
    const out = processQuery(schema);
    expect(out).toContain('query ');
    expect(out).toContain('user');
    expect(out).toContain('id');
  });

  it('honors operationName and strips CRUD prefix for the field name', () => {
    const schema = z.object({ id: z.string() });
    const out = processQuery(schema, { operationName: 'GetThing' });
    expect(out).toContain('query GetThing');
    expect(out).toContain('thing');
  });

  it('declares variables with inferred GraphQL types', () => {
    const schema = z.object({ id: z.string() });
    const out = processQuery(schema, {
      operationName: 'GetUser',
      variables: { id: 'x', age: 30, ratio: 1.5 },
    });
    expect(out).toContain('$id: String!');
    expect(out).toContain('$age: Int!');
    expect(out).toContain('$ratio: Float!');
  });

  it('threads variables into the field argument list', () => {
    const schema = z.object({ id: z.string() });
    const out = processQuery(schema, {
      operationName: 'GetUser',
      variables: { id: 'x' },
    });
    expect(out).toContain('user(id: $id)');
  });

  it('uses inputTypeMap when provided', () => {
    const schema = z.object({ id: z.string() });
    const out = processQuery(schema, {
      operationName: 'GetUser',
      variables: { filter: { name: 'a' } },
      inputTypeMap: { filter: 'UserFilter' },
    });
    expect(out).toContain('$filter: UserFilter!');
  });
});

describe('createQuery', () => {
  it('delegates to schema.toGQL with query queryType', () => {
    const schema = z.object({ id: z.string() }).describe('User');
    const direct = processQuery(schema, { operationName: 'GetUser' });
    const helper = createQuery(schema, { operationName: 'GetUser' });
    expect(helper).toBe(direct);
  });
});
