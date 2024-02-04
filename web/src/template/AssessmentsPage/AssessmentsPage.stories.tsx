import { Meta, StoryObj } from '@storybook/react';

import Component from './AssessmentsPage';

import { Header } from '@/components';
import { mockedAssessments } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Template',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const AssessmentsPage: Story = {
  render: () => (
    <>
      <Header />
      <Component
        assessments={mockedAssessments}
        isLoading={false}
        onNavigateToAssessment={() => {}}
        handleNavigateToDetail={() => {}}
      />
    </>
  ),
};
