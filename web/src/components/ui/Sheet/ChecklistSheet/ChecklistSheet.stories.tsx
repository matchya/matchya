import { Meta, StoryObj } from '@storybook/react';

import { ChecklistSheet as Component } from './ChecklistSheet';

import { Button } from '@/components/ui/Button/Button';
import { Sheet, SheetTrigger } from '@/components/ui/Sheet/Sheet';
import { mockSelectedPosition } from '@/data';

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
