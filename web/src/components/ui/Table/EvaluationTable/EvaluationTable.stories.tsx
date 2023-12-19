import { Meta, StoryObj } from '@storybook/react';

import { mockedAssessments } from './mock';

import { EvaluationTable as Component } from '@/components/ui/Table/EvaluationTable/EvaluationTable';

const meta: Meta<typeof Component> = {
  title: 'Component/Table',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Evaluation: Story = {
  render: () => {
    <Component assessments={mockedAssessments} />;
  },
};
