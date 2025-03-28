import { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import { z } from 'zod';
import { GQLType, ToGQLOptions } from './index';
import { createMutation } from './mutation';

// Import Zod schema and GQL converter
import './index';
import './mutation';

// Add a name to a Zod object schema for type inference testing
const withTypeName = (schema: z.ZodObject<any>, name: string): z.ZodObject<any> => {
  (schema as any)._def.typeName = name;
  return schema;
};

// Component to display GQL mutation
const MutationDisplay = ({ 
  schema, 
  options,
  expectedOutput 
}: { 
  schema: z.ZodObject<any>;
  options?: ToGQLOptions;
  expectedOutput?: string;
}) => {
  const mutation = createMutation(schema, options);
  
  return (
    <div>
      <h3>Generated GraphQL Mutation</h3>
      <pre data-testid="mutation-output">{mutation}</pre>
      {expectedOutput && (
        <>
          <h3>Expected Output</h3>
          <pre data-testid="expected-output">{expectedOutput}</pre>
        </>
      )}
    </div>
  );
};

type MutationStoryArgs = {
  schema: z.ZodObject<any>;
  options?: ToGQLOptions;
  expectedOutput?: string;
};

const meta: Meta<typeof MutationDisplay> = {
  title: 'GraphQL/Mutation',
  component: MutationDisplay,
};

export default meta;
type Story = StoryObj<typeof MutationDisplay>;

// Sample schemas with type names
const userSchema = withTypeName(z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  age: z.number(),
  isActive: z.boolean(),
}), 'User');

const createUserResponseSchema = withTypeName(z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string(),
}), 'CreateUserResponse');

const postSchema = withTypeName(z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
  author: userSchema,
}), 'Post');

// Simple Mutation Test
export const CreateUser: Story = {
  args: {
    schema: createUserResponseSchema,
    options: {
      operationName: 'CreateUser',
      variables: { 
        name: 'John Doe',
        email: 'john@example.com',
        password: 'secret123'
      }
    },
    expectedOutput: `mutation CreateUser($name: String!, $email: String!, $password: String!) {
  createUser(name: $name, email: $email, password: $password) {
    id
    name
    email
    createdAt
  }
}`
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Get the generated output
    const mutationOutput = canvas.getByTestId('mutation-output');
    const expectedOutput = canvas.getByTestId('expected-output');
    
    // Normalize strings (remove whitespace) for comparison
    const normalizeString = (str: string) => str.replace(/\s+/g, '');
    
    expect(normalizeString(mutationOutput.textContent || '')).toBe(
      normalizeString(expectedOutput.textContent || '')
    );
  },
};

// Complex Mutation with Input Types
export const CreatePostWithInputTypes: Story = {
  args: {
    schema: postSchema,
    options: {
      operationName: 'CreatePost',
      variables: {
        post: { title: 'New Post', content: 'Content', authorId: '123' }
      },
      inputTypeMap: {
        post: 'PostInput'
      }
    },
    expectedOutput: `mutation CreatePost($post: PostInput!) {
  createPost(post: $post) {
    id
    title
    content
    published
    author {
      id
      name
      email
      age
      isActive
    }
  }
}`
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const mutationOutput = canvas.getByTestId('mutation-output');
    const expectedOutput = canvas.getByTestId('expected-output');
    
    const normalizeString = (str: string) => str.replace(/\s+/g, '');
    
    expect(normalizeString(mutationOutput.textContent || '')).toBe(
      normalizeString(expectedOutput.textContent || '')
    );
  },
};

// Update Mutation
export const UpdateUser: Story = {
  args: {
    schema: userSchema,
    options: {
      operationName: 'UpdateUser',
      variables: {
        id: 'user123',
        name: 'Updated Name',
        email: 'updated@example.com',
        isActive: true
      }
    },
    expectedOutput: `mutation UpdateUser($id: String!, $name: String!, $email: String!, $isActive: Boolean!) {
  updateUser(id: $id, name: $name, email: $email, isActive: $isActive) {
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
    
    const mutationOutput = canvas.getByTestId('mutation-output');
    const expectedOutput = canvas.getByTestId('expected-output');
    
    const normalizeString = (str: string) => str.replace(/\s+/g, '');
    
    expect(normalizeString(mutationOutput.textContent || '')).toBe(
      normalizeString(expectedOutput.textContent || '')
    );
  },
};

// Test with inferred mutation field name
export const InferredMutationOperation: Story = {
  args: {
    schema: postSchema,
    options: {
      variables: { 
        title: 'New Post', 
        content: 'Content', 
        authorId: '123' 
      }
    },
    expectedOutput: `mutation($title: String!, $content: String!, $authorId: String!) {
  post(title: $title, content: $content, authorId: $authorId) {
    id
    title
    content
    published
    author {
      id
      name
      email
      age
      isActive
    }
  }
}`
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const mutationOutput = canvas.getByTestId('mutation-output');
    const expectedOutput = canvas.getByTestId('expected-output');
    
    const normalizeString = (str: string) => str.replace(/\s+/g, '');
    
    expect(normalizeString(mutationOutput.textContent || '')).toBe(
      normalizeString(expectedOutput.textContent || '')
    );
  },
};