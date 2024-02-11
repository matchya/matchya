import { Meta, StoryObj } from '@storybook/react';

import Component from './CandidatesTable';

import { mockedCandidates } from '@/data';

const meta: Meta<typeof Component> = {
  title: 'Component/Table',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Candidate: Story = {
  render: () => <Component candidates={mockedCandidates} />,
};
