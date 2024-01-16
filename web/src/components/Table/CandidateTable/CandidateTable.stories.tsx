import { Meta, StoryObj } from '@storybook/react';

import Component from './CandidateTable';

import { mockedCandidates } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Component/Table',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Candidate: Story = {
  render: () => <Component candidates={mockedCandidates} />,
};
