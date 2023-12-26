import { Meta, StoryObj } from '@storybook/react';

import Component from './ChecklistSheet';

import { Button, Sheet, SheetTrigger } from '@/components';
import { mockSelectedPosition } from '@/data/mock';

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
