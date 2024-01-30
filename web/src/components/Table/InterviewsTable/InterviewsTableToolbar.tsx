import { Table } from '@tanstack/react-table';

import { InterviewsTableViewOptions } from './InterviewsTableViewOptions';

import { Input } from '@/components';

interface InterviewsTableToolbarProps<TData> {
  table: Table<TData>;
}

export function InterviewsTableToolbar<TData>({
  table,
}: InterviewsTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <InterviewsTableViewOptions table={table} />
    </div>
  );
}
