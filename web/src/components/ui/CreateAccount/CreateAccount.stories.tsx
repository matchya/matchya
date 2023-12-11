import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { CreateAccount } from './CreateAccount';

const meta: Meta<typeof CreateAccount> = {
  component: CreateAccount,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CreateAccount>;

export const Default: Story = {
  render: () => <CreateAccount />,
};
