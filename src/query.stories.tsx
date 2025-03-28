import { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import { z } from 'zod';
import { GQLType, ToGQLOptions } from './index';
import { createQuery } from './query';

// Import Zod schema and GQL converter
import './index';
import './query';

// Component to display GQL query
const QueryDisplay = ({
  schema,
  options,
  expectedOutput,
}: {
  schema: z.ZodObject<any> | z.ZodArray<any>;
  options?: ToGQLOptions;
  expectedOutput?: string;
}) => {
  const query =
    typeof schema.toGQL === 'function'
      ? schema.toGQL(GQLType.Query, options)
      : createQuery(schema as z.ZodObject<any>, options);

  return (
    <div>
      <h3>Generated GraphQL Query</h3>
      <pre data-testid='query-output'>{query}</pre>
      {expectedOutput && (
        <>
          <h3>Expected Output</h3>
          <pre data-testid='expected-output'>{expectedOutput}</pre>
        </>
      )}
    </div>
  );
};

type QueryStoryArgs = {
  schema: z.ZodObject<any> | z.ZodArray<any>;
  options?: ToGQLOptions;
  expectedOutput?: string;
};

const meta: Meta<typeof QueryDisplay> = {
  title: 'GraphQL/Query',
  component: QueryDisplay,
  parameters: {
    docs: {
      description: {
        component:
          'Generate GraphQL queries from Zod schemas. See the [Queries documentation](/?path=/docs/documentation-queries--docs) for more details.',
      },
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof QueryDisplay>;

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

const userSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    age: z.number(),
    isActive: z.boolean(),
    address: addressSchema.optional(),
  })
  .describe('User');

// Nested schemas
const commentSchema = z
  .object({
    id: z.string(),
    text: z.string(),
    author: userSchema,
    createdAt: z.string(),
    likes: z.number(),
    replies: z.array(z.lazy(() => commentSchema)).optional(),
  })
  .describe('Comment');

const postSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    author: userSchema,
    comments: z.array(commentSchema),
    tags: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string().optional(),
  })
  .describe('Post');

// Complex schemas with multi-level nesting
const permissionSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
  })
  .describe('Permission');

const roleSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    permissions: z.array(permissionSchema),
  })
  .describe('Role');

const departmentSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
  })
  .describe('Department');

const employeeSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    department: departmentSchema,
    supervisor: z.lazy(() => employeeSchema).optional(),
    subordinates: z.array(z.lazy(() => employeeSchema)).optional(),
    roles: z.array(roleSchema),
    address: addressSchema,
    hireDate: z.string(),
    salary: z.number(),
  })
  .describe('Employee');

// Complex schema with multiple circular references
const categorySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    parentCategory: z.lazy(() => categorySchema).optional(),
    subcategories: z.array(z.lazy(() => categorySchema)).optional(),
  })
  .describe('Category');

const productSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    category: categorySchema,
    relatedProducts: z.array(z.lazy(() => productSchema)).optional(),
    attributes: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
    stockQuantity: z.number(),
    isAvailable: z.boolean(),
  })
  .describe('Product');

const orderItemSchema = z
  .object({
    id: z.string(),
    product: productSchema,
    quantity: z.number(),
    unitPrice: z.number(),
    totalPrice: z.number(),
  })
  .describe('OrderItem');

const orderSchema = z
  .object({
    id: z.string(),
    customer: userSchema,
    items: z.array(orderItemSchema),
    totalAmount: z.number(),
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    shippingAddress: addressSchema,
    billingAddress: addressSchema,
    createdAt: z.string(),
    updatedAt: z.string().optional(),
    relatedOrders: z.array(z.lazy(() => orderSchema)).optional(),
  })
  .describe('Order');

// GraphQL schema with enums, unions, and other complex types
const mediaTypeEnum = z.enum(['image', 'video', 'document']);

const imageSchema = z
  .object({
    url: z.string(),
    width: z.number(),
    height: z.number(),
    format: z.string(),
  })
  .describe('Image');

const videoSchema = z
  .object({
    url: z.string(),
    duration: z.number(),
    format: z.string(),
    thumbnail: imageSchema.optional(),
  })
  .describe('Video');

const documentSchema = z
  .object({
    url: z.string(),
    title: z.string(),
    fileSize: z.number(),
    fileType: z.string(),
  })
  .describe('Document');

const mediaSchema = z
  .object({
    id: z.string(),
    type: mediaTypeEnum,
    title: z.string(),
    description: z.string().optional(),
    image: imageSchema.optional(),
    video: videoSchema.optional(),
    document: documentSchema.optional(),
    uploadedBy: userSchema,
    uploadedAt: z.string(),
    tags: z.array(z.string()).optional(),
  })
  .describe('Media');

// ========== STORY TESTS ==========

// Simple Query Test with explicit operation name
export const SimpleQuery: Story = {
  args: {
    schema: userSchema,
    options: {
      operationName: 'GetUser',
      variables: { id: '123' },
    },
    expectedOutput: `query GetUser($id: String!) {
  user(id: $id) {
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
        story: 'A simple GraphQL query with explicit operation name and variables.',
      },
      source: { type: 'code' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Get the generated output
    const queryOutput = canvas.getByTestId('query-output');
    const expectedOutput = canvas.getByTestId('expected-output');

    // Normalize strings (remove whitespace) for comparison
    const normalizeString = (str: string) => str.replace(/\s+/g, '');

    expect(normalizeString(queryOutput.textContent || '')).toBe(normalizeString(expectedOutput.textContent || ''));
  },
};

// New story: Array query with automatic pluralization
export const UsersArrayQuery: Story = {
  args: {
    schema: z.array(userSchema),
    options: {
      variables: { limit: 10, offset: 0 },
    },
    expectedOutput: `query($limit: Int!, $offset: Int!) {
  users(limit: $limit, offset: $offset) {
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
        story: 'A query using array schema for automatic pluralization of the field name.',
      },
      source: { type: 'code' },
    },
  },
};

// New story: Array query with explicit operation name
export const GetUsersExplicitNameQuery: Story = {
  args: {
    schema: z.array(userSchema),
    options: {
      operationName: 'GetUsers',
      variables: { limit: 10, offset: 0 },
    },
    expectedOutput: `query GetUsers($limit: Int!, $offset: Int!) {
  users(limit: $limit, offset: $offset) {
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
        story: 'An array query with an explicit operation name and automatic field name pluralization.',
      },
      source: { type: 'code' },
    },
  },
};

// New story: Complex array query (posts)
export const GetPostsArrayQuery: Story = {
  args: {
    schema: z.array(postSchema),
    options: {
      variables: { userId: 'user123', limit: 5 },
    },
    expectedOutput: `query($userId: String!, $limit: Int!) {
  posts(userId: $userId, limit: $limit) {
    id
    title
    content
    author {
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
    comments {
      id
      text
      author {
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
      createdAt
      likes
      replies {
        id
        text
        author {
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
        createdAt
        likes
        replies
      }
    }
    tags
    createdAt
    updatedAt
  }
}`,
  },
  parameters: {
    docs: {
      description: {
        story: 'A complex query using array schema with nested objects and automatic pluralization.',
      },
      source: { type: 'code' },
    },
  },
};

// Nested Query with Comments
export const NestedCommentsQuery: Story = {
  args: {
    schema: commentSchema,
    options: {
      operationName: 'GetComment',
      variables: { id: 'comment123' },
    },
    expectedOutput: `query GetComment($id: String!) {
  comment(id: $id) {
    id
    text
    author {
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
    createdAt
    likes
    replies {
      id
      text
      author {
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
      createdAt
      likes
      replies
    }
  }
}`,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A nested GraphQL query for comments with multiple levels of nested data structures including circular references.',
      },
      source: { type: 'code' },
    },
  },
};

// Complex Post Query with nested comments
export const PostWithCommentsQuery: Story = {
  args: {
    schema: postSchema,
    options: {
      operationName: 'GetPost',
      variables: { id: 'post123' },
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
      address {
        street
        city
        state
        zipCode
        country
      }
    }
    comments {
      id
      text
      author {
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
      createdAt
      likes
      replies {
        id
        text
        author {
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
        createdAt
        likes
        replies
      }
    }
    tags
    createdAt
    updatedAt
  }
}`,
  },
};

// Employee Query with circular references (supervisor and subordinates)
export const EmployeeWithCircularReferencesQuery: Story = {
  args: {
    schema: employeeSchema,
    options: {
      operationName: 'GetEmployee',
      variables: { id: 'emp123' },
    },
    expectedOutput: `query GetEmployee($id: String!) {
  employee(id: $id) {
    id
    name
    email
    department {
      id
      name
      description
    }
    supervisor {
      id
      name
      email
      department {
        id
        name
        description
      }
      supervisor
      subordinates
      roles {
        id
        name
        permissions {
          id
          name
          description
        }
      }
      address {
        street
        city
        state
        zipCode
        country
      }
      hireDate
      salary
    }
    subordinates {
      id
      name
      email
      department {
        id
        name
        description
      }
      supervisor
      subordinates
      roles {
        id
        name
        permissions {
          id
          name
          description
        }
      }
      address {
        street
        city
        state
        zipCode
        country
      }
      hireDate
      salary
    }
    roles {
      id
      name
      permissions {
        id
        name
        description
      }
    }
    address {
      street
      city
      state
      zipCode
      country
    }
    hireDate
    salary
  }
}`,
  },
};

// Product Query with multiple circular references (category and related products)
export const ProductWithCircularReferencesQuery: Story = {
  args: {
    schema: productSchema,
    options: {
      operationName: 'GetProduct',
      variables: { id: 'prod123' },
    },
  },
};

// Complex Order Query with multiple nested objects
export const ComplexOrderQuery: Story = {
  args: {
    schema: orderSchema,
    options: {
      operationName: 'GetOrder',
      variables: { id: 'order123' },
    },
  },
};

// Media Query with enums and optional fields
export const MediaQuery: Story = {
  args: {
    schema: mediaSchema,
    options: {
      operationName: 'GetMedia',
      variables: { id: 'media123' },
    },
  },
};

// Test with inferred query operation name
export const InferredQueryOperation: Story = {
  args: {
    schema: userSchema,
    options: {
      variables: { id: '123' },
    },
    expectedOutput: `query($id: String!) {
  user(id: $id) {
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

// Test with custom maxDepth - limit 1 level of nesting
export const MaxDepth1Query: Story = {
  args: {
    schema: postSchema,
    options: {
      operationName: 'GetPostLimitedDepth',
      variables: { id: 'post123' },
      maxDepth: 3, // Limit to just the post fields + 1 level
    },
    expectedOutput: `query GetPostLimitedDepth($id: String!) {
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
      address
    }
    comments {
      id
      text
      author
      createdAt
      likes
      replies
    }
    tags
    createdAt
    updatedAt
  }
}`,
  },
};

// Test with custom maxDepth - very shallow
export const VeryShallowQuery: Story = {
  args: {
    schema: orderSchema,
    options: {
      operationName: 'GetOrderShallow',
      variables: { id: 'order123' },
      maxDepth: 2, // Only the direct fields, no nesting
    },
    expectedOutput: `query GetOrderShallow($id: String!) {
  order(id: $id) {
    id
    customer
    items
    totalAmount
    status
    shippingAddress
    billingAddress
    createdAt
    updatedAt
    relatedOrders
  }
}`,
  },
};
