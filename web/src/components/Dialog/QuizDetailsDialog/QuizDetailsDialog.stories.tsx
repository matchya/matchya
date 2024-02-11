import { Meta, StoryObj } from '@storybook/react';

import Component from './QuizDetailsDialog';


const meta: Meta<typeof Component> = {
  title: 'Component/Dialog',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const QuizDetailsDialog: Story = {
  render: () => (
    <Component />
  ),
};
