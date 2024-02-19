import { Meta, StoryObj } from '@storybook/react';

import Component from './InterviewCompletedPage';

const meta: Meta<typeof Component> = {
  title: 'Page',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const InterviewCompletedPage: Story = {
  render: () => <Component />,
};
