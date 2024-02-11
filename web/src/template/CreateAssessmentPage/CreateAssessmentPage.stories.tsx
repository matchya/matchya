import { Meta, StoryObj } from '@storybook/react';

import { LayoutDecorator } from '../../../.storybook/decorators';

import Component from './CreateAssessmentPage';

import { mockedQuizzes } from '@/data';

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
      isLoading={false}
      isLoadingQuestionGeneration={true}
      description={'Test description'}
      quizzes={mockedQuizzes}
      selectedQuizzes={[]}
      selectedPosition={'Software Engineer'}
      selectedLevel={'Senior'}
      quizTopic={'React'}
      quizDifficulty={'easy'}
      assessmentName={'test'}
      onDescriptionChange={() => {}}
      onAssessmentNameChange={() => {}}
      onPositionChange={() => {}}
      onLevelChange={() => {}}
      onTopicInputChange={() => {}}
      onDifficultyInputChange={() => {}}
      setSelectedQuizzes={() => {}}
      onSubmit={() => {}}
      handleGenerateQuiz={() => {}}
    />
  ),
};
