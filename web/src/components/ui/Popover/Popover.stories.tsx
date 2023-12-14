import { CaretSortIcon } from '@radix-ui/react-icons';
import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/Popover/Popover';
import { cn } from '@/lib/utils';

const meta: Meta<typeof Popover> = {
  component: Popover,
  decorators: [
    Story => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [selectedPosition] = useState({
      label: '',
      value: '',
    });

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a Position"
            className={cn('w-[200px] justify-between')}
          >
            <Avatar />
            {selectedPosition.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">Content here</PopoverContent>
      </Popover>
    );
  },
};
