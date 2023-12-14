import { CheckIcon } from '@radix-ui/react-icons';
import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Avatar } from '../Avatar/Avatar';

import {
  Command as Component,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/Command/Command';
import { cn } from '@/lib/utils';

const meta: Meta<typeof Component> = {
  title: 'Component',
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

export const Command: Story = {
  render: () => {
    const [selectedPosition, setSelectedPosition] = useState({
      label: '',
      value: '',
    });
    const groups = [
      {
        label: 'Positions',
        Positions: [
          {
            label: 'Software Engineer',
            value: '1',
          },
          {
            label: 'Fullstack Engineer',
            value: '2',
          },
        ],
      },
    ];
    return (
      <Component>
        <CommandList>
          <CommandInput placeholder="Search Position..." />
          <CommandEmpty>No Position found.</CommandEmpty>
          {groups.map(group => (
            <CommandGroup key={group.label} heading={group.label}>
              {group.Positions.map(Position => (
                <CommandItem
                  key={Position.value}
                  onSelect={() => {
                    setSelectedPosition(Position);
                  }}
                  className="text-sm"
                >
                  <div className="mr-2">
                    <Avatar
                      size={6}
                      imageUrl={`https://avatar.vercel.sh/${Position.value}.png`}
                      altName="SC"
                    />
                  </div>
                  {Position.label}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      selectedPosition.value === Position.value
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
        <CommandSeparator />
      </Component>
    );
  },
};
