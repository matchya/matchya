import { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';

import { InterviewsTableColumnHeader } from './InterviewsTableColumnHeader';

import { mockedInterviews } from '@/data/mock';
import { Interview, interviewSchema } from '@/types';

export const columns: ColumnDef<Interview>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <InterviewsTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[80px] max-w-[100px]">{row.original.createdAt}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'candidatename',
    header: ({ column }) => (
      <InterviewsTableColumnHeader column={column} title="Candidate" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px] max-w-[500px]">
        {row.original.candidateName}
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
      <div className="min-w-[150px] max-w-[200px]">{row.original.testName}</div>
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
      <div className="w-[80px]">{row.original.totalScore}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

export const getTransformedInterviews = async () => {
  const Interviews = mockedInterviews;
  return z.array(interviewSchema).parse(Interviews);
};
