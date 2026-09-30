// SPDX-License-Identifier: AGPL-3.0-or-later
import { z } from 'zod';
import { GQLSchemaError, assertGraphQLName } from './errors';

type Schema = z.core.$ZodType;
type ObjectSchema = z.core.$ZodObject;

/** Nesting allowed below the rendered object when the caller sets no `maxDepth`. */
const DEFAULT_MAX_DEPTH = 10;

const INDENT = '  ';

/** What a field contributes to a selection set: nothing below it, or the fields of an object schema. */
type FieldSelection = { readonly kind: 'leaf' } | { readonly kind: 'object'; readonly object: ObjectSchema };

const LEAF: FieldSelection = { kind: 'leaf' };

interface RenderContext {
  readonly maxDepth: number;
  /** Object schemas being selected on the current path, each with the path it was entered at. */
  readonly ancestors: ReadonlyMap<ObjectSchema, readonly string[]>;
}

const describePath = (path: readonly string[]): string => (path.length > 0 ? path.join('.') : 'the root');

/** The schema a wrapper stands for, when `schema` only wraps another schema; `undefined` otherwise. */
const innerSchema = (schema: Schema): Schema | undefined => {
  if (schema instanceof z.core.$ZodOptional || schema instanceof z.core.$ZodNullable) {
    return schema._zod.def.innerType;
  }
  if (schema instanceof z.core.$ZodLazy) {
    return schema._zod.innerType;
  }
  return undefined;
};

/**
 * Classify a field schema. `visiting` holds the wrappers already passed through for this one field, so a
 * `z.lazy` that resolves back to itself without reaching an object is reported instead of recursing forever.
 */
const resolveField = (schema: Schema, path: readonly string[], visiting: ReadonlySet<Schema>): FieldSelection => {
  if (visiting.has(schema)) {
    throw new GQLSchemaError(path, 'circular reference: the schema resolves to itself without reaching an object');
  }
  const next = new Set(visiting).add(schema);
  const inner = innerSchema(schema);
  if (inner !== undefined) {
    return resolveField(inner, path, next);
  }
  if (schema instanceof z.core.$ZodObject) {
    return { kind: 'object', object: schema };
  }
  if (schema instanceof z.core.$ZodArray) {
    return resolveField(schema._zod.def.element, path, next);
  }
  return LEAF;
};

function renderObject(
  object: ObjectSchema,
  context: RenderContext,
  level: number,
  indentLevel: number,
  path: readonly string[],
): string {
  const enteredAt = context.ancestors.get(object);
  if (enteredAt !== undefined) {
    throw new GQLSchemaError(
      path,
      `circular reference: this object schema is already selected at ${describePath(enteredAt)}; GraphQL selections are finite, so select a non-recursive projection`,
    );
  }
  if (level > context.maxDepth) {
    throw new GQLSchemaError(
      path,
      `selection nests deeper than maxDepth (${context.maxDepth}); raise maxDepth or select fewer levels`,
    );
  }
  const entries = Object.entries(object._zod.def.shape);
  if (entries.length === 0) {
    throw new GQLSchemaError(path, 'object has no fields, and a GraphQL selection set cannot be empty');
  }

  const childContext: RenderContext = { ...context, ancestors: new Map(context.ancestors).set(object, path) };
  const indent = INDENT.repeat(indentLevel);
  let rendered = '';
  for (const [name, fieldSchema] of entries) {
    const fieldPath = [...path, name];
    assertGraphQLName(name, 'field', fieldPath);
    const selection = resolveField(fieldSchema, fieldPath, new Set());
    rendered +=
      selection.kind === 'leaf'
        ? `${indent}${name}\n`
        : `${indent}${name} {\n${renderObject(selection.object, childContext, level + 1, indentLevel + 1, fieldPath)}${indent}}\n`;
  }
  return rendered;
}

const resolveMaxDepth = (maxDepth: number | undefined): number => {
  if (maxDepth === undefined) {
    return DEFAULT_MAX_DEPTH;
  }
  if (!Number.isInteger(maxDepth) || maxDepth < 0) {
    throw new GQLSchemaError([], `maxDepth must be a non-negative integer, got ${maxDepth}`);
  }
  return maxDepth;
};

/**
 * Render the selection set of `schema`, one field per line at `indentLevel`. Every error names the field
 * path, prefixed with `rootPath`. `maxDepth` bounds how many selection sets may nest below `schema`'s own;
 * a deeper object throws rather than being cut off, since a cut-off object would leave an empty `{}`.
 */
export const renderSelectionSet = (
  schema: ObjectSchema,
  maxDepth: number | undefined,
  indentLevel: number,
  rootPath: readonly string[],
): string => renderObject(schema, { maxDepth: resolveMaxDepth(maxDepth), ancestors: new Map() }, 0, indentLevel, rootPath);
