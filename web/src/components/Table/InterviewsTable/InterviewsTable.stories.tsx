import { Meta, StoryObj } from '@storybook/react';

import Component from './InterviewsTable';

import { mockedInterviews } from '@/data';

const meta: Meta<typeof Component> = {
  title: 'Component/Table',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Interviews: Story = {
  render: () => <Component interviews={mockedInterviews} />,
};
