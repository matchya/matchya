import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { AssessmentTableFacetedFilter } from './AssessmentTableFacetedFilter';
import { AssessmentTableViewOptions } from './AssessmentTableViewOptions';
import { positionLevels, positions } from './data';

import { Button, Input } from '@/components';

interface AssessmentTableToolbarProps<TData> {
  table: Table<TData>;
}

export function AssessmentTableToolbar<TData>({
  table,
}: AssessmentTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
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
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('Position') && (
          <AssessmentTableFacetedFilter
            column={table.getColumn('Position')}
            title="Position"
            options={positions}
          />
        )}
        {table.getColumn('Position Level') && (
          <AssessmentTableFacetedFilter
            column={table.getColumn('Position Level')}
            title="Position Level"
            options={positionLevels}
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
