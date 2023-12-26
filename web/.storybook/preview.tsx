import '../src/index.css';
import type { Preview } from '@storybook/react';
import { StorybookStoreProvider } from '../src/store';
import React from 'react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    Story => (
      <StorybookStoreProvider>
        <Story />
      </StorybookStoreProvider>
    ),
  ],
};

export default preview;
