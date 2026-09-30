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

describe('renderSelectionSet: leaf types', () => {
  it.each([
    ['string', z.string()],
    ['email format', z.email()],
    ['int', z.int()],
    ['number', z.number()],
    ['boolean', z.boolean()],
    ['bigint', z.bigint()],
    ['date', z.date()],
    ['enum', z.enum(['A', 'B'])],
    ['literal', z.literal('fixed')],
    ['numeric literal', z.literal(3)],
    ['template literal', z.templateLiteral(['id-', z.number()])],
    ['record', z.record(z.string(), z.object({ id: z.string() }))],
    ['map', z.map(z.string(), z.number())],
    ['any', z.any()],
    ['unknown', z.unknown()],
    ['custom', z.custom<{ bytes: number }>()],
    ['instanceof', z.instanceof(Error)],
    ['branded', z.string().brand<'UserId'>()],
    ['array of scalars', z.array(z.string())],
    ['set of scalars', z.set(z.number())],
    ['tuple of scalars', z.tuple([z.number(), z.number()])],
    ['tuple with a rest', z.tuple([z.string()], z.number())],
    ['intersection of scalars', z.intersection(z.string(), z.string().min(1))],
  ])('selects a %s field by name', (_label, fieldSchema) => {
    expect(render(z.object({ value: fieldSchema }))).toBe('value\n');
  });
});

describe('renderSelectionSet: wrappers', () => {
  const Team = z.object({ id: z.string() });

  it.each([
    ['default', Team.default({ id: 'none' })],
    ['prefault', Team.prefault({ id: 'none' })],
    ['catch', Team.catch({ id: 'none' })],
    ['readonly', Team.readonly()],
    ['nonoptional', Team.optional().nonoptional()],
    ['promise', z.promise(Team)],
    ['transform', Team.transform((team) => team.id)],
    ['pipe', Team.pipe(z.object({ id: z.string() }))],
    ['preprocess', z.preprocess((raw) => raw, Team)],
    ['set', z.set(Team)],
    ['lazy', z.lazy(() => Team)],
  ])('selects through %s to the object', (_label, fieldSchema) => {
    expect(render(z.object({ team: fieldSchema }))).toBe('team {\n  id\n}\n');
  });

  it('unwraps a defaulted scalar to a plain field', () => {
    expect(render(z.object({ count: z.number().default(0), tag: z.literal('x').catch('x') }))).toBe('count\ntag\n');
  });

  it('merges the fields of intersected objects', () => {
    const Named = z.object({ name: z.string(), owner: z.object({ id: z.string() }) });
    const Dated = z.object({ createdAt: z.date(), owner: z.object({ email: z.string() }) });
    expect(render(z.object({ doc: z.intersection(Named, Dated) }))).toBe(
      'doc {\n  name\n  owner {\n    id\n    email\n  }\n  createdAt\n}\n',
    );
  });
});

describe('renderSelectionSet: unsupported types', () => {
  it.each([
    ['nan', z.nan()],
    ['void', z.void()],
    ['undefined', z.undefined()],
    ['never', z.never()],
    ['null', z.null()],
    ['symbol', z.symbol()],
    ['file', z.file()],
    ['transform', z.transform((raw: string) => raw.length)],
  ])('rejects a %s field with a descriptive error', (type, fieldSchema) => {
    expect(() => render(z.object({ id: z.string(), bad: fieldSchema }))).toThrow(
      `zod2gql: root.bad: zod type "${type}" has no GraphQL representation`,
    );
  });

  it('rejects an unsupported type nested inside a wrapper', () => {
    expect(() => render(z.object({ bad: z.array(z.never()).optional() }))).toThrow('zod type "never"');
  });

  it('rejects a tuple that contains an object', () => {
    expect(() => render(z.object({ pair: z.tuple([z.string(), z.object({ id: z.string() })]) }))).toThrow(
      'zod2gql: root.pair: a tuple containing objects has no GraphQL form',
    );
  });

  it('rejects an intersection of an object with a scalar', () => {
    expect(() => render(z.object({ odd: z.intersection(z.object({ id: z.string() }), z.string()) }))).toThrow(
      'zod2gql: root.odd: intersection combines incompatible types (object and leaf)',
    );
  });
});

describe('renderSelectionSet: unions', () => {
  const Cat = z.object({ kind: z.literal('cat'), meows: z.boolean() }).describe('Cat');
  const Dog = z.object({ kind: z.literal('dog'), owner: z.object({ name: z.string() }) }).describe('Dog');
  const catFragment = '  ... on Cat {\n    kind\n    meows\n  }\n';
  const dogFragment = '  ... on Dog {\n    kind\n    owner {\n      name\n    }\n  }\n';

  it('selects each object member through an inline fragment named by .describe()', () => {
    expect(render(z.object({ pet: z.union([Cat, Dog]) }))).toBe(`pet {\n${catFragment}${dogFragment}}\n`);
  });

  it('does the same for a discriminated union, including inside arrays', () => {
    const pets = z.array(z.discriminatedUnion('kind', [Cat, Dog]));
    expect(render(z.object({ pets }))).toBe(`pets {\n${catFragment}${dogFragment}}\n`);
  });

  it('indents fragments relative to the field', () => {
    expect(renderSelectionSet(z.object({ pet: z.union([Cat, Dog]) }), undefined, 1, [])).toBe(
      `  pet {\n  ${catFragment.replaceAll('\n  ', '\n    ')}  ${dogFragment.replaceAll('\n  ', '\n    ')}  }\n`,
    );
  });

  it('flattens nested unions', () => {
    const Bird = z.object({ sings: z.boolean() }).describe('Bird');
    expect(render(z.object({ pet: z.union([z.union([Cat, Dog]), Bird]) }))).toBe(
      `pet {\n${catFragment}${dogFragment}  ... on Bird {\n    sings\n  }\n}\n`,
    );
  });

  it('names a member from its described wrapper, or from the object inside an undescribed wrapper', () => {
    const Anonymous = z.object({ id: z.string() });
    const out = render(z.object({ node: z.union([Anonymous.readonly().describe('Alpha'), Cat.readonly()]) }));
    expect(out).toBe(`node {\n  ... on Alpha {\n    id\n  }\n${catFragment}}\n`);
  });

  it('treats null and undefined members as nullability', () => {
    expect(render(z.object({ pet: z.union([Cat, z.null()]) }))).toBe('pet {\n  kind\n  meows\n}\n');
    expect(render(z.object({ pet: z.union([Cat, Dog, z.null(), z.undefined()]) }))).toBe(
      `pet {\n${catFragment}${dogFragment}}\n`,
    );
  });

  it('selects a scalar-only union by name, as before', () => {
    expect(render(z.object({ id: z.union([z.string(), z.number()]) }))).toBe('id\n');
  });

  it('requires a type name for every object member', () => {
    const Anonymous = z.object({ id: z.string() });
    expect(() => render(z.object({ pet: z.union([Cat, Anonymous]) }))).toThrow(
      "zod2gql: root.pet: unions need a type name per member for their inline fragments; name each object member with .describe('TypeName')",
    );
  });

  it('rejects a member type name that is not a GraphQL name', () => {
    const Bad = z.object({ id: z.string() }).describe('Big Dog');
    expect(() => render(z.object({ pet: z.union([Cat, Bad]) }))).toThrow(
      'union member type name "Big Dog" is not a valid GraphQL name',
    );
  });

  it('rejects two members with the same type name', () => {
    const OtherCat = z.object({ purrs: z.boolean() }).describe('Cat');
    expect(() => render(z.object({ pet: z.union([Cat, OtherCat]) }))).toThrow('union has two members named Cat');
  });

  it('rejects a union mixing objects and scalars', () => {
    expect(() => render(z.object({ pet: z.union([Cat, z.string()]) }))).toThrow(
      'zod2gql: root.pet: union mixes objects with scalars',
    );
  });

  it('rejects a union of nothing but null and undefined', () => {
    expect(() => render(z.object({ nothing: z.union([z.null(), z.undefined()]) }))).toThrow(
      'union has no members besides null and undefined',
    );
  });

  it('applies cycle detection inside fragments', () => {
    const Folder = z
      .object({
        name: z.string(),
        get entries() {
          return z.array(z.union([Folder, Cat]));
        },
      })
      .describe('Folder');
    expect(() => render(z.object({ root: Folder }))).toThrow('zod2gql: root.root.entries: circular reference');
  });

  it('counts fragment fields against maxDepth like any nested selection', () => {
    expect(() => render(z.object({ pet: z.union([Cat, Dog]) }), 1)).toThrow(
      'zod2gql: root.pet.owner: selection nests deeper than maxDepth (1)',
    );
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
