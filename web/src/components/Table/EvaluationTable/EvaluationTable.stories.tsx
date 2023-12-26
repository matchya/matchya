import { Meta, StoryObj } from '@storybook/react';

import { EvaluationTable as Component } from '@/components/Table/EvaluationTable/EvaluationTable';
import { mockedAssessments } from '@/lib';

const meta: Meta<typeof Component> = {
  title: 'Component/Table',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Evaluation: Story = {
  render: () => <Component assessments={mockedAssessments} />,
};
