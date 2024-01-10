import { Meta, StoryObj } from '@storybook/react';

import Component from './Input';

import { Label } from '@/components';

const meta: Meta<typeof Component> = {
  title: 'Component/Input',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Email: Story = {
  render: () => (
    <div className="grid gap-1">
      <Label htmlFor="email">Email</Label>
      <Component
        id="email"
        placeholder="name@example.com"
        type="email"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect="off"
        disabled={false}
        value={''}
        onChange={() => {}}
      />
    </div>
  ),
};

export const Password: Story = {
  render: () => (
    <div className="grid gap-1">
      <Label htmlFor="password">Password</Label>
      <Component
        id="password"
        placeholder="password"
        type="password"
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect="off"
        disabled={false}
        value={''}
        onChange={() => {}}
      />
    </div>
  ),
};
