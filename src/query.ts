// SPDX-License-Identifier: AGPL-3.0-or-later
import { type AnyObjectSchema, GQLType, type ToGQLOptions, renderOperation } from './core';

// Process query operations
export function processQuery(schema: AnyObjectSchema, options: ToGQLOptions = {}): string {
  return renderOperation(GQLType.Query, schema, schema, options);
}

// Helper function to directly generate a query from a Zod schema
export function createQuery(schema: AnyObjectSchema, options: ToGQLOptions = {}): string {
  return processQuery(schema, options);
}
