import { Meta, StoryObj } from '@storybook/react';

import Component from './InterviewRecordingPage';

import { mockedSelectedQuiz } from '@/data';

const meta: Meta<typeof Component> = {
  title: 'Page',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const InterviewRecordingPage: Story = {
  render: () => (
    <Component
      quiz={mockedSelectedQuiz}
      quizStarted={false}
      startQuiz={() => {}}
      isLoading={false}
      progressbarCount={2}
      totalQuizCount={4}
      isRecording={false}
      webcamRef={undefined}
      videoFile={null}
      onStartRecording={() => {}}
      onStopRecording={() => {}}
      onUploadVideo={() => {}}
    />
  ),
};
