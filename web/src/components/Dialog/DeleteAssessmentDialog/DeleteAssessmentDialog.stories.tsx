import { Meta, StoryObj } from '@storybook/react';

import Component from './DeleteAssessmentDialog';

const meta: Meta<typeof Component> = {
  title: 'Component/Dialog',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

const timeConsumingPromise = () =>
  new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });

export const DeleteAssessmentDialog: Story = {
  render: () => (
    <Component
      assessmentName="Frontend Assessment"
      handleDelete={timeConsumingPromise}
    />
  ),
};
