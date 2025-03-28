import { z } from 'zod';
import {
  GQLType,
  ToGQLOptions,
  formatFieldArguments,
  formatVariablesDeclaration,
  getOperationFieldName,
  processFields,
} from './index';

// Process subscription operations
export function processSubscription(schema: z.ZodObject<any>, options: ToGQLOptions = {}): string {
  const { operationName, variables, maxDepth = 10 } = options;

  const operation = operationName ? ` ${operationName}` : '';
  const varsString = formatVariablesDeclaration(variables, options.inputTypeMap);
  const fieldArgs = formatFieldArguments(variables);
  const subscriptionField = getOperationFieldName(schema, operationName);

  // Generate the full GraphQL subscription operation
  return `${GQLType.Subscription}${operation}${varsString} {\n  ${subscriptionField}${fieldArgs} {\n${processFields(schema, GQLType.Subscription, options, 2)}  }\n}`;
}

// Helper function to directly generate a subscription from a Zod schema
export function createSubscription(schema: z.ZodObject<any>, options: ToGQLOptions = {}): string {
  return schema.toGQL(GQLType.Subscription, options);
}
