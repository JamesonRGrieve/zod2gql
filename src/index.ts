// SPDX-License-Identifier: AGPL-3.0-or-later
import { z } from 'zod';
import {
  GQLType,
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
import { createMutation, processMutation } from './mutation';
import { createQuery, processQuery } from './query';
import { createSubscription, processSubscription } from './subscription';

export {
  GQLType,
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

declare module 'zod' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ZodObject<T> {
    toGQL: (queryType?: GQLType, options?: ToGQLOptions, depth?: number) => string;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ZodArray<T> {
    toGQL: (queryType?: GQLType, options?: ToGQLOptions, depth?: number) => string;
  }
}

// Router function that delegates to the appropriate operation type for ZodObject
z.ZodObject.prototype.toGQL = function (
  this: z.AnyZodObject,
  queryType: GQLType = GQLType.Query,
  options: ToGQLOptions = {},
  depth = 0,
): string {
  // If we're processing nested fields, use the common functionality
  if (depth > 0) {
    return processFields(this, queryType, options, depth);
  }

  // For root calls, route to the proper handler based on operation type
  switch (queryType) {
    case GQLType.Query:
      return processQuery(this, options);
    case GQLType.Mutation:
      return processMutation(this, options);
    case GQLType.Subscription:
      return processSubscription(this, options);
    default:
      // Should never hit this with TypeScript, but just in case
      return '';
  }
};

// Router function that delegates to the appropriate operation type for ZodArray
z.ZodArray.prototype.toGQL = function (
  this: z.ZodArray<z.ZodTypeAny>,
  queryType: GQLType = GQLType.Query,
  options: ToGQLOptions = {},
  depth = 0,
): string {
  // If we're processing nested fields, return empty for now
  if (depth > 0) {
    return '';
  }

  // Get the element schema
  const elementSchema: z.ZodTypeAny = this._def.type;

  // Only proceed if the element is an object
  if (!isZodObject(elementSchema)) {
    throw new Error('Array element must be a ZodObject for toGQL');
  }

  // For root calls, route to the proper handler based on operation type
  switch (queryType) {
    case GQLType.Query:
      return processArrayQuery(this, options);
    case GQLType.Mutation:
      return processArrayMutation(this, options);
    case GQLType.Subscription:
      return processArraySubscription(this, options);
    default:
      return '';
  }
};

export default z;
