// SPDX-License-Identifier: AGPL-3.0-or-later
import { z } from 'zod';

// Define an enum for GraphQL operation types
export enum GQLType {
  Query = 'query',
  Mutation = 'mutation',
  Subscription = 'subscription',
}

// JSON-shaped value space for GraphQL variables. The translator inspects these
// raw runtime values to infer GraphQL scalar/input types; this is the narrow
// type they are validated to at the public boundary (in place of `unknown`).
export type GraphQLVariableValue =
  | string
  | number
  | boolean
  | null
  | GraphQLVariableValue[]
  | { [key: string]: GraphQLVariableValue };

// Define interface for toGQL options
export interface ToGQLOptions {
  operationName?: string;
  variables?: Record<string, GraphQLVariableValue>;
  maxDepth?: number;
  inputTypeMap?: Record<string, string>;
}

// Helper function to pluralize field names
export const pluralize = (word: string): string => {
  if (!word) {
    return '';
  }

  // Simple English pluralization rules
  if (word.endsWith('y')) {
    return `${word.slice(0, -1)}ies`;
  } else if (word.endsWith('s') || word.endsWith('x') || word.endsWith('ch') || word.endsWith('sh')) {
    return `${word}es`;
  } else {
    return `${word}s`;
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
  if (schema.description !== undefined && schema.description !== '') {
    return lowercaseFirst(schema.description);
  }
  const typeName: string = schema._def.typeName;
  if (typeName !== '' && typeName !== 'ZodObject') {
    return lowercaseFirst(typeName);
  }
  return '';
};

const isZodArray = (schema: z.ZodTypeAny): schema is z.ZodArray<z.ZodTypeAny> => schema instanceof z.ZodArray;
export const isZodObject = (schema: z.ZodTypeAny): schema is z.AnyZodObject => schema instanceof z.ZodObject;

export const getOperationFieldName = (schema: z.ZodTypeAny, operationName?: string, isArrayHint = false): string => {
  if (operationName !== undefined && operationName !== '') {
    return fieldNameFromOperation(operationName);
  }
  if (isZodArray(schema)) {
    const elementSchema: z.ZodTypeAny = schema._def.type;
    if (isZodObject(elementSchema)) {
      return pluralize(getOperationFieldName(elementSchema));
    }
    return '';
  }
  if (isZodObject(schema)) {
    const name = fieldNameFromObject(schema);
    return isArrayHint ? pluralize(name) : name;
  }
  return '';
};

const inferGraphQLType = (key: string, val: GraphQLVariableValue | undefined): string => {
  if (val === null || val === undefined) {
    return 'String';
  }
  if (Array.isArray(val)) {
    const elementType = val.length > 0 ? inferGraphQLType(key, val[0]) : 'String';
    return `[${elementType}]`;
  }
  if (typeof val === 'number') {
    return Number.isInteger(val) ? 'Int' : 'Float';
  }
  if (typeof val === 'boolean') {
    return 'Boolean';
  }
  if (typeof val === 'object') {
    return `${key.charAt(0).toUpperCase() + key.slice(1)}Input`;
  }
  return 'String';
};

// Format variables declaration for GraphQL
export const formatVariablesDeclaration = (
  variables?: Record<string, GraphQLVariableValue>,
  inputTypeMap?: Record<string, string>,
): string => {
  if (!variables || Object.keys(variables).length === 0) {
    return '';
  }

  const inputTypes = new Map(Object.entries(inputTypeMap ?? {}));

  return `(${Object.entries(variables)
    .map(([key, value]) => {
      const mapped = inputTypes.get(key);
      if (mapped !== undefined && mapped !== '') {
        return `$${key}: ${mapped}!`;
      }
      return `$${key}: ${inferGraphQLType(key, value)}!`;
    })
    .join(', ')})`;
};

// Format field arguments for GraphQL
export const formatFieldArguments = (variables?: Record<string, GraphQLVariableValue>): string => {
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
  const unwrappedSchema: z.ZodTypeAny =
    fieldSchema instanceof z.ZodOptional || fieldSchema instanceof z.ZodNullable
      ? // type-coverage:ignore-next-line - Zod's ZodOptional/ZodNullable._def.innerType is typed as ZodTypeAny (any-leaking generics) at the library boundary
        (fieldSchema._def.innerType as z.ZodTypeAny)
      : fieldSchema;

  if (isZodObject(unwrappedSchema)) {
    return `${indent}${fieldName} {\n${processFields(unwrappedSchema, queryType, options, depth + 1)}${indent}}\n`;
  }
  if (isZodArray(unwrappedSchema)) {
    const elementType: z.ZodTypeAny = unwrappedSchema._def.type;
    if (isZodObject(elementType)) {
      return `${indent}${fieldName} {\n${processFields(elementType, queryType, options, depth + 1)}${indent}}\n`;
    }
  }
  return `${indent}${fieldName}\n`;
};

export function processFields(schema: z.AnyZodObject, queryType: GQLType, options: ToGQLOptions = {}, depth = 0): string {
  const { maxDepth = 10 } = options;

  if (depth > maxDepth) {
    return '';
  }

  const indent = '  '.repeat(depth);
  const shape = schema._def.shape() as Record<string, unknown>;
  let query = '';

  for (const [key, value] of Object.entries(shape)) {
    if (value instanceof z.ZodType) {
      query += renderField(value as z.ZodTypeAny, key, queryType, options, depth, indent);
    } else {
      query += `${indent}${key}\n`;
    }
  }

  return query;
}

const ARRAY_ELEMENT_NOT_OBJECT_ERROR = 'Array element must be a ZodObject';

const processArrayOperation = (schema: z.ZodArray<z.ZodTypeAny>, queryType: GQLType, options: ToGQLOptions): string => {
  const { operationName, variables } = options;
  const elementSchema: z.ZodTypeAny = schema._def.type;
  if (!isZodObject(elementSchema)) {
    throw new Error(ARRAY_ELEMENT_NOT_OBJECT_ERROR);
  }
  const operation = operationName !== undefined && operationName !== '' ? ` ${operationName}` : '';
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
