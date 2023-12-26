import { Meta, StoryObj } from '@storybook/react';

import Component from './Button';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Button: Story = {
  render: () => <Component>Hello</Component>,
};
