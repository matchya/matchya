import { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';

import { CandidateTableColumnHeader } from './CandidateTableColumnHeader';

import { mockedCandidates } from '@/data/mock';
import { Candidate, candidateSchema } from '@/types';

export const columns: ColumnDef<Candidate>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <CandidateTableColumnHeader column={column} title="Assessment Date" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[80px] max-w-[100px]">{row.getValue('result')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'candidateName',
    header: ({ column }) => (
      <CandidateTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px] max-w-[500px]">
        {row.getValue('firstName')} {row.getValue('lastName')}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'testName',
    header: ({ column }) => (
      <CandidateTableColumnHeader column={column} title="Test Name" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px] max-w-[200px]">
        {JSON.stringify(row.getValue('result'))}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'totalScore',
    header: ({ column }) => (
      <CandidateTableColumnHeader column={column} title="Total Score" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue('result.totalScore')}</div>
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
