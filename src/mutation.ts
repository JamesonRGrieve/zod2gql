import { z } from 'zod';
import { GQLType, ToGQLOptions, formatFieldArguments, getOperationFieldName, processFields } from './index';

// Process mutation operations
export function processMutation(schema: z.AnyZodObject, options: ToGQLOptions = {}): string {
  const { operationName, variables, inputTypeMap } = options;

  const operation = operationName ? ` ${operationName}` : '';

  const inferMutationType = (key: string, value: unknown): string => {
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
  const formatMutationVariables = (variables?: Record<string, unknown>, inputTypeMap?: Record<string, string>): string => {
    if (!variables || Object.keys(variables).length === 0) {
      return '';
    }
    const inputTypes = new Map(Object.entries(inputTypeMap ?? {}));

    return `(${Object.entries(variables)
      .map(([key, value]) => {
        const mapped = inputTypes.get(key);
        if (mapped) {
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
