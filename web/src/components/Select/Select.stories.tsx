import { Meta, StoryObj } from '@storybook/react';

import { Select as Component } from './Select';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Select: Story = {
  render: () => <Component />,
};
