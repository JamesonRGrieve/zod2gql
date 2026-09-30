// SPDX-License-Identifier: AGPL-3.0-or-later
import { z } from 'zod';
import { GQLSchemaError, assertGraphQLName } from './errors';

type Schema = z.core.$ZodType;
type ObjectSchema = z.core.$ZodObject;

/** Nesting allowed below the rendered object when the caller sets no `maxDepth`. */
const DEFAULT_MAX_DEPTH = 10;

const INDENT = '  ';

/**
 * What a field contributes to a selection set: nothing below it, or the merged fields of one or more
 * object schemas (more than one when an intersection combines objects).
 */
type FieldSelection = { readonly kind: 'leaf' } | { readonly kind: 'object'; readonly objects: readonly ObjectSchema[] };

const LEAF: FieldSelection = { kind: 'leaf' };

/**
 * Types selected by name alone. Scalars, enums and literals map to GraphQL scalars and enums (a date or bigint
 * to whatever custom scalar the server exposes); records, maps, `any`, `unknown` and `z.custom` stand for an
 * opaque JSON-style scalar, since GraphQL cannot select inside a map.
 */
const LEAF_TYPES = [
  z.core.$ZodString,
  z.core.$ZodNumber,
  z.core.$ZodBoolean,
  z.core.$ZodBigInt,
  z.core.$ZodDate,
  z.core.$ZodEnum,
  z.core.$ZodLiteral,
  z.core.$ZodTemplateLiteral,
  z.core.$ZodSuccess,
  z.core.$ZodRecord,
  z.core.$ZodMap,
  z.core.$ZodAny,
  z.core.$ZodUnknown,
  z.core.$ZodCustom,
  z.core.$ZodUnion,
];

const isLeafType = (schema: Schema): boolean => LEAF_TYPES.some((type) => schema instanceof type);

interface RenderContext {
  readonly maxDepth: number;
  /** Object schemas being selected on the current path, each with the path it was entered at. */
  readonly ancestors: ReadonlyMap<ObjectSchema, readonly string[]>;
}

const describePath = (path: readonly string[]): string => (path.length > 0 ? path.join('.') : 'the root');

/** The schema a wrapper stands for, when `schema` only wraps another schema; `undefined` otherwise. */
const innerSchema = (schema: Schema): Schema | undefined => {
  if (
    schema instanceof z.core.$ZodOptional ||
    schema instanceof z.core.$ZodNullable ||
    schema instanceof z.core.$ZodNonOptional ||
    schema instanceof z.core.$ZodDefault ||
    schema instanceof z.core.$ZodPrefault ||
    schema instanceof z.core.$ZodCatch ||
    schema instanceof z.core.$ZodReadonly ||
    schema instanceof z.core.$ZodPromise
  ) {
    return schema._zod.def.innerType;
  }
  if (schema instanceof z.core.$ZodLazy) {
    return schema._zod.innerType;
  }
  if (schema instanceof z.core.$ZodPipe) {
    // The selection follows what the server sends, which is the pipe's input. A preprocess pipe's input
    // is an arbitrary transform, so there the output schema is the only description of the data.
    const { in: input, out: output } = schema._zod.def;
    return input instanceof z.core.$ZodTransform ? output : input;
  }
  return undefined;
};

/** Merge what two schemas select for the same field (both sides of an intersection, or a key both declare). */
const combineSelections = (left: FieldSelection, right: FieldSelection, path: readonly string[]): FieldSelection => {
  if (left.kind === 'leaf' && right.kind === 'leaf') {
    return LEAF;
  }
  if (left.kind === 'object' && right.kind === 'object') {
    return { kind: 'object', objects: [...left.objects, ...right.objects] };
  }
  throw new GQLSchemaError(path, 'intersection combines an object with a non-object, which no selection can satisfy');
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
    return { kind: 'object', objects: [schema] };
  }
  if (schema instanceof z.core.$ZodArray) {
    return resolveField(schema._zod.def.element, path, next);
  }
  if (schema instanceof z.core.$ZodSet) {
    return resolveField(schema._zod.def.valueType, path, next);
  }
  if (schema instanceof z.core.$ZodIntersection) {
    const { left, right } = schema._zod.def;
    return combineSelections(resolveField(left, path, next), resolveField(right, path, next), path);
  }
  if (schema instanceof z.core.$ZodTuple) {
    const { items, rest } = schema._zod.def;
    const members = rest === null ? items : [...items, rest];
    if (members.every((member) => resolveField(member, path, next).kind === 'leaf')) {
      return LEAF;
    }
    throw new GQLSchemaError(path, 'a tuple containing objects has no GraphQL form; GraphQL lists hold one type');
  }
  if (isLeafType(schema)) {
    return LEAF;
  }
  throw new GQLSchemaError(path, `zod type "${schema._zod.def.type}" has no GraphQL representation`);
};

/** The fields of one or more object schemas, merged by name; a name declared twice has its selections combined. */
const mergeFields = (objects: readonly ObjectSchema[], path: readonly string[]): Map<string, FieldSelection> => {
  const fields = new Map<string, FieldSelection>();
  for (const object of objects) {
    for (const [name, fieldSchema] of Object.entries(object._zod.def.shape)) {
      const fieldPath = [...path, name];
      assertGraphQLName(name, 'field', fieldPath);
      const selection = resolveField(fieldSchema, fieldPath, new Set());
      const existing = fields.get(name);
      fields.set(name, existing === undefined ? selection : combineSelections(existing, selection, fieldPath));
    }
  }
  return fields;
};

function renderObjects(
  objects: readonly ObjectSchema[],
  context: RenderContext,
  level: number,
  indentLevel: number,
  path: readonly string[],
): string {
  const ancestors = new Map(context.ancestors);
  for (const object of objects) {
    const enteredAt = context.ancestors.get(object);
    if (enteredAt !== undefined) {
      throw new GQLSchemaError(
        path,
        `circular reference: this object schema is already selected at ${describePath(enteredAt)}; GraphQL selections are finite, so select a non-recursive projection`,
      );
    }
    ancestors.set(object, path);
  }
  if (level > context.maxDepth) {
    throw new GQLSchemaError(
      path,
      `selection nests deeper than maxDepth (${context.maxDepth}); raise maxDepth or select fewer levels`,
    );
  }
  const fields = mergeFields(objects, path);
  if (fields.size === 0) {
    throw new GQLSchemaError(path, 'object has no fields, and a GraphQL selection set cannot be empty');
  }

  const childContext: RenderContext = { ...context, ancestors };
  const indent = INDENT.repeat(indentLevel);
  let rendered = '';
  for (const [name, selection] of fields) {
    rendered +=
      selection.kind === 'leaf'
        ? `${indent}${name}\n`
        : `${indent}${name} {\n${renderObjects(selection.objects, childContext, level + 1, indentLevel + 1, [...path, name])}${indent}}\n`;
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
): string =>
  renderObjects([schema], { maxDepth: resolveMaxDepth(maxDepth), ancestors: new Map() }, 0, indentLevel, rootPath);
