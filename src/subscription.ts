import type { z } from 'zod';
import {
  GQLType,
  type ToGQLOptions,
  formatFieldArguments,
  formatVariablesDeclaration,
  getOperationFieldName,
  processFields,
} from './core';

// Process subscription operations
export function processSubscription(schema: z.AnyZodObject, options: ToGQLOptions = {}): string {
  const { operationName, variables } = options;

  const operation = operationName !== undefined && operationName !== '' ? ` ${operationName}` : '';
  const varsString = formatVariablesDeclaration(variables, options.inputTypeMap);
  const fieldArgs = formatFieldArguments(variables);
  const subscriptionField = getOperationFieldName(schema, operationName);

  // Generate the full GraphQL subscription operation
  return `${GQLType.Subscription}${operation}${varsString} {\n  ${subscriptionField}${fieldArgs} {\n${processFields(schema, GQLType.Subscription, options, 2)}  }\n}`;
}

// Helper function to directly generate a subscription from a Zod schema
export function createSubscription(schema: z.AnyZodObject, options: ToGQLOptions = {}): string {
  return schema.toGQL(GQLType.Subscription, options);
}
