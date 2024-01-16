import { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';

import { CandidatesTableColumnHeader } from './CandidatesTableColumnHeader';

import { mockedCandidates } from '@/data/mock';
import { Candidate, candidateSchema } from '@/types';

export const columns: ColumnDef<Candidate>[] = [
  {
    accessorKey: 'result',
    header: ({ column }) => (
      <CandidatesTableColumnHeader column={column} title="Assessment Date" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[80px] max-w-[100px]">
        {row.original.result.createdAt}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <CandidatesTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px] max-w-[500px]">
        {`${row.original.firstName} ${row.original.lastName}`}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'testName',
    header: ({ column }) => (
      <CandidatesTableColumnHeader column={column} title="Test Name" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px] max-w-[200px]">
        {row.original.result.testName}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'totalScore',
    header: ({ column }) => (
      <CandidatesTableColumnHeader column={column} title="Total Score" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.original.result.totalScore}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

export const getTransformedCandidates = async () => {
  const candidates = mockedCandidates;
  return z.array(candidateSchema).parse(candidates);
};
