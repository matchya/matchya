import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Label } from '../Label/Label';

import { Input as Component, Input } from './Input';

const meta: Meta<typeof Component> = {
  title: 'Component/Input',
  component: Component,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Email: Story = {
  render: () => (
    <div className="grid gap-1">
      <Label htmlFor="email">Email</Label>
      <Input
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
      <Input
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
