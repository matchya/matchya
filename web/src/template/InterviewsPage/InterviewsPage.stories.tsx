import { Meta, StoryObj } from '@storybook/react';

import Component from './InterviewsPage';

import { Header } from '@/components';

const meta: Meta<typeof Component> = {
  title: 'Template',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const InterviewsPage: Story = {
  render: () => (
    <>
      <Header />
      <Component />
    </>
  ),
};