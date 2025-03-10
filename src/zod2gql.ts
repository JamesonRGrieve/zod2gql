import { z } from 'zod';

declare module 'zod' {
  interface ZodObject<T> {
    toGQL(
      queryType?: 'query' | 'mutation' | 'subscription',
      operationName?: string,
      variables?: Record<string, any>,
    ): string;
    zodToGraphQL(depth?: number, maxDepth?: number): string;
  }
}

z.ZodObject.prototype.zodToGraphQL = function (depth = 0, maxDepth = 10): string {
  if (depth > maxDepth) return '';

  const indent = '  '.repeat(depth);
  let query = '';
  const shape = this._def.shape();

  for (const [key, value] of Object.entries(shape)) {
    // Process the schema based on its type
    const processSchema = (schema, fieldName) => {
      // Handle ZodObject
      if (schema instanceof z.ZodObject) {
        query += `${indent}${fieldName} {\n${schema.zodToGraphQL(depth + 1, maxDepth)}${indent}}\n`;
      }
      // Handle ZodArray with proper expansion of nested types
      else if (schema instanceof z.ZodArray) {
        const elementType = schema._def.type;
        processSchema(elementType, fieldName);
      }
      // Handle ZodLazy - for circular references
      else if (schema instanceof z.ZodLazy) {
        const innerType = schema._def.getter();
        processSchema(innerType, fieldName);
      }
      // Handle ZodOptional and ZodNullable by unwrapping them
      else if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
        const innerType = schema._def.innerType;
        processSchema(innerType, fieldName);
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

    processSchema(value, key);
  }

  return query;
};

z.ZodObject.prototype.toGQL = function (
  queryType: 'query' | 'mutation' | 'subscription' = 'query',
  operationName?: string,
  variables?: Record<string, any>,
): string {
  const operation = operationName ? ` ${operationName}` : '';

  // Format variables declaration
  const varsString = variables
    ? `(${Object.entries(variables)
        .map(([key, value]) => {
          // Determine the type based on the value
          let type = 'String';
          if (typeof value === 'number') type = 'Int';
          if (typeof value === 'boolean') type = 'Boolean';
          return `$${key}: ${type}!`;
        })
        .join(', ')})`
    : '';

  // Format field arguments
  const fieldArgs = variables
    ? `(${Object.entries(variables)
        .map(([key]) => `${key}: $${key}`)
        .join(', ')})`
    : '';

  // Get operation field name - convert GetUser to user, GetTeamMembers to teamMembers, etc.
  let queryField = operationName;
  if (queryField?.startsWith('Get')) {
    queryField = queryField.substring(3);
    queryField = queryField.charAt(0).toLowerCase() + queryField.slice(1);
  }

  const fields = this.zodToGraphQL(2);

  return `${queryType}${operation}${varsString} {\n  ${queryField}${fieldArgs} {\n${fields}  }\n}`;
};
