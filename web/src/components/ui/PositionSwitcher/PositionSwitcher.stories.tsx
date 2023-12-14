import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { PositionSwitcher as Component } from './PositionSwitcher';

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

export const PositionSwitcher: Story = {
  render: () => <Component className="mx-6" />,
};
