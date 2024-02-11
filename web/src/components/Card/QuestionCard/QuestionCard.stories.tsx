import { Meta, StoryObj } from '@storybook/react';

import { mockedQuizzes } from '../../../data';

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
      quiz={mockedQuizzes[0]}
      selected={false}
    />
  ),
};
