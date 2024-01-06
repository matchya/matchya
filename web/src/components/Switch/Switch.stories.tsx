import { Meta, StoryObj } from '@storybook/react';

import Component from './Switch';

import { Label } from '@/components';

const meta: Meta<typeof Component> = {
  title: 'Component/Switch',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Component id="airplane-mode" checked={true} />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

export const UnChecked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Component id="airplane-mode" checked={false} />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};
