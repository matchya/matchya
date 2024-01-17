import { Meta, StoryObj } from '@storybook/react';

import Component from './AssessmentsPage';

import { Header } from '@/components';

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
      <Component onNavigateToAssessment={() => {}} />
    </>
  ),
};
