import { Meta, StoryObj } from '@storybook/react';

import Component from './InterviewRecordingPage';

import { mockedQuestion } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Template',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const InterviewRecordingPage: Story = {
  render: () => (
    <Component
      question={mockedQuestion}
      isLoading={false}
      index={0}
      isRecording={false}
      webcamRef={undefined}
      videoFile={null}
      onStartRecording={() => {}}
      onStopRecording={() => {}}
      onUploadVideo={() => {}}
    />
  ),
};
