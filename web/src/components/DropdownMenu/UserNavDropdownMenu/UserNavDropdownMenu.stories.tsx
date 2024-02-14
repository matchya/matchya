import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { Meta, StoryObj } from '@storybook/react';

import Component from './UserNavDropdownMenu';

import { Avatar, Button } from '@/components';

const meta: Meta<typeof Component> = {
  title: 'Component/Dropdown Menu',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const UserNav: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar altName="KO" />
        </Button>
      </DropdownMenuTrigger>
      <Component
        companyName="Test Company"
        companyEmail="test@example.com"
        onLogout={() => {}}
      />
    </DropdownMenu>
  ),
};
