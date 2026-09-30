// SPDX-License-Identifier: AGPL-3.0-or-later
import type { z } from 'zod';
import {
  type AnyObjectSchema,
  type AnySchema,
  GQLType,
  type GraphQLVariableValue,
  type ToGQLOptions,
  formatFieldArguments,
  formatVariablesDeclaration,
  getOperationFieldName,
  isZodObject,
  pluralize,
  processArrayMutation,
  processArrayQuery,
  processArraySubscription,
  processFields,
} from './core';
import { GQLSchemaError } from './errors';
import { createMutation, processMutation } from './mutation';
import { createQuery, processQuery } from './query';
import { createSubscription, processSubscription } from './subscription';

export {
  type AnyObjectSchema,
  type AnySchema,
  GQLSchemaError,
  GQLType,
  type GraphQLVariableValue,
  type ToGQLOptions,
  createMutation,
  createQuery,
  createSubscription,
  formatFieldArguments,
  formatVariablesDeclaration,
  getOperationFieldName,
  pluralize,
  processArrayMutation,
  processArrayQuery,
  processArraySubscription,
  processFields,
  processMutation,
  processQuery,
  processSubscription,
};

const OBJECT_ROUTES: Record<GQLType, (schema: AnyObjectSchema, options: ToGQLOptions) => string> = {
  [GQLType.Query]: processQuery,
  [GQLType.Mutation]: processMutation,
  [GQLType.Subscription]: processSubscription,
};

const ARRAY_ROUTES: Record<GQLType, (schema: z.ZodArray, options: ToGQLOptions) => string> = {
  [GQLType.Query]: processArrayQuery,
  [GQLType.Mutation]: processArrayMutation,
  [GQLType.Subscription]: processArraySubscription,
};

/**
 * Render a GraphQL operation from a zod object schema, or from an array of one
 * (which selects the pluralised field). Pure: zod itself is never modified.
 */
export function toGQL(
  schema: AnyObjectSchema | z.ZodArray,
  queryType: GQLType = GQLType.Query,
  options: ToGQLOptions = {},
): string {
  if (isZodObject(schema)) {
    return OBJECT_ROUTES[queryType](schema, options);
  }
  if (!isZodObject(schema.element)) {
    throw new Error('Array element must be a ZodObject for toGQL');
  }
  return ARRAY_ROUTES[queryType](schema, options);
}
