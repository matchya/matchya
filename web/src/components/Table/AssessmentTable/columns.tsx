import { ColumnDef } from '@tanstack/react-table';

import { AssessmentTableColumnHeader } from './AssessmentTableColumnHeader';

import { Assessment } from '@/types';

export const columns: ColumnDef<Assessment>[] = [
  {
    accessorKey: 'Updated At',
    header: ({ column }) => (
      <AssessmentTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      return <div className="min-w-[80px] max-w-[100px]">{formattedDate}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'Assessment Name',
    header: ({ column }) => (
      <AssessmentTableColumnHeader column={column} title="Assessment Name" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px] max-w-[500px]">{row.original.name}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'Position',
    header: ({ column }) => (
      <AssessmentTableColumnHeader column={column} title="Position" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px] max-w-[200px]">
        {row.original.positionType}
      </div>
    ),
    filterFn: (row, _, value) => {
      return value.includes(row.original.positionType);
    },
  },
  {
    accessorKey: 'Position Level',
    header: ({ column }) => (
      <AssessmentTableColumnHeader column={column} title="Position Level" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.original.positionLevel}</div>
    ),
    filterFn: (row, _, value) => {
      return value.includes(row.original.positionLevel);
    },
  },
  {
    accessorKey: 'Number of Candidates',
    header: ({ column }) => (
      <AssessmentTableColumnHeader
        column={column}
        title="Number of Candidates"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[30px]">{row.original.numCandidates}</div>
    ),
    enableSorting: true,
  },
];
