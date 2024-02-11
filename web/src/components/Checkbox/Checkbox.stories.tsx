import { Meta, StoryObj } from '@storybook/react';

import Component from './Checkbox';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Checkbox: Story = {
  render: () => <Component />,
};
