import { ColumnDef } from '@tanstack/react-table';

import { InterviewsTableColumnHeader } from './InterviewsTableColumnHeader';

import { Interview } from '@/types';

export const columns: ColumnDef<Interview>[] = [
  {
    accessorKey: 'created_at',
    
    header: ({ column }) => (
      <InterviewsTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      return <div className="min-w-[80px] max-w-[100px]">{formattedDate}</div>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'candidate.name',
    header: ({ column }) => (
      <InterviewsTableColumnHeader column={column} title="Candidate" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px] max-w-[500px]">
        {row.original.candidate.name}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'testName',
    header: ({ column }) => (
      <InterviewsTableColumnHeader column={column} title="Test Name" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px] max-w-[200px]">
        {row.original.assessment.name}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'totalScore',
    header: ({ column }) => (
      <InterviewsTableColumnHeader column={column} title="Total Score" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.original.totalScore.toFixed(1)}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
