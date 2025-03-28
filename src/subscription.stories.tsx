import { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import { z } from 'zod';
import { GQLType, ToGQLOptions } from './index';
import { createSubscription } from './subscription';

/**
 * GraphQL Subscription Generation
 *
 * This component demonstrates how to generate GraphQL subscriptions from Zod schemas.
 *
 * @see ../docs/Subscriptions.mdx for detailed documentation
 * @see ../docs/PracticalExamples.mdx for real-world examples
 */

// Import Zod schema and GQL converter
import './index';
import './subscription';

// Component to display GQL subscription
const SubscriptionDisplay = ({
  schema,
  options,
  expectedOutput,
}: {
  schema: z.ZodObject<any> | z.ZodArray<any>;
  options?: ToGQLOptions;
  expectedOutput?: string;
}) => {
  const subscription =
    typeof schema.toGQL === 'function'
      ? schema.toGQL(GQLType.Subscription, options)
      : createSubscription(schema as z.ZodObject<any>, options);

  return (
    <div>
      <h3>Generated GraphQL Subscription</h3>
      <pre data-testid='subscription-output'>{subscription}</pre>
      {expectedOutput && (
        <>
          <h3>Expected Output</h3>
          <pre data-testid='expected-output'>{expectedOutput}</pre>
        </>
      )}
    </div>
  );
};

type SubscriptionStoryArgs = {
  schema: z.ZodObject<any> | z.ZodArray<any>;
  options?: ToGQLOptions;
  expectedOutput?: string;
};

const meta: Meta<typeof SubscriptionDisplay> = {
  title: 'GraphQL/Subscription',
  component: SubscriptionDisplay,
  parameters: {
    docs: {
      description: {
        component:
          'Generate GraphQL subscriptions from Zod schemas. See the [Subscriptions documentation](/?path=/docs/documentation-subscriptions--docs) for more details.',
      },
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SubscriptionDisplay>;

// ========== SCHEMA DEFINITIONS ==========

// Basic schemas
const userPresenceSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().optional(),
    status: z.enum(['online', 'away', 'offline']),
    lastSeen: z.string(),
    typing: z.boolean().optional(),
    currentRoomId: z.string().optional(),
  })
  .describe('UserPresence');

// Notification schemas
const notificationSchema = z
  .object({
    id: z.string(),
    type: z.enum(['info', 'success', 'warning', 'error']),
    title: z.string(),
    message: z.string(),
    timestamp: z.string(),
    read: z.boolean(),
    userId: z.string(),
  })
  .describe('Notification');

// Chat message schemas
const messageAuthorSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().optional(),
  })
  .describe('MessageAuthor');

const chatAttachmentSchema = z
  .object({
    id: z.string(),
    url: z.string(),
    fileName: z.string(),
    fileType: z.string(),
    fileSize: z.number(),
    thumbnailUrl: z.string().optional(),
  })
  .describe('ChatAttachment');

const chatMessageSchema = z
  .object({
    id: z.string(),
    content: z.string(),
    author: messageAuthorSchema,
    timestamp: z.string(),
    roomId: z.string(),
    edited: z.boolean().default(false),
    reactions: z.record(z.string(), z.number()).optional(),
    attachments: z.array(chatAttachmentSchema).optional(),
    mentions: z.array(z.string()).optional(),
  })
  .describe('ChatMessage');

// Event tracking schemas
const activityEventSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    eventType: z.enum(['page_view', 'button_click', 'form_submit', 'error']),
    resourceId: z.string().optional(),
    resourceType: z.string().optional(),
    timestamp: z.string(),
    metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    sessionId: z.string(),
  })
  .describe('ActivityEvent');

// Real-time data schemas
const stockTickerSchema = z
  .object({
    symbol: z.string(),
    price: z.number(),
    change: z.number(),
    changePercent: z.number(),
    volume: z.number(),
    timestamp: z.string(),
    open: z.number(),
    high: z.number(),
    low: z.number(),
    previousClose: z.number(),
  })
  .describe('StockTicker');

const sensorDataSchema = z
  .object({
    sensorId: z.string(),
    deviceId: z.string(),
    type: z.enum(['temperature', 'humidity', 'pressure', 'light', 'motion']),
    value: z.number(),
    unit: z.string(),
    timestamp: z.string(),
    batteryLevel: z.number().optional(),
    status: z.enum(['normal', 'warning', 'alert', 'error']).optional(),
    location: z
      .object({
        latitude: z.number(),
        longitude: z.number(),
        altitude: z.number().optional(),
      })
      .optional(),
  })
  .describe('SensorData');

// Nested, complex subscription schema
const commentReactionSchema = z
  .object({
    userId: z.string(),
    reactionType: z.enum(['like', 'love', 'laugh', 'wow', 'sad', 'angry']),
    timestamp: z.string(),
  })
  .describe('CommentReaction');

const commentEventSchema = z
  .object({
    id: z.string(),
    postId: z.string(),
    eventType: z.enum(['created', 'updated', 'deleted', 'reaction_added', 'reaction_removed']),
    timestamp: z.string(),
    actor: userPresenceSchema,
    comment: z
      .object({
        id: z.string(),
        content: z.string(),
        parentId: z.string().optional(),
        author: messageAuthorSchema,
        createdAt: z.string(),
        updatedAt: z.string().optional(),
        reactions: z.record(z.string(), z.array(commentReactionSchema)).optional(),
        attachments: z.array(chatAttachmentSchema).optional(),
        mentions: z.array(z.string()).optional(),
      })
      .optional()
      .describe('Comment'),
    reaction: commentReactionSchema.optional(),
  })
  .describe('CommentEvent');

// ========== STORY TESTS ==========

// User Presence Subscription
export const UserPresenceSubscription: Story = {
  args: {
    schema: userPresenceSchema,
    options: {
      operationName: 'SubscribeUserPresence',
      variables: { userId: 'user123' },
    },
    expectedOutput: `subscription SubscribeUserPresence($userId: String!) {
  userPresence(userId: $userId) {
    id
    name
    avatarUrl
    status
    lastSeen
    typing
    currentRoomId
  }
}`,
  },
  parameters: {
    docs: {
      description: {
        story: 'A GraphQL subscription to track user presence status changes in real-time.',
      },
      source: { type: 'code' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Get the generated output
    const subscriptionOutput = canvas.getByTestId('subscription-output');
    const expectedOutput = canvas.getByTestId('expected-output');

    // Normalize strings (remove whitespace) for comparison
    const normalizeString = (str: string) => str.replace(/\s+/g, '');

    expect(normalizeString(subscriptionOutput.textContent || '')).toBe(normalizeString(expectedOutput.textContent || ''));
  },
};

// New: Multiple users presence subscription with array schema
export const UsersPresenceSubscription: Story = {
  args: {
    schema: z.array(userPresenceSchema),
    options: {
      variables: { roomId: 'room123' },
    },
    expectedOutput: `subscription($roomId: String!) {
  userPresences(roomId: $roomId) {
    id
    name
    avatarUrl
    status
    lastSeen
    typing
    currentRoomId
  }
}`,
  },
  parameters: {
    docs: {
      description: {
        story: 'A subscription using array schema for automatic pluralization of the field name.',
      },
      source: { type: 'code' },
    },
  },
};

// New: Multiple users presence with explicit operation name
export const SubscribeUsersPresence: Story = {
  args: {
    schema: z.array(userPresenceSchema),
    options: {
      operationName: 'SubscribeRoomUsers',
      variables: { roomId: 'room123' },
    },
    expectedOutput: `subscription SubscribeRoomUsers($roomId: String!) {
  userPresences(roomId: $roomId) {
    id
    name
    avatarUrl
    status
    lastSeen
    typing
    currentRoomId
  }
}`,
  },
  parameters: {
    docs: {
      description: {
        story: 'An array subscription with explicit operation name and automatic field name pluralization.',
      },
      source: { type: 'code' },
    },
  },
};

// User Notifications Subscription
export const UserNotificationsSubscription: Story = {
  args: {
    schema: notificationSchema,
    options: {
      operationName: 'SubscribeUserNotifications',
      variables: { userId: 'user123' },
    },
    expectedOutput: `subscription SubscribeUserNotifications($userId: String!) {
  notification(userId: $userId) {
    id
    type
    title
    message
    timestamp
    read
    userId
  }
}`,
  },
};

// New: Multiple notifications subscription with array schema
export const NotificationsSubscription: Story = {
  args: {
    schema: z.array(notificationSchema),
    options: {
      variables: { userId: 'user123' },
    },
    expectedOutput: `subscription($userId: String!) {
  notifications(userId: $userId) {
    id
    type
    title
    message
    timestamp
    read
    userId
  }
}`,
  },
};

// Chat Room Messages Subscription
export const ChatRoomMessagesSubscription: Story = {
  args: {
    schema: chatMessageSchema,
    options: {
      operationName: 'SubscribeChatRoom',
      variables: { roomId: 'room123' },
    },
    expectedOutput: `subscription SubscribeChatRoom($roomId: String!) {
  chatMessage(roomId: $roomId) {
    id
    content
    author {
      id
      name
      avatarUrl
    }
    timestamp
    roomId
    edited
    reactions
    attachments {
      id
      url
      fileName
      fileType
      fileSize
      thumbnailUrl
    }
    mentions
  }
}`,
  },
  parameters: {
    docs: {
      description: {
        story: 'A GraphQL subscription for real-time chat messages with nested author details and message attachments.',
      },
      source: { type: 'code' },
    },
  },
};

// New: Chat messages array subscription
export const ChatMessagesSubscription: Story = {
  args: {
    schema: z.array(chatMessageSchema),
    options: {
      variables: { roomId: 'room123' },
    },
    expectedOutput: `subscription($roomId: String!) {
  chatMessages(roomId: $roomId) {
    id
    content
    author {
      id
      name
      avatarUrl
    }
    timestamp
    roomId
    edited
    reactions
    attachments {
      id
      url
      fileName
      fileType
      fileSize
      thumbnailUrl
    }
    mentions
  }
}`,
  },
};

// Activity Events Subscription
export const ActivityEventsSubscription: Story = {
  args: {
    schema: activityEventSchema,
    options: {
      operationName: 'SubscribeActivityEvents',
      variables: { userId: 'user123', sessionId: 'session456' },
    },
    expectedOutput: `subscription SubscribeActivityEvents($userId: String!, $sessionId: String!) {
  activityEvent(userId: $userId, sessionId: $sessionId) {
    id
    userId
    eventType
    resourceId
    resourceType
    timestamp
    metadata
    ipAddress
    userAgent
    sessionId
  }
}`,
  },
};

// Stock Ticker Subscription
export const StockTickerSubscription: Story = {
  args: {
    schema: stockTickerSchema,
    options: {
      operationName: 'SubscribeStockTicker',
      variables: { symbols: ['AAPL', 'MSFT', 'GOOGL'] },
    },
    expectedOutput: `subscription SubscribeStockTicker($symbols: StringInput!) {
  stockTicker(symbols: $symbols) {
    symbol
    price
    change
    changePercent
    volume
    timestamp
    open
    high
    low
    previousClose
  }
}`,
  },
};

// New: Multiple stock tickers subscription
export const StockTickersSubscription: Story = {
  args: {
    schema: z.array(stockTickerSchema),
    options: {
      variables: { symbols: ['AAPL', 'MSFT', 'GOOGL'] },
    },
    expectedOutput: `subscription($symbols: StringInput!) {
  stockTickers(symbols: $symbols) {
    symbol
    price
    change
    changePercent
    volume
    timestamp
    open
    high
    low
    previousClose
  }
}`,
  },
};

// Sensor Data Subscription
export const SensorDataSubscription: Story = {
  args: {
    schema: sensorDataSchema,
    options: {
      operationName: 'SubscribeSensorData',
      variables: {
        deviceId: 'device123',
        sensorTypes: ['temperature', 'humidity'],
      },
    },
    expectedOutput: `subscription SubscribeSensorData($deviceId: String!, $sensorTypes: SensorTypesInput!) {
  sensorData(deviceId: $deviceId, sensorTypes: $sensorTypes) {
    sensorId
    deviceId
    type
    value
    unit
    timestamp
    batteryLevel
    status
    location {
      latitude
      longitude
      altitude
    }
  }
}`,
  },
};

// Complex Comment Events Subscription
export const CommentEventsSubscription: Story = {
  args: {
    schema: commentEventSchema,
    options: {
      operationName: 'SubscribeCommentEvents',
      variables: { postId: 'post123' },
    },
  },
};

// Test with inferred operation name
export const InferredSubscriptionOperation: Story = {
  args: {
    schema: userPresenceSchema,
    options: {
      variables: { userId: 'user123' },
    },
    expectedOutput: `subscription($userId: String!) {
  userPresence(userId: $userId) {
    id
    name
    avatarUrl
    status
    lastSeen
    typing
    currentRoomId
  }
}`,
  },
};

// Test with limited depth
export const LimitedDepthSubscription: Story = {
  args: {
    schema: commentEventSchema,
    options: {
      operationName: 'SubscribeCommentEvents',
      variables: { postId: 'post123' },
      maxDepth: 3,
    },
    expectedOutput: `subscription SubscribeCommentEvents($postId: String!) {
  commentEvent(postId: $postId) {
    id
    postId
    eventType
    timestamp
    actor {
      id
      name
      avatarUrl
      status
      lastSeen
      typing
      currentRoomId
    }
    comment {
      id
      content
      parentId
      author {
        id
        name
        avatarUrl
      }
      createdAt
      updatedAt
      reactions
      attachments
      mentions
    }
    reaction {
      userId
      reactionType
      timestamp
    }
  }
}`,
  },
};

// Multiple simultaneous subscriptions
export const MultipleSubscriptions: Story = {
  args: {
    schema: z
      .object({
        userPresence: userPresenceSchema,
        notifications: notificationSchema,
        chatMessages: chatMessageSchema,
      })
      .describe('CombinedSubscription'),
    options: {
      operationName: 'MultiSubscription',
      variables: {
        userId: 'user123',
        roomId: 'room456',
      },
    },
    expectedOutput: `subscription MultiSubscription($userId: String!, $roomId: String!) {
  combinedSubscription(userId: $userId, roomId: $roomId) {
    userPresence {
      id
      name
      avatarUrl
      status
      lastSeen
      typing
      currentRoomId
    }
    notifications {
      id
      type
      title
      message
      timestamp
      read
      userId
    }
    chatMessages {
      id
      content
      author {
        id
        name
        avatarUrl
      }
      timestamp
      roomId
      edited
      reactions
      attachments {
        id
        url
        fileName
        fileType
        fileSize
        thumbnailUrl
      }
      mentions
    }
  }
}`,
  },
};
