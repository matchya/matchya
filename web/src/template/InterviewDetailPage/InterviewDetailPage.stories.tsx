import { Meta, StoryObj } from '@storybook/react';

import { LayoutDecorator } from '../../../.storybook/decorators';

import Component from './InterviewDetailPage';

import { mockedInterview } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Page',
  component: Component,
  decorators: [LayoutDecorator],
};

export default meta;

type Story = StoryObj<typeof Component>;

export const InterviewDetailPageTemplate: Story = {
  render: () => <Component interviewData={mockedInterview} />,
};
