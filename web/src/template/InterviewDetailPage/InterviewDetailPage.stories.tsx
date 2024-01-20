import { Meta, StoryObj } from '@storybook/react';

import Component from './InterviewDetailPage';

import { Header } from '@/components';

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
      <Component questionId='123' testName='random test' interviewId='456' />
    </>
  ),
};
