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
      // Use input type map if provided
      if (inputTypeMap && inputTypeMap[key]) {
        return `$${key}: ${inputTypeMap[key]}!`;
      }

      // Otherwise determine the type based on the value
      let type = 'String';
      if (typeof value === 'number') {
        type = 'Int';
      }
      if (typeof value === 'boolean') {
        type = 'Boolean';
      }
      if (typeof value === 'object' && value !== null) {
        type = `${key.charAt(0).toUpperCase() + key.slice(1)}Input`;
      }
      return `$${key}: ${type}!`;
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

// Process fields recursively - shared logic across operation types
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
      // Handle ZodObject recursively
      if (schema instanceof z.ZodObject) {
        query += `${indent}${fieldName} {\n${processFields(schema, queryType, options, depth + 1)}${indent}}\n`;
      }
      // Handle ZodArray with proper expansion of nested types
      else if (schema instanceof z.ZodArray) {
        const elementType = schema._def.type;
        if (elementType && typeof elementType === 'object' && 'toJSON' in elementType) {
          processSchema(elementType as z.ZodTypeAny, fieldName);
        } else {
          query += `${indent}${fieldName}\n`;
        }
      }
      // Handle ZodLazy - for circular references
      else if (schema instanceof z.ZodLazy) {
        const innerType = schema._def.getter();
        if (innerType && typeof innerType === 'object' && 'toJSON' in innerType) {
          processSchema(innerType as z.ZodTypeAny, fieldName);
        } else {
          query += `${indent}${fieldName}\n`;
        }
      }
      // Handle ZodOptional and ZodNullable by unwrapping them
      else if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
        const innerType = schema._def.innerType;
        if (innerType && typeof innerType === 'object' && 'toJSON' in innerType) {
          processSchema(innerType as z.ZodTypeAny, fieldName);
        } else {
          query += `${indent}${fieldName}\n`;
        }
      }
      // Handle ZodUnion and ZodEnum
      else if (schema instanceof z.ZodUnion || schema instanceof z.ZodEnum) {
        query += `${indent}${fieldName}\n`;
      }
      // Handle primitive types
      else {
        query += `${indent}${fieldName}\n`;
      }
    };

    // Ensure value is a valid Zod type before processing
    if (value && typeof value === 'object' && 'toJSON' in value) {
      processSchema(value as unknown as z.ZodTypeAny, key);
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
