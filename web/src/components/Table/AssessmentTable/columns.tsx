import { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';

import { AssessmentTableColumnHeader } from './AssessmentTableColumnHeader';

import { mockedAssessments } from '@/data/mock';
import { Assessment, assessmentSchema } from '@/types';

export const columns: ColumnDef<Assessment>[] = [
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <AssessmentTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[80px] max-w-[100px]">
        {row.getValue('updated_at')}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <AssessmentTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px] max-w-[500px]">{row.getValue('name')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'position_type',
    header: ({ column }) => (
      <AssessmentTableColumnHeader column={column} title="Position" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px] max-w-[200px]">
        {row.getValue('position_type')}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'position_level',
    header: ({ column }) => (
      <AssessmentTableColumnHeader column={column} title="Level" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue('position_level')}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'num_candidates',
    header: ({ column }) => (
      <AssessmentTableColumnHeader column={column} title="Candidates" />
    ),
    cell: ({ row }) => (
      <div className="w-[30px]">{row.getValue('num_candidates')}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

export const getTransformedAssessments = async () => {
  const assessments = mockedAssessments;
  return z.array(assessmentSchema).parse(assessments);
};
