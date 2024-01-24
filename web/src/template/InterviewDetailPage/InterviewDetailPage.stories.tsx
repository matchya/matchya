import { Meta, StoryObj } from '@storybook/react';

import Component from './InterviewDetailPage';

import { Header } from '@/components';
import { mockedInterviews } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Template',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const InterviewDetailPageTemplate: Story = {
  render: () => (
    <>
      <Header />
      <Component
        questionId="123"
        interview={mockedInterviews[0]}
        onSelectVideo={() => {}}
      />
    </>
  ),
};
