import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Dialog } from '../Dialog';

import { AddCandidateDialog as Component } from './AddCandidateDialog';

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

export const AddCandidate: Story = {
  render: () => (
    <Dialog open={true} onOpenChange={() => {}}>
      <Component
        errorMessage="Error"
        shouldOpen={true}
        isLoading={false}
        onClose={() => {}}
        onSubmit={() => {}}
      />
    </Dialog>
  ),
};
