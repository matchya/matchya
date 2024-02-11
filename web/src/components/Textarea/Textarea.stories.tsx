import { Meta, StoryObj } from '@storybook/react';

import Component from './Textarea';

import { Label } from '@/components';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Input: Story = {
  render: () => (
    <div className="grid gap-1">
      <Label htmlFor="email">Email</Label>
      <Component placeholder="Random" value="Text here" onChange={() => {}} />
    </div>
  ),
};
