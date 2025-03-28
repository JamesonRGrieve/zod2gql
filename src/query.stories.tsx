import { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import { z } from 'zod';
import { GQLType, ToGQLOptions } from './index';
import { createQuery } from './query';

// Import Zod schema and GQL converter
import './index';
import './query';

// Add a name to a Zod object schema for type inference testing
const withTypeName = (schema: z.ZodObject<any>, name: string): z.ZodObject<any> => {
  (schema as any)._def.typeName = name;
  return schema;
};

// Component to display GQL query
const QueryDisplay = ({ 
  schema, 
  options,
  expectedOutput 
}: { 
  schema: z.ZodObject<any>;
  options?: ToGQLOptions;
  expectedOutput?: string;
}) => {
  const query = createQuery(schema, options);
  
  return (
    <div>
      <h3>Generated GraphQL Query</h3>
      <pre data-testid="query-output">{query}</pre>
      {expectedOutput && (
        <>
          <h3>Expected Output</h3>
          <pre data-testid="expected-output">{expectedOutput}</pre>
        </>
      )}
    </div>
  );
};

type QueryStoryArgs = {
  schema: z.ZodObject<any>;
  options?: ToGQLOptions;
  expectedOutput?: string;
};

const meta: Meta<typeof QueryDisplay> = {
  title: 'GraphQL/Query',
  component: QueryDisplay,
};

export default meta;
type Story = StoryObj<typeof QueryDisplay>;

// Sample schemas with type names
const userSchema = withTypeName(z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  age: z.number(),
  isActive: z.boolean(),
}), 'User');

const postSchema = withTypeName(z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  author: userSchema,
  comments: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      user: userSchema,
    })
  ),
  tags: z.array(z.string()),
}), 'Post');

// Nested schema with circular reference
const categorySchema = withTypeName(z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
}), 'Category');

const productSchema = withTypeName(z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string().optional(),
  category: categorySchema,
  relatedProducts: z.lazy(() => z.array(productSchema)),
}), 'Product');

// Simple Query Test with explicit operation name
export const SimpleQuery: Story = {
  args: {
    schema: userSchema,
    options: {
      operationName: 'GetUser',
      variables: { id: '123' }
    },
    expectedOutput: `query GetUser($id: String!) {
  user(id: $id) {
    id
    name
    email
    age
    isActive
  }
}`
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Get the generated output
    const queryOutput = canvas.getByTestId('query-output');
    const expectedOutput = canvas.getByTestId('expected-output');
    
    // Normalize strings (remove whitespace) for comparison
    const normalizeString = (str: string) => str.replace(/\s+/g, '');
    
    expect(normalizeString(queryOutput.textContent || '')).toBe(
      normalizeString(expectedOutput.textContent || '')
    );
  },
};

// Complex Query with Nested Objects
export const ComplexQuery: Story = {
  args: {
    schema: postSchema,
    options: {
      operationName: 'GetPost',
      variables: { id: 'post123' }
    },
    expectedOutput: `query GetPost($id: String!) {
  post(id: $id) {
    id
    title
    content
    author {
      id
      name
      email
      age
      isActive
    }
    comments {
      id
      text
      user {
        id
        name
        email
        age
        isActive
      }
    }
    tags
  }
}`
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const queryOutput = canvas.getByTestId('query-output');
    const expectedOutput = canvas.getByTestId('expected-output');
    
    const normalizeString = (str: string) => str.replace(/\s+/g, '');
    
    expect(normalizeString(queryOutput.textContent || '')).toBe(
      normalizeString(expectedOutput.textContent || '')
    );
  },
};

// Query with Circular References
export const CircularQuery: Story = {
  args: {
    schema: productSchema,
    options: {
      operationName: 'GetProduct',
      variables: { id: 'product123' }
    },
    expectedOutput: `query GetProduct($id: String!) {
  product(id: $id) {
    id
    name
    price
    description
    category {
      id
      name
      description
    }
    relatedProducts {
      id
      name
      price
      description
      category {
        id
        name
        description
      }
    }
  }
}`
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const queryOutput = canvas.getByTestId('query-output');
    const expectedOutput = canvas.getByTestId('expected-output');
    
    const normalizeString = (str: string) => str.replace(/\s+/g, '');
    
    expect(normalizeString(queryOutput.textContent || '')).toBe(
      normalizeString(expectedOutput.textContent || '')
    );
  },
};

// Test with inferred query operation name
export const InferredQueryOperation: Story = {
  args: {
    schema: userSchema,
    options: {
      variables: { id: '123' }
    },
    expectedOutput: `query($id: String!) {
  user(id: $id) {
    id
    name
    email
    age
    isActive
  }
}`
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const queryOutput = canvas.getByTestId('query-output');
    const expectedOutput = canvas.getByTestId('expected-output');
    
    const normalizeString = (str: string) => str.replace(/\s+/g, '');
    
    expect(normalizeString(queryOutput.textContent || '')).toBe(
      normalizeString(expectedOutput.textContent || '')
    );
  },
};

// Test with custom maxDepth
export const LimitedDepthQuery: Story = {
  args: {
    schema: postSchema,
    options: {
      variables: { id: 'post123' },
      maxDepth: 3 // Limit depth
    },
    expectedOutput: `query($id: String!) {
  post(id: $id) {
    id
    title
    content
    author {
      id
      name
      email
      age
      isActive
    }
    comments {
      id
      text
      user
    }
    tags
  }
}`
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const queryOutput = canvas.getByTestId('query-output');
    const expectedOutput = canvas.getByTestId('expected-output');
    
    const normalizeString = (str: string) => str.replace(/\s+/g, '');
    
    expect(normalizeString(queryOutput.textContent || '')).toBe(
      normalizeString(expectedOutput.textContent || '')
    );
  },
};