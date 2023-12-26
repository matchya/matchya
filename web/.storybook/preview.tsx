import '../src/index.css';
import type { Preview } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
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
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default preview;
