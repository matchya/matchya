import { Meta, StoryObj } from '@storybook/react';

import Component from './EvaluationTable';

import { mockedAssessments } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Component/Table',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Evaluation: Story = {
  render: () => <Component assessments={mockedAssessments} />,
};
