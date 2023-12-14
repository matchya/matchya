import { Meta, StoryObj } from '@storybook/react';

import { UserNavDropdownMenu as Component } from './UserNavDropdownMenu';

const meta: Meta<typeof Component> = {
  title: 'Component/DropdownMenu',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const UserNav: Story = {
  render: () => (
    <Component
      companyName="Test Company"
      companyEmail="test@example.com"
      onLogout={() => console.log('Logged out')}
    />
  ),
};
