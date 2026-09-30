// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * GraphQL `Name` (spec, section 2.1.9 "Names"). GraphQL has no reserved words:
 * `query`, `type`, `on`, `fragment` and the other keywords are ordinary names
 * wherever a field name is expected, so only the character rule is enforced.
 */
const GRAPHQL_NAME = /^[_A-Za-z][_0-9A-Za-z]*$/;

/** Raised when a schema or option cannot be rendered as a valid GraphQL document. */
export class GQLSchemaError extends Error {
  /** Field path (from the operation's root field) at which rendering failed; empty for operation-level problems. */
  readonly path: readonly string[];

  constructor(path: readonly string[], reason: string) {
    super(path.length > 0 ? `zod2gql: ${path.join('.')}: ${reason}` : `zod2gql: ${reason}`);
    this.name = 'GQLSchemaError';
    this.path = path;
  }
}

/** Throw unless `name` is a legal GraphQL name; `role` says what it names (field, variable, ...). */
export const assertGraphQLName = (name: string, role: string, path: readonly string[]): void => {
  if (!GRAPHQL_NAME.test(name)) {
    throw new GQLSchemaError(
      path,
      `${role} ${JSON.stringify(name)} is not a valid GraphQL name (names must match ${GRAPHQL_NAME.source})`,
    );
  }
};
