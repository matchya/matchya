import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons';
import * as React from 'react';

import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/Command/Command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog/Dialog';
import { Input } from '@/components/ui/Input/Input';
import { Label } from '@/components/ui/Label/Label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover/Popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select/Select';
import { cn } from '@/lib/utils';
import { usePositionStore } from '@/store/usePositionStore';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface PositionSwitcherProps extends PopoverTriggerProps {}

export function PositionSwitcher({ className }: PositionSwitcherProps) {
  const { positions, selectedPosition, selectPosition } = usePositionStore();
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Position</DialogTitle>
          <DialogDescription>
            Add a new Position to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Position name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{' '}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{' '}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowNewPositionDialog(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
