import { ColumnDef } from '@tanstack/react-table';

import { EvaluationTableColumnHeader } from './EvaluationTableColumnHeader';
import { Assessment } from './schema';

export const columns: ColumnDef<Assessment>[] = [
  {
    accessorKey: 'criterion',
    header: ({ column }) => (
      <EvaluationTableColumnHeader column={column} title="Criterion" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px]">{row.getValue('criterion')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'message',
    header: ({ column }) => (
      <EvaluationTableColumnHeader column={column} title="Message" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px]">{row.getValue('message')}</div>
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
