import { Meta, StoryObj } from '@storybook/react';

import { mockedQuestion } from '../../../data/mock';

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
      description={mockedQuestion.description}
      keyword={mockedQuestion.topic}
      difficulty={mockedQuestion.difficulty}
    />
  ),
};
