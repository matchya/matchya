import { Meta, StoryObj } from '@storybook/react';

import Component from './HomePage';

const meta: Meta<typeof Component> = {
  title: 'Page',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const HomePage: Story = {
  render: () => (
    <Component
      onNavigateToAuthentication={() =>
        alert('navigate to authentication page')
      }
    />
  ),
};
