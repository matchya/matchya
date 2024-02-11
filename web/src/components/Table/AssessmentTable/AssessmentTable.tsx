import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../Table';

import { AssessmentTablePagination } from './AssessmentTablePagination';
import { AssessmentTableToolbar } from './AssessmentTableToolbar';
import { columns } from './columns';

import { DeleteAssessmentDialog } from '@/components';
import { Assessment } from '@/types';

interface AssessmentTableProps {
  assessments: Assessment[];
  handleNavigateToDetail: (id: string) => void;
  handleDeleteAssessment: (id: string) => void;
}

const AssessmentTable = ({
  assessments,
  handleNavigateToDetail,
  handleDeleteAssessment,
}: AssessmentTableProps) => {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: assessments,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  return (
    <div className="space-y-4 h-full overflow-y-scroll rounded-md">
      <AssessmentTableToolbar table={table} />
      <div className="rounded-md border">
        <Table className="bg-white">
          <TableHeader className="">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="">
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      className=""
                      onClick={() => handleNavigateToDetail(row.original.id)}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {/* Delete button */}
                  <TableCell className="cursor-pointer" onClick={() => {}}>
                    <DeleteAssessmentDialog
                      assessmentName={row.original.name}
                      handleDelete={() => handleDeleteAssessment(row.original.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AssessmentTablePagination table={table} />
    </div>
  );
};

export default AssessmentTable;
