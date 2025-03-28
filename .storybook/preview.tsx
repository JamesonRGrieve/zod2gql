const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      source: {
        excludeDecorators: true,
      },
      story: {
        inline: true,
      },
    },
    options: {
      storySort: {
        order: [
          'Documentation',
          [
            'Welcome',
            'Getting Started',
            'Queries',
            'Mutations',
            'Subscriptions',
            'Advanced Usage',
            'Practical Examples',
            'API Reference',
          ],
          'GraphQL',
          ['Query', 'Mutation', 'Subscription'],
        ],
      },
    },
  },
};
