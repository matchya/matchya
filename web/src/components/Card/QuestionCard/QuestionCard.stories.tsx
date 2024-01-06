import { Meta, StoryObj } from '@storybook/react';

import { mockQuestion } from '../../../data/mock';

import Component from './QuestionCard';

const meta: Meta<typeof Component> = {
  title: 'Component/Card',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Question: Story = {
  render: () => (
    <Component
      question={mockQuestion.question}
      metrics={mockQuestion.metrics}
      keyword={mockQuestion.keyword}
      difficulty={mockQuestion.difficulty}
    />
  ),
};
