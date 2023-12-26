import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons';
import * as React from 'react';

import {
  Avatar,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CreatePositionDialog,
  Dialog,
  DialogTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components';
import { cn } from '@/lib/utils';
import { Position } from '@/types';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface PositionSwitcherProps extends PopoverTriggerProps {
  positions: Position[];
  selectedPosition: Position;
  selectPosition: (position: Position) => void;
}

const PositionSwitcher = ({
  className,
  positions,
  selectedPosition,
  selectPosition,
}: PositionSwitcherProps) => {
  const [open, setOpen] = React.useState(false);
  const [showNewPositionDialog, setShowNewPositionDialog] =
    React.useState(false);

  return (
    <Dialog
      open={showNewPositionDialog}
      onOpenChange={setShowNewPositionDialog}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a Position"
            className={cn('w-[225px] justify-between', className)}
          >
            <div className="mr-2">
              <Avatar
                size={6}
                altName="SC"
                imageUrl={`https://avatar.vercel.sh/1.png`}
              />
            </div>
            {selectedPosition?.name}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[225px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search Position..." />
              <CommandEmpty>No Position found.</CommandEmpty>
              <CommandGroup heading="Positions">
                {positions.map(position => (
                  <CommandItem
                    key={position?.id}
                    onSelect={() => {
                      selectPosition(position);
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    <div className="mr-2">
                      <Avatar
                        size={6}
                        altName="SC"
                        imageUrl={`https://avatar.vercel.sh/1.png`}
                      />
                    </div>
                    {position.name}
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedPosition?.id === position.id
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewPositionDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Position
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <CreatePositionDialog />
    </Dialog>
  );
};

export default PositionSwitcher;
