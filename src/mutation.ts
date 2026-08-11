// SPDX-License-Identifier: AGPL-3.0-or-later
import type { z } from 'zod';
import {
  GQLType,
  type GraphQLVariableValue,
  type ToGQLOptions,
  formatFieldArguments,
  getOperationFieldName,
  processFields,
} from './core';

// Process mutation operations
export function processMutation(schema: z.AnyZodObject, options: ToGQLOptions = {}): string {
  const { operationName, variables, inputTypeMap } = options;

  const operation = operationName !== undefined && operationName !== '' ? ` ${operationName}` : '';

  const inferMutationType = (key: string, value: GraphQLVariableValue): string => {
    if (typeof value === 'number') {
      return 'Int';
    }
    if (typeof value === 'boolean') {
      return 'Boolean';
    }
    if (typeof value === 'object' && value !== null) {
      return `${key.charAt(0).toUpperCase() + key.slice(1)}Input`;
    }
    return 'String';
  };

  // Format variables with special handling for input types
  const formatMutationVariables = (
    vars?: Record<string, GraphQLVariableValue>,
    inputMap?: Record<string, string>,
  ): string => {
    if (!vars || Object.keys(vars).length === 0) {
      return '';
    }
    const inputTypes = new Map(Object.entries(inputMap ?? {}));

    return `(${Object.entries(vars)
      .map(([key, value]) => {
        const mapped = inputTypes.get(key);
        if (mapped !== undefined && mapped !== '') {
          return `$${key}: ${mapped}!`;
        }
        return `$${key}: ${inferMutationType(key, value)}!`;
      })
      .join(', ')})`;
  };

  const varsString = formatMutationVariables(variables, inputTypeMap);
  const fieldArgs = formatFieldArguments(variables);
  const mutationField = getOperationFieldName(schema, operationName);

  // Generate the full GraphQL mutation operation
  return `${GQLType.Mutation}${operation}${varsString} {\n  ${mutationField}${fieldArgs} {\n${processFields(schema, GQLType.Mutation, options, 2)}  }\n}`;
}

// Helper function to directly generate a mutation from a Zod schema
export function createMutation(schema: z.AnyZodObject, options: ToGQLOptions = {}): string {
  return schema.toGQL(GQLType.Mutation, options);
}
