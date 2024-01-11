import { Meta, StoryObj } from '@storybook/react';

import Component from './MainNav';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const MainNav: Story = {
  render: () => <Component />,
};
