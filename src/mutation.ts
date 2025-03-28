import { z } from 'zod';
import { GQLType, ToGQLOptions, formatFieldArguments, getOperationFieldName, processFields } from './index';

// Process mutation operations
export function processMutation(schema: z.ZodObject<any>, options: ToGQLOptions = {}): string {
  const { operationName, variables, maxDepth = 10, inputTypeMap } = options;

  const operation = operationName ? ` ${operationName}` : '';

  // Format variables with special handling for input types
  const formatMutationVariables = (variables?: Record<string, any>, inputTypeMap?: Record<string, string>): string => {
    if (!variables || Object.keys(variables).length === 0) {
      return '';
    }

    return `(${Object.entries(variables)
      .map(([key, value]) => {
        // Use provided input type or determine based on value
        if (inputTypeMap && inputTypeMap[key]) {
          return `$${key}: ${inputTypeMap[key]}!`;
        }

        // Otherwise determine the type based on the value
        let type = 'String';
        if (typeof value === 'number') {
          type = 'Int';
        } else if (typeof value === 'boolean') {
          type = 'Boolean';
        } else if (typeof value === 'object' && value !== null) {
          // For mutations, objects are typically input types
          type = `${key.charAt(0).toUpperCase() + key.slice(1)}Input`;
        }
        return `$${key}: ${type}!`;
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
export function createMutation(schema: z.ZodObject<any>, options: ToGQLOptions = {}): string {
  return schema.toGQL(GQLType.Mutation, options);
}
