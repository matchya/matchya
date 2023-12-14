import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Dialog } from '../Dialog';

import { CreatePositionDialog as Component } from './CreatePositionDialog';

const meta: Meta<typeof Component> = {
  title: 'Component/Dialog',
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

export const CreatePosition: Story = {
  render: () => (
    <Dialog open={true} onOpenChange={() => {}}>
      <Component />
    </Dialog>
  ),
};
