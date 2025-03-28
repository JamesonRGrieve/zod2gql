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
}

export const getOperationFieldName = (schema: z.ZodObject<any>, operationName?: string): string => {
  if (operationName) {
    let fieldName = operationName;
    const prefixes = ['Get', 'Create', 'Update', 'Delete', 'Subscribe'];
    for (const prefix of prefixes) {
      if (fieldName.startsWith(prefix)) {
        fieldName = fieldName.substring(prefix.length);
        break;
      }
    }
    return fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
  } else {
    // Use the description if provided
    if (schema.description) {
      return schema.description.charAt(0).toLowerCase() + schema.description.slice(1);
    }

    // Fallback to the internal typeName if description is not set
    const typeName = (schema as any)._def.typeName || '';
    if (typeName && typeName !== 'ZodObject') {
      return typeName.charAt(0).toLowerCase() + typeName.slice(1);
    }
    return '';
  }
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
// Router function that delegates to the appropriate operation type
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

export default z;
