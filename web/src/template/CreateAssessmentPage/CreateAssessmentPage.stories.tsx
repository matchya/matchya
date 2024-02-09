import { Meta, StoryObj } from '@storybook/react';

import { LayoutDecorator } from '../../../.storybook/decorators';

import Component from './CreateAssessmentPage';

import { mockedQuizzes } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Page/CreateAssessmentPage',
  component: Component,
  decorators: [LayoutDecorator],
};

export default meta;

type Story = StoryObj<typeof Component>;

export const IsGeneratingQuestion: Story = {
  render: () => (
    <Component
      testName={'test'}
      quizzes={mockedQuizzes}
      selectedPosition={'Software Engineer'}
      selectedLevel={'Senior'}
      isLoading={false}
      isLoadingQuestionGeneration={true}
      onTestNameChange={() => {}}
      onPositionChange={() => {}}
      onLevelChange={() => {}}
      handleSubmit={() => {}}
    />
  ),
};
