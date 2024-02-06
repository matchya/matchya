import { Meta, StoryObj } from '@storybook/react';

import DisplayingComponent from './Textarea';
import ShadcnComponent from './Textarea.shadcn';

import { Label } from '@/components';

const meta: Meta<typeof DisplayingComponent> = {
  title: 'Component/Input',
  component: DisplayingComponent,
};

export default meta;

type Story = StoryObj<typeof DisplayingComponent>;

export const Shadcn: Story = {
  render: () => (
    <div className="grid gap-1">
      <Label htmlFor="email">Email</Label>
      <ShadcnComponent
        placeholder="Random"
        value="Text here"
        onChange={() => {}}
      />
    </div>
  ),
};
