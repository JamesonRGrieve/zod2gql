// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import { GQLSchemaError, assertGraphQLName } from './errors';

describe('GQLSchemaError', () => {
  it('prefixes the message with the field path and keeps the path', () => {
    const error = new GQLSchemaError(['user', 'team'], 'bad');
    expect(error.message).toBe('zod2gql: user.team: bad');
    expect(error.path).toEqual(['user', 'team']);
    expect(error.name).toBe('GQLSchemaError');
    expect(error).toBeInstanceOf(Error);
  });

  it('omits the path for operation-level problems', () => {
    expect(new GQLSchemaError([], 'bad').message).toBe('zod2gql: bad');
  });
});

describe('assertGraphQLName', () => {
  it.each(['id', '_private', 'camelCase', 'snake_case', 'a1', '__typename', 'A'])('accepts %s', (name) => {
    expect(() => assertGraphQLName(name, 'field', [name])).not.toThrow();
  });

  // GraphQL has no reserved words; keywords are ordinary names in field position.
  it.each(['query', 'mutation', 'subscription', 'type', 'interface', 'enum', 'scalar', 'fragment', 'on', 'null', 'true'])(
    'accepts the keyword %s',
    (name) => {
      expect(() => assertGraphQLName(name, 'field', [name])).not.toThrow();
    },
  );

  it.each(['first-name', 'first name', '1st', '9', '', 'naïve', 'a.b', '$id', 'emoji🙂'])('rejects %j', (name) => {
    expect(() => assertGraphQLName(name, 'field', ['user', name])).toThrow(GQLSchemaError);
  });

  it('names the role, the offending name and the path', () => {
    expect(() => assertGraphQLName('first-name', 'field', ['user', 'first-name'])).toThrow(
      'zod2gql: user.first-name: field "first-name" is not a valid GraphQL name (names must match ^[_A-Za-z][_0-9A-Za-z]*$)',
    );
  });
});
