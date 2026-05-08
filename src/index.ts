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
  variables?: Record<string, unknown>;
  maxDepth?: number;
  inputTypeMap?: Record<string, string>;
}

declare module 'zod' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ZodObject<T> {
    toGQL(queryType?: GQLType, options?: ToGQLOptions, depth?: number): string;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ZodArray<T> {
    toGQL(queryType?: GQLType, options?: ToGQLOptions, depth?: number): string;
  }
}

// Helper function to pluralize field names
export const pluralize = (word: string): string => {
  if (!word) {
    return '';
  }

  // Simple English pluralization rules
  if (word.endsWith('y')) {
    return word.slice(0, -1) + 'ies';
  } else if (word.endsWith('s') || word.endsWith('x') || word.endsWith('ch') || word.endsWith('sh')) {
    return word + 'es';
  } else {
    return word + 's';
  }
};

const OPERATION_PREFIXES = ['Get', 'Create', 'Update', 'Delete', 'Subscribe'] as const;

const lowercaseFirst = (s: string): string => (s ? s.charAt(0).toLowerCase() + s.slice(1) : '');

const fieldNameFromOperation = (operationName: string): string => {
  let stripped = operationName;
  for (const prefix of OPERATION_PREFIXES) {
    if (stripped.startsWith(prefix)) {
      stripped = stripped.substring(prefix.length);
      break;
    }
  }
  return lowercaseFirst(stripped);
};

const fieldNameFromObject = (schema: z.AnyZodObject): string => {
  if (schema.description) {
    return lowercaseFirst(schema.description);
  }
  const typeName = (schema._def as { typeName?: string }).typeName ?? '';
  if (typeName && typeName !== 'ZodObject') {
    return lowercaseFirst(typeName);
  }
  return '';
};

export const getOperationFieldName = (schema: z.ZodTypeAny, operationName?: string, isArrayHint = false): string => {
  if (operationName) {
    return fieldNameFromOperation(operationName);
  }
  if (schema instanceof z.ZodArray) {
    const elementSchema = schema._def.type;
    if (elementSchema instanceof z.ZodObject) {
      return pluralize(getOperationFieldName(elementSchema));
    }
    return '';
  }
  if (schema instanceof z.ZodObject) {
    const name = fieldNameFromObject(schema);
    return isArrayHint ? pluralize(name) : name;
  }
  return '';
};

const inferGraphQLType = (key: string, val: unknown): string => {
  if (val === null) {
    return 'String';
  }
  if (Array.isArray(val)) {
    const elementType = val.length > 0 ? inferGraphQLType(key, val[0]) : 'String';
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

// Format variables declaration for GraphQL
export const formatVariablesDeclaration = (
  variables?: Record<string, unknown>,
  inputTypeMap?: Record<string, string>,
): string => {
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
      return `$${key}: ${inferGraphQLType(key, value)}!`;
    })
    .join(', ')})`;
};

// Format field arguments for GraphQL
export const formatFieldArguments = (variables?: Record<string, unknown>): string => {
  if (!variables || Object.keys(variables).length === 0) {
    return '';
  }

  return `(${Object.entries(variables)
    .map(([key]) => `${key}: $${key}`)
    .join(', ')})`;
};

const renderField = (
  fieldSchema: z.ZodTypeAny,
  fieldName: string,
  queryType: GQLType,
  options: ToGQLOptions,
  depth: number,
  indent: string,
): string => {
  const unwrappedSchema =
    fieldSchema instanceof z.ZodOptional || fieldSchema instanceof z.ZodNullable ? fieldSchema._def.innerType : fieldSchema;

  if (unwrappedSchema instanceof z.ZodObject) {
    return `${indent}${fieldName} {\n${processFields(unwrappedSchema, queryType, options, depth + 1)}${indent}}\n`;
  }
  if (unwrappedSchema instanceof z.ZodArray) {
    const elementType = unwrappedSchema._def.type;
    if (elementType instanceof z.ZodObject) {
      return `${indent}${fieldName} {\n${processFields(elementType, queryType, options, depth + 1)}${indent}}\n`;
    }
  }
  return `${indent}${fieldName}\n`;
};

export const processFields = (schema: z.AnyZodObject, queryType: GQLType, options: ToGQLOptions = {}, depth = 0): string => {
  const { maxDepth = 10 } = options;

  if (depth > maxDepth) {
    return '';
  }

  const indent = '  '.repeat(depth);
  const shape = schema._def.shape();
  let query = '';

  for (const [key, value] of Object.entries(shape)) {
    if (value instanceof z.ZodType) {
      query += renderField(value, key, queryType, options, depth, indent);
    } else {
      query += `${indent}${key}\n`;
    }
  }

  return query;
};

const ARRAY_ELEMENT_NOT_OBJECT_ERROR = 'Array element must be a ZodObject';

const processArrayOperation = (schema: z.ZodArray<z.ZodTypeAny>, queryType: GQLType, options: ToGQLOptions): string => {
  const { operationName, variables } = options;
  const elementSchema = schema._def.type;
  if (!(elementSchema instanceof z.ZodObject)) {
    throw new Error(ARRAY_ELEMENT_NOT_OBJECT_ERROR);
  }
  const operation = operationName ? ` ${operationName}` : '';
  const varsString = formatVariablesDeclaration(variables, options.inputTypeMap);
  const fieldArgs = formatFieldArguments(variables);
  const fieldName = getOperationFieldName(schema, operationName);
  return `${queryType}${operation}${varsString} {\n  ${fieldName}${fieldArgs} {\n${processFields(elementSchema, queryType, options, 2)}  }\n}`;
};

// Process array operations
export function processArrayQuery(schema: z.ZodArray<z.ZodTypeAny>, options: ToGQLOptions = {}): string {
  return processArrayOperation(schema, GQLType.Query, options);
}

export function processArrayMutation(schema: z.ZodArray<z.ZodTypeAny>, options: ToGQLOptions = {}): string {
  return processArrayOperation(schema, GQLType.Mutation, options);
}

export function processArraySubscription(schema: z.ZodArray<z.ZodTypeAny>, options: ToGQLOptions = {}): string {
  return processArrayOperation(schema, GQLType.Subscription, options);
}

// Router function that delegates to the appropriate operation type for ZodObject
z.ZodObject.prototype.toGQL = function (queryType: GQLType = GQLType.Query, options: ToGQLOptions = {}, depth = 0): string {
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
z.ZodArray.prototype.toGQL = function (queryType: GQLType = GQLType.Query, options: ToGQLOptions = {}, depth = 0): string {
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
