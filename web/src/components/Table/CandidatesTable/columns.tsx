import { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';

import { CandidatesTableColumnHeader } from './CandidatesTableColumnHeader';

import { mockedCandidates } from '@/data/mock';
import { Candidate, candidateSchema } from '@/types';

export const columns: ColumnDef<Candidate>[] = [
  {
    accessorKey: 'assessment',
    header: ({ column }) => (
      <CandidatesTableColumnHeader column={column} title="Added at" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[80px] max-w-[100px]">
        {row.original.assessment.created_at}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'first_name',
    header: ({ column }) => (
      <CandidatesTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px] max-w-[500px]">
        {`${row.original.first_name} ${row.original.last_name}`}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'assessment_name',
    header: ({ column }) => (
      <CandidatesTableColumnHeader column={column} title="Assessment" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px] max-w-[200px]">
        {row.original.assessment.assessment_name}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'interview_status',
    header: ({ column }) => (
      <CandidatesTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.original.assessment.interview_status}</div>
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
