import { Meta, StoryObj } from '@storybook/react';

import Component from './InterviewInstructionCard';

const meta: Meta<typeof Component> = {
  title: 'Component/Card',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const InterviewInstruction: Story = {
  render: () => <Component estimatedTimeInMinutes={20} onNext={() => {}} />,
};
