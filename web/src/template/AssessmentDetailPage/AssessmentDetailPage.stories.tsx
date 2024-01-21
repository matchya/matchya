import { Meta, StoryObj } from '@storybook/react';

import Component from './AssessmentDetailPage';

import { Header } from '@/components';
import { mockedAssessments } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Template',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const AssessmentDetailPage: Story = {
  render: () => (
    <>
      <Header />
      <Component assessment={mockedAssessments[0]} />
    </>
  ),
};
