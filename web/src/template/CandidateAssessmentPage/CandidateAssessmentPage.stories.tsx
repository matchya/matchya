import { Meta, StoryObj } from '@storybook/react';

import Component from './CandidateAssessmentPage';

const meta: Meta<typeof Component> = {
  title: 'Template',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const CandidateAssessmentPage: Story = {
  render: () => <Component />,
};
