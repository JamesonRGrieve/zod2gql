// SPDX-License-Identifier: AGPL-3.0-or-later
import { z } from 'zod';
import { GQLSchemaError, assertGraphQLName } from './errors';

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
  string | number | boolean | null | GraphQLVariableValue[] | { [key: string]: GraphQLVariableValue };

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

/** Any zod schema, classic or core; the translator only inspects structure. */
export type AnySchema = z.core.$ZodType;
/** Any object schema; its shape values are schemas (zod's default shape is a loose `any` record). */
export type AnyObjectSchema = z.ZodObject<z.core.$ZodShape>;

const fieldNameFromObject = (schema: AnyObjectSchema): string =>
  schema.description !== undefined && schema.description !== '' ? lowercaseFirst(schema.description) : '';

const isZodArray = (schema: AnySchema): schema is z.ZodArray => schema instanceof z.ZodArray;
export const isZodObject = (schema: AnySchema): schema is AnyObjectSchema => schema instanceof z.ZodObject;

/** Strip every optional/nullable layer so `.nullable().optional()` still exposes its object shape. */
const unwrapOptionality = (schema: AnySchema): AnySchema => {
  let current = schema;
  while (current instanceof z.ZodOptional || current instanceof z.ZodNullable) {
    current = current.unwrap();
  }
  return current;
};

export const getOperationFieldName = (schema: AnySchema, operationName?: string, isArrayHint = false): string => {
  if (operationName !== undefined && operationName !== '') {
    return fieldNameFromOperation(operationName);
  }
  if (isZodArray(schema)) {
    if (isZodObject(schema.element)) {
      return pluralize(getOperationFieldName(schema.element));
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

/** Variable entries, each name checked as a GraphQL name since it is emitted as `$name` and as an argument name. */
const variableEntries = (variables: Record<string, GraphQLVariableValue>): Array<[string, GraphQLVariableValue]> => {
  const entries = Object.entries(variables);
  for (const [key] of entries) {
    assertGraphQLName(key, 'variable', []);
  }
  return entries;
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

  return `(${variableEntries(variables)
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

  return `(${variableEntries(variables)
    .map(([key]) => `${key}: $${key}`)
    .join(', ')})`;
};

const DEFAULT_MAX_DEPTH = 10;

function renderFields(schema: AnyObjectSchema, options: ToGQLOptions, depth: number, path: readonly string[]): string {
  const { maxDepth = DEFAULT_MAX_DEPTH } = options;

  if (depth > maxDepth) {
    return '';
  }

  const indent = '  '.repeat(depth);
  let query = '';

  for (const [key, value] of Object.entries(schema.shape)) {
    query += renderField(value, key, options, depth, indent, [...path, key]);
  }

  return query;
}

function renderField(
  fieldSchema: AnySchema,
  fieldName: string,
  options: ToGQLOptions,
  depth: number,
  indent: string,
  path: readonly string[],
): string {
  assertGraphQLName(fieldName, 'field', path);
  const unwrappedSchema = unwrapOptionality(fieldSchema);

  if (isZodObject(unwrappedSchema)) {
    return `${indent}${fieldName} {\n${renderFields(unwrappedSchema, options, depth + 1, path)}${indent}}\n`;
  }
  if (isZodArray(unwrappedSchema)) {
    const elementType = unwrapOptionality(unwrappedSchema.element);
    if (isZodObject(elementType)) {
      return `${indent}${fieldName} {\n${renderFields(elementType, options, depth + 1, path)}${indent}}\n`;
    }
  }
  return `${indent}${fieldName}\n`;
}

/** Render the selection set of `schema` at indent level `depth`. `queryType` does not change the selection. */
export function processFields(schema: AnyObjectSchema, _queryType: GQLType, options: ToGQLOptions = {}, depth = 0): string {
  return renderFields(schema, options, depth, []);
}

/** Indent level of the selection set under an operation's root field (`query { field { <here> } }`). */
const OPERATION_SELECTION_INDENT = 2;

/**
 * Render a complete operation: `<type> <name>(<vars>) { <field>(<args>) { <selection> } }`.
 * `rootSchema` names the operation field; `selectionSchema` supplies the selection set
 * (the same object for an object schema, the element for an array schema).
 */
export const renderOperation = (
  queryType: GQLType,
  rootSchema: AnySchema,
  selectionSchema: AnyObjectSchema,
  options: ToGQLOptions,
): string => {
  const { operationName, variables, inputTypeMap } = options;
  const hasOperationName = operationName !== undefined && operationName !== '';
  if (hasOperationName) {
    assertGraphQLName(operationName, 'operationName', []);
  }
  const operation = hasOperationName ? ` ${operationName}` : '';
  const varsString = formatVariablesDeclaration(variables, inputTypeMap);
  const fieldArgs = formatFieldArguments(variables);
  const fieldName = getOperationFieldName(rootSchema, operationName);
  if (fieldName === '') {
    throw new GQLSchemaError(
      [],
      "cannot derive the operation's root field name; pass operationName or name the schema with .describe('TypeName')",
    );
  }
  assertGraphQLName(fieldName, 'operation field', []);
  const selection = renderFields(selectionSchema, options, OPERATION_SELECTION_INDENT, [fieldName]);
  return `${queryType}${operation}${varsString} {\n  ${fieldName}${fieldArgs} {\n${selection}  }\n}`;
};

const ARRAY_ELEMENT_NOT_OBJECT_ERROR = 'Array element must be a ZodObject';

const processArrayOperation = (schema: z.ZodArray, queryType: GQLType, options: ToGQLOptions): string => {
  const elementSchema = schema.element;
  if (!isZodObject(elementSchema)) {
    throw new Error(ARRAY_ELEMENT_NOT_OBJECT_ERROR);
  }
  return renderOperation(queryType, schema, elementSchema, options);
};

// Process array operations
export function processArrayQuery(schema: z.ZodArray, options: ToGQLOptions = {}): string {
  return processArrayOperation(schema, GQLType.Query, options);
}

export function processArrayMutation(schema: z.ZodArray, options: ToGQLOptions = {}): string {
  return processArrayOperation(schema, GQLType.Mutation, options);
}

export function processArraySubscription(schema: z.ZodArray, options: ToGQLOptions = {}): string {
  return processArrayOperation(schema, GQLType.Subscription, options);
}
