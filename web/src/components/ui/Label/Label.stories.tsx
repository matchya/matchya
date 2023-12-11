import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Label } from './Label';

const meta: Meta<typeof Label> = {
  component: Label,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: () => <Label>Label Text</Label>,
};
