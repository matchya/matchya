import { Command as CommandPrimitive } from 'cmdk';
import { X } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/Badge/Badge';
import {
  Command,
  CommandGroup,
  CommandItem,
} from '@/components/ui/Command/Command';

interface MultiSelectProps {
  options?: string[];
  selected: string[];
  placeholder?: string;
  onUnselect: (item: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onAddItem?: (item: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function MultiSelect({
  options = [],
  selected,
  placeholder,
  onUnselect,
  onKeyDown,
  onAddItem,
  inputRef,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const [inputValue, setInputValue] = React.useState('');

  const selectables = options.filter(option => !selected.includes(option));

  return (
    <Command onKeyDown={onKeyDown} className="overflow-visible bg-transparent">
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map(item => {
            return (
              <Badge key={item} variant="secondary">
                {item}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      onUnselect(item);
                    }
                  }}
                  onMouseDown={e => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => onUnselect(item)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={`Select ${placeholder}...`}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="bg-white absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-[200px] overflow-y-auto">
              {selectables.map(item => {
                return (
                  <CommandItem
                    key={item}
                    onMouseDown={e => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={value => {
                      setInputValue('');
                      onAddItem(value);
                    }}
                    className={'cursor-pointer'}
                  >
                    {item}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
