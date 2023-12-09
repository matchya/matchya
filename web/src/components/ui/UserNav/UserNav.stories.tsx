import { Meta, StoryObj } from '@storybook/react';

import { UserNav } from './UserNav';

const meta: Meta<typeof UserNav> = {
  component: UserNav,
};

export default meta;

type Story = StoryObj<typeof UserNav>;

export const Default: Story = {
  render: () => (
    <UserNav
      companyName="Test Company"
      companyEmail="test@example.com"
      onLogout={() => console.log('Logged out')}
    />
  ),
};
