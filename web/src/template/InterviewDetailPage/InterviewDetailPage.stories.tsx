import { Meta, StoryObj } from '@storybook/react';

import Component from './InterviewDetailPage';

import { Header } from '@/components';
import { mockedInterviews } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Page',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const InterviewDetailPageTemplate: Story = {
  render: () => (
    <>
      <Header />
      <Component
        currentAnswer={mockedInterviews[0].answers[0]}
        interview={mockedInterviews[0]}
        onSelectVideo={() => {}}
      />
    </>
  ),
};
