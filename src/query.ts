import { z } from 'zod';
import {
  GQLType,
  ToGQLOptions,
  formatFieldArguments,
  formatVariablesDeclaration,
  getOperationFieldName,
  processFields,
} from './index';

// Process query operations
export function processQuery(schema: z.AnyZodObject, options: ToGQLOptions = {}): string {
  const { operationName, variables } = options;
  const operation = operationName ? ` ${operationName}` : '';
  const varsString = formatVariablesDeclaration(variables, options.inputTypeMap);
  const fieldArgs = formatFieldArguments(variables);
  const queryField = getOperationFieldName(schema, operationName);
  console.log(operation, varsString, fieldArgs, queryField);
  // Generate the full GraphQL query operation
  return `${GQLType.Query}${operation}${varsString} {\n  ${queryField}${fieldArgs} {\n${processFields(schema, GQLType.Query, options, 2)}  }\n}`;
}

// Helper function to directly generate a query from a Zod schema
export function createQuery(schema: z.AnyZodObject, options: ToGQLOptions = {}): string {
  return schema.toGQL(GQLType.Query, options);
}
