import { Meta, StoryObj } from '@storybook/react';

import { LayoutDecorator } from '../../../.storybook/decorators';

import Component from './InterviewsPage';

import { mockedInterviews } from '@/data';

const meta: Meta<typeof Component> = {
  title: 'Page',
  component: Component,
  decorators: [LayoutDecorator],
};

export default meta;

type Story = StoryObj<typeof Component>;

export const InterviewsPage: Story = {
  render: () => <Component interviews={mockedInterviews} isLoading={false} />,
};
