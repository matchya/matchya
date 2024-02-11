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
    <div className="p-1 flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by Assessment Name..."
          value={
            (table.getColumn('Assessment Name')?.getFilterValue() as string) ??
            ''
          }
          onChange={event =>
            table
              .getColumn('Assessment Name')
              ?.setFilterValue(event.target.value)
          }
          className="h-8 w-[250px] lg:w-[250px]"
        />
      </div>
      <InterviewsTableViewOptions table={table} />
    </div>
  );
}
