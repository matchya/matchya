import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { CandidatesTableFacetedFilter } from './CandidatesTableFacetedFilter';
import { CandidatesTableViewOptions } from './CandidatesTableViewOptions';
import { statuses } from './data';

import { Button, Input } from '@/components';

interface CandidatesTableToolbarProps<TData> {
  table: Table<TData>;
}

export function CandidatesTableToolbar<TData>({
  table,
}: CandidatesTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="p-1 flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by Candidate Name..."
          value={
            (table.getColumn('Candidate Name')?.getFilterValue() as string) ??
            ''
          }
          onChange={event =>
            table
              .getColumn('Candidate Name')
              ?.setFilterValue(event.target.value)
          }
          className="h-8 w-[250px] lg:w-[250px]"
        />
        {table.getColumn('Interview Status') && (
          <CandidatesTableFacetedFilter
            column={table.getColumn('Interview Status')}
            title="Status"
            options={statuses}
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
      <CandidatesTableViewOptions table={table} />
    </div>
  );
}
