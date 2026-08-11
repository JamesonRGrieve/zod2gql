// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { createSubscription, processSubscription } from './subscription';
import './index';

describe('processSubscription', () => {
  it('produces a bare subscription', () => {
    const schema = z.object({ id: z.string() }).describe('User');
    const out = processSubscription(schema);
    expect(out).toContain('subscription ');
    expect(out).toContain('user');
    expect(out).toContain('id');
  });

  it('honors operationName and strips the Subscribe prefix', () => {
    const schema = z.object({ id: z.string() });
    const out = processSubscription(schema, { operationName: 'SubscribeUser' });
    expect(out).toContain('subscription SubscribeUser');
    expect(out).toContain('user');
  });

  it('declares variables with inferred GraphQL types', () => {
    const schema = z.object({ id: z.string() });
    const out = processSubscription(schema, {
      operationName: 'SubscribeUser',
      variables: { id: 'x', count: 3 },
    });
    expect(out).toContain('$id: String!');
    expect(out).toContain('$count: Int!');
  });

  it('threads variables into the field argument list', () => {
    const schema = z.object({ id: z.string() });
    const out = processSubscription(schema, {
      operationName: 'SubscribeUser',
      variables: { id: 'x' },
    });
    expect(out).toContain('user(id: $id)');
  });

  it('uses inputTypeMap to override inferred input type', () => {
    const schema = z.object({ id: z.string() });
    const out = processSubscription(schema, {
      operationName: 'SubscribeUser',
      variables: { filter: { id: 'x' } },
      inputTypeMap: { filter: 'UserFilter' },
    });
    expect(out).toContain('$filter: UserFilter!');
  });
});

describe('createSubscription', () => {
  it('delegates to schema.toGQL with subscription queryType', () => {
    const schema = z.object({ id: z.string() }).describe('Event');
    const direct = processSubscription(schema, { operationName: 'SubscribeEvent' });
    const helper = createSubscription(schema, { operationName: 'SubscribeEvent' });
    expect(helper).toBe(direct);
  });
});
