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
    cell: ({ row }) => {
      const date = new Date(row.original.assessment.createdAt);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      return <div className="min-w-[80px] max-w-[100px]">{formattedDate}</div>;
    },
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
    accessorKey: 'assessmentName',
    header: ({ column }) => (
      <CandidatesTableColumnHeader column={column} title="Assessment" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px] max-w-[200px]">
        {row.original.assessment.assessmentName}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'interviewStatus',
    header: ({ column }) => (
      <CandidatesTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.original.assessment.interviewStatus}</div>
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
