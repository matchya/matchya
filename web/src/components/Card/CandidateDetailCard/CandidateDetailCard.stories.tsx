import { Meta, StoryObj } from '@storybook/react';

import Component from './CandidateDetailCard';

import { mockSelectedCandidate } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Component/Card',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const CandidateDetail: Story = {
  render: () => <Component candidate={mockSelectedCandidate} />,
};
