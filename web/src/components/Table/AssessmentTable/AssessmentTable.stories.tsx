import { Meta, StoryObj } from '@storybook/react';

import Component from './AssessmentTable';

import { mockedAssessments } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Component/Table',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Assessment: Story = {
  render: () => (
    <Component
      assessments={mockedAssessments}
      handleNavigateToDetail={() => {}}
      handleDeleteAssessment={() => {}}
    />
  ),
};
