import { ColumnDef } from '@tanstack/react-table';

import { AssessmentTableColumnHeader } from './AssessmentTableColumnHeader';

import { Assessment } from '@/types';

export const columns: ColumnDef<Assessment>[] = [
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <AssessmentTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[80px] max-w-[100px]">
        {(row.getValue('updatedAt') as string).substring(0, 10)}
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
    accessorKey: 'positionType',
    header: ({ column }) => (
      <AssessmentTableColumnHeader column={column} title="Position" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px] max-w-[200px]">
        {row.getValue('positionType')}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'positionLevel',
    header: ({ column }) => (
      <AssessmentTableColumnHeader column={column} title="Level" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue('positionLevel')}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'numCandidates',
    header: ({ column }) => (
      <AssessmentTableColumnHeader column={column} title="Candidates" />
    ),
    cell: ({ row }) => (
      <div className="w-[30px]">{row.getValue('numCandidates')}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
