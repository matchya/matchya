import { Meta, StoryObj } from '@storybook/react';

import { Dialog } from '../Dialog';

import Component from './AddCandidateDialog';

const meta: Meta<typeof Component> = {
  title: 'Component/Dialog',
  component: Component,
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
