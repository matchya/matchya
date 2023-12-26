import { Meta, StoryObj } from '@storybook/react';

import { ChecklistSheet as Component } from './ChecklistSheet';

import { Button } from '@/components/Button/Button';
import { Sheet, SheetTrigger } from '@/components/Sheet/Sheet';
import { mockSelectedPosition } from '@/lib';

const meta: Meta<typeof Component> = {
  title: 'Component/Sheet',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Checklist: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <Component selectedPosition={mockSelectedPosition} />
    </Sheet>
  ),
};
