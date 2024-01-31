import { ColumnDef } from '@tanstack/react-table';

import { CandidatesTableColumnHeader } from './CandidatesTableColumnHeader';
import { statuses } from './data';

import { Candidate } from '@/types';

export const columns: ColumnDef<Candidate>[] = [
  {
    accessorKey: 'Created Date',
    header: ({ column }) => (
      <CandidatesTableColumnHeader column={column} title="Created Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.assessment
        ? new Date(row.original.assessment.createdAt)
        : new Date();
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      return <div className="min-w-[80px] max-w-[100px]">{formattedDate}</div>;
    },
    sortingFn: (rowA, rowB) =>
      new Date(rowA.original.assessment?.createdAt as string).getTime() -
      new Date(rowB.original.assessment?.createdAt as string).getTime(),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'Candidate Name',
    header: ({ column }) => (
      <CandidatesTableColumnHeader column={column} title="Candidate Name" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px] max-w-[500px]">{row.original.name}</div>
    ),
    sortingFn: (rowA, rowB) =>
      rowA.original.name!.localeCompare(rowB.original.name!),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'Assessment Name',
    header: ({ column }) => (
      <CandidatesTableColumnHeader column={column} title="Assessment Name" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px] max-w-[200px]">
        {row.original.assessment?.name}
      </div>
    ),
    sortingFn: (rowA, rowB) =>
      rowA.original.assessment?.name.localeCompare(
        rowB.original.assessment?.name as string
      ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'Interview Status',
    header: ({ column }) => (
      <CandidatesTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        status => status.value === row.original.assessment?.interviewStatus
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, _, value) => {
      return value.includes(row.original.assessment?.interviewStatus);
    },
    sortingFn: (rowA, rowB) =>
      rowA.original.assessment?.interviewStatus!.localeCompare(
        rowB.original.assessment?.interviewStatus as string
      ),
    enableSorting: true,
    enableHiding: false,
  },
];
