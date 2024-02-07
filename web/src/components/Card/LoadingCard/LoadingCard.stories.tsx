import { Meta, StoryObj } from '@storybook/react';

import Component from './LoadingCard';

const meta: Meta<typeof Component> = {
  title: 'Component/Card',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Loading: Story = {
  render: () => <Component />,
};
