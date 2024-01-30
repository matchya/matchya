import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { AssessmentTableFacetedFilter } from './AssessmentTableFacetedFilter';
import { AssessmentTableViewOptions } from './AssessmentTableViewOptions';
import { priorities, statuses } from './data';

import { Button, Input } from '@/components';

interface AssessmentTableToolbarProps<TData> {
  table: Table<TData>;
}

export function AssessmentTableToolbar<TData>({
  table,
}: AssessmentTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="p-1 flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[250px] lg:w-[250px]"
        />
        {table.getColumn('status') && (
          <AssessmentTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn('priority') && (
          <AssessmentTableFacetedFilter
            column={table.getColumn('priority')}
            title="Priority"
            options={priorities}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <AssessmentTableViewOptions table={table} />
    </div>
  );
}
