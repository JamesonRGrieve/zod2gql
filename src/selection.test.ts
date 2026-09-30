// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { GQLSchemaError } from './errors';
import { renderSelectionSet } from './selection';

const render = (schema: z.core.$ZodObject, maxDepth?: number): string => renderSelectionSet(schema, maxDepth, 0, ['root']);

describe('renderSelectionSet: shape', () => {
  it('indents from the given level', () => {
    expect(renderSelectionSet(z.object({ id: z.string() }), undefined, 2, [])).toBe('    id\n');
  });

  it('selects through optional, nullable and nested arrays', () => {
    const schema = z.object({
      grid: z
        .array(z.array(z.object({ x: z.number() })))
        .nullable()
        .optional(),
    });
    expect(render(schema)).toBe('grid {\n  x\n}\n');
  });

  it('allows the same object schema in sibling fields', () => {
    const Address = z.object({ city: z.string() });
    expect(render(z.object({ home: Address, work: Address }))).toBe('home {\n  city\n}\nwork {\n  city\n}\n');
  });
});

describe('renderSelectionSet: maxDepth', () => {
  const chain = z.object({ a: z.object({ b: z.object({ c: z.object({ x: z.string() }) }) }) });

  it('renders exactly maxDepth nested selection sets', () => {
    expect(render(chain, 3)).toBe('a {\n  b {\n    c {\n      x\n    }\n  }\n}\n');
  });

  it('throws a GQLSchemaError naming the first object past the limit', () => {
    expect(() => render(chain, 2)).toThrow(GQLSchemaError);
    expect(() => render(chain, 2)).toThrow('zod2gql: root.a.b.c: selection nests deeper than maxDepth (2)');
  });

  it('exposes the path on the error', () => {
    expect(() => render(chain, 0)).toThrow(expect.objectContaining({ path: ['root', 'a'] }));
  });

  it('never emits an empty selection for scalars at the limit', () => {
    expect(render(z.object({ id: z.string(), tags: z.array(z.string()) }), 0)).toBe('id\ntags\n');
  });

  it.each([-1, 1.5, Number.NaN])('rejects maxDepth %s', (maxDepth) => {
    expect(() => render(chain, maxDepth)).toThrow('maxDepth must be a non-negative integer');
  });
});

describe('renderSelectionSet: empty objects', () => {
  it('rejects an empty root object', () => {
    expect(() => render(z.object({}))).toThrow(
      'zod2gql: root: object has no fields, and a GraphQL selection set cannot be empty',
    );
  });

  it('rejects an empty nested object', () => {
    expect(() => render(z.object({ id: z.string(), meta: z.object({}) }))).toThrow(
      'zod2gql: root.meta: object has no fields',
    );
  });
});

interface Category {
  name: string;
  children: Category[];
}

describe('renderSelectionSet: circular references', () => {
  it('stops a z.lazy self-reference well before maxDepth', () => {
    const CategorySchema: z.ZodType<Category> = z.lazy(() =>
      z.object({ name: z.string(), children: z.array(CategorySchema) }),
    );
    const Tree = z.object({ root: CategorySchema });
    expect(() => render(Tree)).toThrow('zod2gql: root.root.children: circular reference');
  });

  it('reports where the cycle started', () => {
    const ListNode = z.object({
      id: z.string(),
      get next() {
        return ListNode.optional();
      },
    });
    expect(() => render(z.object({ head: ListNode }))).toThrow(
      'zod2gql: root.head.next: circular reference: this object schema is already selected at root.head',
    );
  });

  it('reports a cycle back to the rendered root', () => {
    const Person = z.object({
      name: z.string(),
      get friends() {
        return z.array(Person);
      },
    });
    expect(() => render(Person)).toThrow('zod2gql: root.friends: circular reference');
  });

  it('rejects a z.lazy that resolves to itself without reaching an object', () => {
    const Loop: z.ZodType = z.lazy(() => Loop);
    expect(() => render(z.object({ loop: Loop }))).toThrow(
      'zod2gql: root.loop: circular reference: the schema resolves to itself without reaching an object',
    );
  });

  it('selects a non-recursive z.lazy', () => {
    const Lazy = z.lazy(() => z.object({ id: z.string() }));
    expect(render(z.object({ item: Lazy }))).toBe('item {\n  id\n}\n');
  });
});
