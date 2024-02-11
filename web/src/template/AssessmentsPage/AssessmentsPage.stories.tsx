import { Meta, StoryObj } from '@storybook/react';

import { LayoutDecorator } from '../../../.storybook/decorators';

import Component from './AssessmentsPage';

import { mockedAssessments } from '@/data';

const meta: Meta<typeof Component> = {
  title: 'Page',
  component: Component,
  decorators: [LayoutDecorator],
};

export default meta;

type Story = StoryObj<typeof Component>;

export const AssessmentsPage: Story = {
  render: () => (
    <Component
      assessments={mockedAssessments}
      isLoading={false}
      onNavigateToAssessment={() => {}}
      handleNavigateToDetail={() => {}}
      handleDeleteAssessment={() => {}}
    />
  ),
};
