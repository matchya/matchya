import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { PositionSwitcher } from './PositionSwitcher';

const meta: Meta<typeof PositionSwitcher> = {
  component: PositionSwitcher,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PositionSwitcher>;

export const Default: Story = {
  render: () => <PositionSwitcher className="mx-6" />,
};
