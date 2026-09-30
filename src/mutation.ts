// SPDX-License-Identifier: AGPL-3.0-or-later
import { type AnyObjectSchema, GQLType, type ToGQLOptions, renderOperation } from './core';

// Process mutation operations
export function processMutation(schema: AnyObjectSchema, options: ToGQLOptions = {}): string {
  return renderOperation(GQLType.Mutation, schema, schema, options);
}

// Helper function to directly generate a mutation from a Zod schema
export function createMutation(schema: AnyObjectSchema, options: ToGQLOptions = {}): string {
  return processMutation(schema, options);
}
