import {
  CaretSortIcon,
  PlusCircledIcon,
  CheckIcon,
} from '@radix-ui/react-icons';
import { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import {
  Command,
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/Command/Command';
import { DialogTrigger } from '@/components/ui/Dialog/Dialog';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/Popover/Popover';
import { useState } from 'react';
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
    const [selectedPosition, setSelectedPosition] = useState({
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
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedPosition.value}.png`}
                alt={selectedPosition.label}
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedPosition.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">Content here</PopoverContent>
      </Popover>
    );
  },
};
