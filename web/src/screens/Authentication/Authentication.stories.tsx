import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Authentication from './Authentication';

const meta: Meta<typeof Authentication> = {
  component: Authentication,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Authentication>;

export const Default: Story = {
  render: () => <Authentication />,
};
