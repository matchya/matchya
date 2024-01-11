import { Meta, StoryObj } from '@storybook/react';

import Component from './Header';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Header: Story = {
  render: () => <Component />,
};
