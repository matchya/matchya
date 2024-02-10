import { Meta, StoryObj } from '@storybook/react';

import Component from './InterviewRecordingPage';

import { mockedQuestion } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Page',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const InterviewRecordingPage: Story = {
  render: () => (
    <Component
      quiz={mockedQuestion}
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
