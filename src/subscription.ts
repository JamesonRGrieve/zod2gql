// SPDX-License-Identifier: AGPL-3.0-or-later
import { type AnyObjectSchema, GQLType, type ToGQLOptions, renderOperation } from './core';

// Process subscription operations
export function processSubscription(schema: AnyObjectSchema, options: ToGQLOptions = {}): string {
  return renderOperation(GQLType.Subscription, schema, schema, options);
}

// Helper function to directly generate a subscription from a Zod schema
export function createSubscription(schema: AnyObjectSchema, options: ToGQLOptions = {}): string {
  return processSubscription(schema, options);
}
