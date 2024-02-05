import { Meta, StoryObj } from '@storybook/react';

import { LayoutDecorator } from '../../../.storybook/decorators';

import Component from './AssessmentDetailPage';

import { mockedAssessments } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Page',
  component: Component,
  decorators: [LayoutDecorator],
};

export default meta;

type Story = StoryObj<typeof Component>;

export const AssessmentDetailPage: Story = {
  render: () => (
      <Component
        assessment={mockedAssessments[0]}
        isLoading={false}
        questionsListFragment={<div>Temp</div>}
      />
  ),
};
