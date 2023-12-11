import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
  component: Input,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => <Input />,
};
