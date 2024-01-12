import { Meta, StoryObj } from '@storybook/react';

import Component from './AllCandidatesCard';

import { mockedCandidates } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Component/Card',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const AllCandidates: Story = {
  render: () => {
    return (
      <Component
        shouldShowQuestions={true}
        onShouldShowQuestionsCheckedChanged={() => {}}
        candidates={mockedCandidates}
      />
    );
  },
};
