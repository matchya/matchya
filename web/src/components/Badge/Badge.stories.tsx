import { Meta, StoryObj } from '@storybook/react';

import Component from './Badge';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Badge: Story = {
  render: () => <Component>Hello</Component>,
};
