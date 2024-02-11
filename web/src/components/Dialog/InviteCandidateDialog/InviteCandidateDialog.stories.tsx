import { Meta, StoryObj } from '@storybook/react';

import Component from './InviteCandidateDialog';

import { mockedAssessments } from '@/data';

const meta: Meta<typeof Component> = {
  title: 'Component/Dialog',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const InviteCandidateDialog: Story = {
  render: () => (
    <Component assessments={mockedAssessments} addCandidate={() => {}} />
  ),
};
