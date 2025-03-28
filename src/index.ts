import { z } from 'zod';
import { processMutation } from './mutation';
import { processQuery } from './query';
import { processSubscription } from './subscription';

// Define an enum for GraphQL operation types
export enum GQLType {
  Query = 'query',
  Mutation = 'mutation',
  Subscription = 'subscription',
}

// Define interface for toGQL options
export interface ToGQLOptions {
  operationName?: string;
  variables?: Record<string, any>;
  maxDepth?: number;
  inputTypeMap?: Record<string, string>;
}

declare module 'zod' {
  interface ZodObject<T> {
    toGQL(queryType?: GQLType, options?: ToGQLOptions, depth?: number): string;
  }

  interface ZodArray<T> {
    toGQL(queryType?: GQLType, options?: ToGQLOptions, depth?: number): string;
  }
}

// Helper function to pluralize field names
export const pluralize = (word: string): string => {
  if (!word) return '';

  // Simple English pluralization rules
  if (word.endsWith('y')) {
    return word.slice(0, -1) + 'ies';
  } else if (word.endsWith('s') || word.endsWith('x') || word.endsWith('ch') || word.endsWith('sh')) {
    return word + 'es';
  } else {
    return word + 's';
  }
};

export const getOperationFieldName = (schema: z.ZodTypeAny, operationName?: string, isArray: boolean = false): string => {
  let fieldName = '';

  if (operationName) {
    fieldName = operationName;
    const prefixes = ['Get', 'Create', 'Update', 'Delete', 'Subscribe'];
    for (const prefix of prefixes) {
      if (fieldName.startsWith(prefix)) {
        fieldName = fieldName.substring(prefix.length);
        break;
      }
    }
    fieldName = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
  }
  // Handle array schema - get element schema name and pluralize
  else if (schema instanceof z.ZodArray) {
    const elementSchema = schema._def.type;
    if (elementSchema instanceof z.ZodObject) {
      // Get singular name from element schema
      fieldName = getOperationFieldName(elementSchema);
      isArray = true;
    }
  }
  // Handle object schema as before
  else if (schema instanceof z.ZodObject) {
    if (schema.description) {
      fieldName = schema.description.charAt(0).toLowerCase() + schema.description.slice(1);
    } else {
      const typeName = (schema as any)._def.typeName || '';
      if (typeName && typeName !== 'ZodObject') {
        fieldName = typeName.charAt(0).toLowerCase() + typeName.slice(1);
      }
    }
  }

  // Pluralize if it's an array
  return isArray ? pluralize(fieldName) : fieldName;
};

// Format variables declaration for GraphQL
export const formatVariablesDeclaration = (
  variables?: Record<string, any>,
  inputTypeMap?: Record<string, string>,
): string => {
  if (!variables || Object.keys(variables).length === 0) {
    return '';
  }

  return `(${Object.entries(variables)
    .map(([key, value]) => {
      // Prioritize input type map
      if (inputTypeMap && inputTypeMap[key]) {
        return `$${key}: ${inputTypeMap[key]}!`;
      }

      // More sophisticated type inference
      const inferType = (val: any): string => {
        if (val === null) return 'String';
        if (Array.isArray(val)) {
          const elementType = val.length > 0 ? inferType(val[0]) : 'String';
          return `[${elementType}]`;
        }
        switch (typeof val) {
          case 'number':
            return Number.isInteger(val) ? 'Int' : 'Float';
          case 'boolean':
            return 'Boolean';
          case 'object':
            return `${key.charAt(0).toUpperCase() + key.slice(1)}Input`;
          default:
            return 'String';
        }
      };

      return `$${key}: ${inferType(value)}!`;
    })
    .join(', ')})`;
};

// Format field arguments for GraphQL
export const formatFieldArguments = (variables?: Record<string, any>): string => {
  if (!variables || Object.keys(variables).length === 0) {
    return '';
  }

  return `(${Object.entries(variables)
    .map(([key]) => `${key}: $${key}`)
    .join(', ')})`;
};

export const processFields = (
  schema: z.ZodObject<any>,
  queryType: GQLType,
  options: ToGQLOptions = {},
  depth: number = 0,
): string => {
  const { maxDepth = 10 } = options;

  if (depth > maxDepth) {
    return '';
  }

  const indent = '  '.repeat(depth);
  let query = '';
  const shape = schema._def.shape();

  for (const [key, value] of Object.entries(shape)) {
    // Process the schema based on its type
    const processSchema = (schema: z.ZodTypeAny, fieldName: string) => {
      // Unwrap Optional and Nullable types
      const unwrappedSchema =
        schema instanceof z.ZodOptional || schema instanceof z.ZodNullable ? schema._def.innerType : schema;

      // Handle ZodObject recursively
      if (unwrappedSchema instanceof z.ZodObject) {
        query += `${indent}${fieldName} {\n${processFields(unwrappedSchema, queryType, options, depth + 1)}${indent}}\n`;
      }
      // Handle ZodArray with nested types
      else if (unwrappedSchema instanceof z.ZodArray) {
        const elementType = unwrappedSchema._def.type;

        // If array element is an object, expand its fields
        if (elementType instanceof z.ZodObject) {
          query += `${indent}${fieldName} {\n${processFields(elementType, queryType, options, depth + 1)}${indent}}\n`;
        } else {
          query += `${indent}${fieldName}\n`;
        }
      }
      // Other type handling remains the same
      else {
        query += `${indent}${fieldName}\n`;
      }
    };

    // Improved type checking for Zod schemas
    if (value instanceof z.ZodType) {
      processSchema(value, key);
    } else {
      query += `${indent}${key}\n`;
    }
  }

  return query;
};

// Process array operations
export function processArrayQuery(schema: z.ZodArray<any>, options: ToGQLOptions = {}): string {
  const { operationName, variables, maxDepth = 10 } = options;

  // Get the element schema
  const elementSchema = schema._def.type;

  // Only proceed if the element is an object
  if (!(elementSchema instanceof z.ZodObject)) {
    throw new Error('Array element must be a ZodObject');
  }

  const operation = operationName ? ` ${operationName}` : '';
  const varsString = formatVariablesDeclaration(variables, options.inputTypeMap);
  const fieldArgs = formatFieldArguments(variables);

  // Get the pluralized field name
  const queryField = getOperationFieldName(schema, operationName);

  // Generate the full GraphQL query for array
  return `${GQLType.Query}${operation}${varsString} {\n  ${queryField}${fieldArgs} {\n${processFields(elementSchema, GQLType.Query, options, 2)}  }\n}`;
}

export function processArrayMutation(schema: z.ZodArray<any>, options: ToGQLOptions = {}): string {
  const { operationName, variables, maxDepth = 10 } = options;

  // Get the element schema
  const elementSchema = schema._def.type;

  // Only proceed if the element is an object
  if (!(elementSchema instanceof z.ZodObject)) {
    throw new Error('Array element must be a ZodObject');
  }

  const operation = operationName ? ` ${operationName}` : '';
  const varsString = formatVariablesDeclaration(variables, options.inputTypeMap);
  const fieldArgs = formatFieldArguments(variables);

  // Get the pluralized field name
  const mutationField = getOperationFieldName(schema, operationName);

  // Generate the full GraphQL mutation for array
  return `${GQLType.Mutation}${operation}${varsString} {\n  ${mutationField}${fieldArgs} {\n${processFields(elementSchema, GQLType.Mutation, options, 2)}  }\n}`;
}

export function processArraySubscription(schema: z.ZodArray<any>, options: ToGQLOptions = {}): string {
  const { operationName, variables, maxDepth = 10 } = options;

  // Get the element schema
  const elementSchema = schema._def.type;

  // Only proceed if the element is an object
  if (!(elementSchema instanceof z.ZodObject)) {
    throw new Error('Array element must be a ZodObject');
  }

  const operation = operationName ? ` ${operationName}` : '';
  const varsString = formatVariablesDeclaration(variables, options.inputTypeMap);
  const fieldArgs = formatFieldArguments(variables);

  // Get the pluralized field name
  const subscriptionField = getOperationFieldName(schema, operationName);

  // Generate the full GraphQL subscription for array
  return `${GQLType.Subscription}${operation}${varsString} {\n  ${subscriptionField}${fieldArgs} {\n${processFields(elementSchema, GQLType.Subscription, options, 2)}  }\n}`;
}

// Router function that delegates to the appropriate operation type for ZodObject
z.ZodObject.prototype.toGQL = function (
  queryType: GQLType = GQLType.Query,
  options: ToGQLOptions = {},
  depth: number = 0,
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
  queryType: GQLType = GQLType.Query,
  options: ToGQLOptions = {},
  depth: number = 0,
): string {
  // If we're processing nested fields, return empty for now
  if (depth > 0) {
    return '';
  }

  // Get the element schema
  const elementSchema = this._def.type;

  // Only proceed if the element is an object
  if (!(elementSchema instanceof z.ZodObject)) {
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
