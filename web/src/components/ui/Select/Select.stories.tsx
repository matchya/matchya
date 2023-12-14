import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Select as Component } from './Select';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Select: Story = {
  render: () => <Component />,
};
