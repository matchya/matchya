import { Meta, StoryObj } from '@storybook/react';

import { AllCandidatesCard as Component } from './AllCandidatesCard';

import { mockCandidates } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Component/Card',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const AllCandidates: Story = {
  render: () => {
    return <Component candidates={mockCandidates} />;
  },
};
