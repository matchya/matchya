import { Meta, StoryObj } from '@storybook/react';

import Component from './Label';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Label: Story = {
  render: () => <Component>Label Text</Component>,
};
