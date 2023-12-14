import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Header as Component } from './Header';

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

export const Header: Story = {
  render: () => <Component />,
};
