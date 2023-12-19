import { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';

import { EvaluationTableColumnHeader } from './EvaluationTableColumnHeader';
import { mockedAssessments } from './mock';
import { Assessment, assessmentSchema } from './schema';

import { Criterion } from '@/types';

export const columns: ColumnDef<Assessment>[] = [
  {
    accessorKey: 'criterion',
    header: ({ column }) => (
      <EvaluationTableColumnHeader column={column} title="Criterion" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px]">
        {(row.getValue('criterion') as Criterion).message}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'reason',
    header: ({ column }) => (
      <EvaluationTableColumnHeader column={column} title="Reason" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px]">{row.getValue('reason')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'score',
    header: ({ column }) => (
      <EvaluationTableColumnHeader column={column} title="Score" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('score')}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

async function getAssessments() {
  const assessments = mockedAssessments;
  return z.array(assessmentSchema).parse(assessments);
}

export const assessments = await getAssessments();
