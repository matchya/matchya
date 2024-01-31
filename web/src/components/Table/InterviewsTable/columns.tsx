import { ColumnDef } from '@tanstack/react-table';

import { InterviewsTableColumnHeader } from './InterviewsTableColumnHeader';

import { Interview } from '@/types';

export const columns: ColumnDef<Interview>[] = [
  {
    accessorKey: 'Created Date',
    header: ({ column }) => (
      <InterviewsTableColumnHeader column={column} title="Created Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt as string);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      return <div className="min-w-[80px] max-w-[100px]">{formattedDate}</div>;
    },
    sortingFn: (rowA, rowB) =>
      new Date(rowA.original.createdAt as string).getTime() -
      new Date(rowB.original.createdAt as string).getTime(),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'Candidate Name',
    header: ({ column }) => (
      <InterviewsTableColumnHeader column={column} title="Candidate Name" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px] max-w-[500px]">
        {row.original.candidate.name}
      </div>
    ),
    sortingFn: (rowA, rowB) =>
      rowA.original.candidate.name.localeCompare(rowB.original.candidate.name),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'Assessment Name',
    header: ({ column }) => (
      <InterviewsTableColumnHeader column={column} title="Assessment Name" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px] max-w-[200px]">
        {row.original.assessment.name}
      </div>
    ),
    filterFn: (row, _, value) => {
      return value.includes(row.original.assessment.name);
    },
    sortingFn: (rowA, rowB) =>
      rowA.original.assessment.name.localeCompare(
        rowB.original.assessment.name
      ),
  },
  {
    accessorKey: 'Total Score',
    header: ({ column }) => (
      <InterviewsTableColumnHeader column={column} title="Total Score" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.original.totalScore.toFixed(1)}</div>
    ),
    filterFn: (row, _, value) => {
      return value.includes(row.original.totalScore);
    },
    sortingFn: (rowA, rowB) =>
      rowA.original.totalScore - rowB.original.totalScore,
  },
];
