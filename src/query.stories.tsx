import { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import { z } from 'zod';
import { ToGQLOptions } from './index';
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
  expectedOutput,
}: {
  schema: z.ZodObject<any>;
  options?: ToGQLOptions;
  expectedOutput?: string;
}) => {
  const query = createQuery(schema, options);

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
  schema: z.ZodObject<any>;
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
const addressSchema = withTypeName(
  z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string().optional(),
  }),
  'Address',
);

const userSchema = withTypeName(
  z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    age: z.number(),
    isActive: z.boolean(),
    address: addressSchema.optional(),
  }),
  'User',
);

// Nested schemas
const commentSchema = withTypeName(
  z.object({
    id: z.string(),
    text: z.string(),
    author: userSchema,
    createdAt: z.string(),
    likes: z.number(),
    replies: z.array(z.lazy(() => commentSchema)).optional(),
  }),
  'Comment',
);

const postSchema = withTypeName(
  z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    author: userSchema,
    comments: z.array(commentSchema),
    tags: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string().optional(),
  }),
  'Post',
);

// Complex schemas with multi-level nesting
const permissionSchema = withTypeName(
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
  }),
  'Permission',
);

const roleSchema = withTypeName(
  z.object({
    id: z.string(),
    name: z.string(),
    permissions: z.array(permissionSchema),
  }),
  'Role',
);

const departmentSchema = withTypeName(
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
  }),
  'Department',
);

const employeeSchema = withTypeName(
  z.object({
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
  }),
  'Employee',
);

// Complex schema with multiple circular references
const categorySchema = withTypeName(
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    parentCategory: z.lazy(() => categorySchema).optional(),
    subcategories: z.array(z.lazy(() => categorySchema)).optional(),
  }),
  'Category',
);

const productSchema = withTypeName(
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    category: categorySchema,
    relatedProducts: z.array(z.lazy(() => productSchema)).optional(),
    attributes: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
    stockQuantity: z.number(),
    isAvailable: z.boolean(),
  }),
  'Product',
);

const orderItemSchema = withTypeName(
  z.object({
    id: z.string(),
    product: productSchema,
    quantity: z.number(),
    unitPrice: z.number(),
    totalPrice: z.number(),
  }),
  'OrderItem',
);

const orderSchema = withTypeName(
  z.object({
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
  }),
  'Order',
);

// GraphQL schema with enums, unions, and other complex types
const mediaTypeEnum = z.enum(['image', 'video', 'document']);

const imageSchema = withTypeName(
  z.object({
    url: z.string(),
    width: z.number(),
    height: z.number(),
    format: z.string(),
  }),
  'Image',
);

const videoSchema = withTypeName(
  z.object({
    url: z.string(),
    duration: z.number(),
    format: z.string(),
    thumbnail: imageSchema.optional(),
  }),
  'Video',
);

const documentSchema = withTypeName(
  z.object({
    url: z.string(),
    title: z.string(),
    fileSize: z.number(),
    fileType: z.string(),
  }),
  'Document',
);

const mediaSchema = withTypeName(
  z.object({
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
  }),
  'Media',
);

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
