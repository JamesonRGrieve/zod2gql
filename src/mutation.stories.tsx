import { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import { z } from 'zod';
import { GQLType, ToGQLOptions } from './index';
import { createMutation } from './mutation';

/**
 * GraphQL Mutation Generation
 *
 * This component demonstrates how to generate GraphQL mutations from Zod schemas.
 *
 * @see ../docs/Mutations.mdx for detailed documentation
 * @see ../docs/AdvancedUsage.mdx for advanced input type handling
 */

// Import Zod schema and GQL converter
import './index';
import './mutation';

// Component to display GQL mutation
const MutationDisplay = ({
  schema,
  options,
  expectedOutput,
}: {
  schema: z.ZodObject<any> | z.ZodArray<any>;
  options?: ToGQLOptions;
  expectedOutput?: string;
}) => {
  const mutation =
    typeof schema.toGQL === 'function'
      ? schema.toGQL(GQLType.Mutation, options)
      : createMutation(schema as z.ZodObject<any>, options);

  return (
    <div>
      <h3>Generated GraphQL Mutation</h3>
      <pre data-testid='mutation-output'>{mutation}</pre>
      {expectedOutput && (
        <>
          <h3>Expected Output</h3>
          <pre data-testid='expected-output'>{expectedOutput}</pre>
        </>
      )}
    </div>
  );
};

type MutationStoryArgs = {
  schema: z.ZodObject<any> | z.ZodArray<any>;
  options?: ToGQLOptions;
  expectedOutput?: string;
};

const meta: Meta<typeof MutationDisplay> = {
  title: 'GraphQL/Mutation',
  component: MutationDisplay,
  parameters: {
    docs: {
      description: {
        component:
          'Generate GraphQL mutations from Zod schemas. See the [Mutations documentation](/?path=/docs/documentation-mutations--docs) for more details.',
      },
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MutationDisplay>;

// ========== SCHEMA DEFINITIONS ==========

// Basic schemas
const addressSchema = z
  .object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string().optional(),
  })
  .describe('Address');

// Response schemas
const createUserResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    createdAt: z.string(),
  })
  .describe('CreateUserResponse');

const updateUserResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    age: z.number().optional(),
    isActive: z.boolean().optional(),
    updatedAt: z.string(),
  })
  .describe('UpdateUserResponse');

const userSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    age: z.number().optional(),
    isActive: z.boolean().optional(),
    address: addressSchema.optional(),
  })
  .describe('User');

// Post schemas
const createPostResponseSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    authorId: z.string(),
    published: z.boolean(),
    createdAt: z.string(),
  })
  .describe('CreatePostResponse');

const updatePostResponseSchema = z
  .object({
    id: z.string(),
    title: z.string().optional(),
    content: z.string().optional(),
    published: z.boolean().optional(),
    updatedAt: z.string(),
  })
  .describe('UpdatePostResponse');

// Comment schemas
const createCommentResponseSchema = z
  .object({
    id: z.string(),
    text: z.string(),
    authorId: z.string(),
    postId: z.string(),
    createdAt: z.string(),
  })
  .describe('CreateCommentResponse');

// Complex schemas
const productSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    categories: z.array(z.string()),
    attributes: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
    stockQuantity: z.number(),
    isAvailable: z.boolean(),
    createdAt: z.string(),
  })
  .describe('Product');

const orderItemSchema = z
  .object({
    productId: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
  })
  .describe('OrderItem');

const createOrderResponseSchema = z
  .object({
    id: z.string(),
    customerId: z.string(),
    items: z.array(orderItemSchema),
    totalAmount: z.number(),
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    shippingAddressId: z.string(),
    billingAddressId: z.string(),
    createdAt: z.string(),
  })
  .describe('CreateOrderResponse');

// ========== STORY TESTS ==========

// Simple Create User Mutation
export const CreateUserMutation: Story = {
  args: {
    schema: createUserResponseSchema,
    options: {
      operationName: 'CreateUser',
      variables: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'secret123',
      },
    },
    expectedOutput: `mutation CreateUser($name: String!, $email: String!, $password: String!) {
  createUserResponse(name: $name, email: $email, password: $password) {
    id
    name
    email
    createdAt
  }
}`,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Get the generated output
    const mutationOutput = canvas.getByTestId('mutation-output');
    const expectedOutput = canvas.getByTestId('expected-output');

    // Normalize strings (remove whitespace) for comparison
    const normalizeString = (str: string) => str.replace(/\s+/g, '');

    expect(normalizeString(mutationOutput.textContent || '')).toBe(normalizeString(expectedOutput.textContent || ''));
  },
};

// New: Bulk create users mutation with array schema
export const BulkCreateUsersMutation: Story = {
  args: {
    schema: z.array(createUserResponseSchema),
    options: {
      variables: {
        users: [
          {
            name: 'John Doe',
            email: 'john@example.com',
          },
          {
            name: 'Jane Smith',
            email: 'jane@example.com',
          },
        ],
      },
      inputTypeMap: {
        users: '[UserInput!]',
      },
    },
    expectedOutput: `mutation($users: [UserInput!]!) {
  createUserResponses(users: $users) {
    id
    name
    email
    createdAt
  }
}`,
  },
  parameters: {
    docs: {
      description: {
        story: 'A bulk mutation using array schema for automatic pluralization of the field name.',
      },
      source: { type: 'code' },
    },
  },
};

// New: Bulk delete mutation with array schema
export const BulkDeleteUsersMutation: Story = {
  args: {
    schema: z.array(userSchema),
    options: {
      operationName: 'DeleteUsers',
      variables: {
        ids: ['user1', 'user2', 'user3'],
      },
    },
    expectedOutput: `mutation DeleteUsers($ids: [String!]!) {
  deleteUsers(ids: $ids) {
    id
    name
    email
    age
    isActive
    address {
      street
      city
      state
      zipCode
      country
    }
  }
}`,
  },
  parameters: {
    docs: {
      description: {
        story: 'A bulk deletion mutation with array schema and explicit operation name.',
      },
      source: { type: 'code' },
    },
  },
};

// Update User Mutation
export const UpdateUserMutation: Story = {
  args: {
    schema: updateUserResponseSchema,
    options: {
      operationName: 'UpdateUser',
      variables: {
        id: 'user123',
        name: 'John Updated',
        email: 'john.updated@example.com',
        isActive: true,
      },
    },
    expectedOutput: `mutation UpdateUser($id: String!, $name: String!, $email: String!, $isActive: Boolean!) {
  updateUserResponse(id: $id, name: $name, email: $email, isActive: $isActive) {
    id
    name
    email
    age
    isActive
    updatedAt
  }
}`,
  },
};

// Create Post Mutation
export const CreatePostMutation: Story = {
  args: {
    schema: createPostResponseSchema,
    options: {
      operationName: 'CreatePost',
      variables: {
        title: 'My First Post',
        content: 'This is the content of my first post',
        authorId: 'user123',
        published: true,
      },
    },
    expectedOutput: `mutation CreatePost($title: String!, $content: String!, $authorId: String!, $published: Boolean!) {
  createPostResponse(title: $title, content: $content, authorId: $authorId, published: $published) {
    id
    title
    content
    authorId
    published
    createdAt
  }
}`,
  },
};

// New: Bulk create posts mutation with array schema
export const BulkCreatePostsMutation: Story = {
  args: {
    schema: z.array(createPostResponseSchema),
    options: {
      variables: {
        posts: [
          {
            title: 'First Post',
            content: 'Content of first post',
            authorId: 'user123',
            published: true,
          },
          {
            title: 'Second Post',
            content: 'Content of second post',
            authorId: 'user123',
            published: false,
          },
        ],
      },
    },
    expectedOutput: `mutation($posts: [PostsInput!]!) {
  createPostResponses(posts: $posts) {
    id
    title
    content
    authorId
    published
    createdAt
  }
}`,
  },
};

// Update Post Mutation
export const UpdatePostMutation: Story = {
  args: {
    schema: updatePostResponseSchema,
    options: {
      operationName: 'UpdatePost',
      variables: {
        id: 'post123',
        title: 'Updated Post Title',
        published: true,
      },
    },
    expectedOutput: `mutation UpdatePost($id: String!, $title: String!, $published: Boolean!) {
  updatePostResponse(id: $id, title: $title, published: $published) {
    id
    title
    content
    published
    updatedAt
  }
}`,
  },
};

// Create Comment Mutation
export const CreateCommentMutation: Story = {
  args: {
    schema: createCommentResponseSchema,
    options: {
      operationName: 'CreateComment',
      variables: {
        text: 'This is my comment',
        postId: 'post123',
        authorId: 'user123',
      },
    },
    expectedOutput: `mutation CreateComment($text: String!, $postId: String!, $authorId: String!) {
  createCommentResponse(text: $text, postId: $postId, authorId: $authorId) {
    id
    text
    authorId
    postId
    createdAt
  }
}`,
  },
};

// Mutation with complex input types
export const CreateProductWithInputTypes: Story = {
  args: {
    schema: productSchema,
    options: {
      operationName: 'CreateProduct',
      variables: {
        productInput: {
          name: 'New Product',
          description: 'Product description',
          price: 99.99,
          categories: ['electronics', 'gadgets'],
          attributes: { color: 'black', weight: 150 },
        },
      },
      inputTypeMap: {
        productInput: 'ProductInput',
      },
    },
    expectedOutput: `mutation CreateProduct($productInput: ProductInput!) {
  product(productInput: $productInput) {
    id
    name
    description
    price
    categories
    attributes
    stockQuantity
    isAvailable
    createdAt
  }
}`,
  },
};

// Complex Order Creation with nested inputs
export const CreateOrderWithNestedInput: Story = {
  args: {
    schema: createOrderResponseSchema,
    options: {
      operationName: 'CreateOrder',
      variables: {
        order: {
          customerId: 'cust123',
          items: [
            { productId: 'prod1', quantity: 2, unitPrice: 10.99 },
            { productId: 'prod2', quantity: 1, unitPrice: 24.99 },
          ],
          shippingAddress: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'ST',
            zipCode: '12345',
          },
          billingAddress: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'ST',
            zipCode: '12345',
          },
        },
      },
      inputTypeMap: {
        order: 'OrderInput',
      },
    },
    expectedOutput: `mutation CreateOrder($order: OrderInput!) {
  createOrderResponse(order: $order) {
    id
    customerId
    items {
      productId
      quantity
      unitPrice
    }
    totalAmount
    status
    shippingAddressId
    billingAddressId
    createdAt
  }
}`,
  },
};

// Multiple inputs with automatic type inference
export const UpdateProductWithMultipleInputs: Story = {
  args: {
    schema: productSchema,
    options: {
      operationName: 'UpdateProduct',
      variables: {
        id: 'prod123',
        productData: {
          name: 'Updated Product',
          price: 129.99,
        },
        stockData: {
          quantity: 50,
          isAvailable: true,
        },
      },
    },
    expectedOutput: `mutation UpdateProduct($id: String!, $productData: ProductDataInput!, $stockData: StockDataInput!) {
  product(id: $id, productData: $productData, stockData: $stockData) {
    id
    name
    description
    price
    categories
    attributes
    stockQuantity
    isAvailable
    createdAt
  }
}`,
  },
};

// Inferred mutation name
export const InferredMutationName: Story = {
  args: {
    schema: userSchema,
    options: {
      variables: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    },
    expectedOutput: `mutation($name: String!, $email: String!) {
  user(name: $name, email: $email) {
    id
    name
    email
    age
    isActive
    address {
      street
      city
      state
      zipCode
      country
    }
  }
}`,
  },
};

// Limited depth mutation
export const LimitedDepthMutation: Story = {
  args: {
    schema: userSchema,
    options: {
      operationName: 'CreateUser',
      variables: {
        userData: {
          name: 'John Doe',
          email: 'john@example.com',
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'ST',
            zipCode: '12345',
          },
        },
      },
      maxDepth: 3,
    },
    expectedOutput: `mutation CreateUser($userData: UserDataInput!) {
  user(userData: $userData) {
    id
    name
    email
    age
    isActive
    address {
      street
      city
      state
      zipCode
      country
    }
  }
}`,
  },
};
