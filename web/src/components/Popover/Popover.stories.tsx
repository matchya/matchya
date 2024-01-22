import { CaretSortIcon } from '@radix-ui/react-icons';
import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import {
  Popover as Component,
  PopoverTrigger,
  PopoverContent,
} from './Popover';

import { Avatar, Button } from '@/components';
import { cn } from '@/lib/utils';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Popover: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [selectedPosition] = useState({
      label: 'Software Engineer',
      value: '',
    });

    return (
      <Component open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a Position"
            className={cn('w-[200px] justify-between')}
          >
            <div className="mr-1">
              <Avatar size={6} altName="SC" />
            </div>
            {selectedPosition.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">Content here</PopoverContent>
      </Component>
    );
  },
};