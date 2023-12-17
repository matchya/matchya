import { z } from 'zod';

import { Avatar } from '../../Avatar/Avatar';

import { columns } from './columns';
import { DataTable } from './DataTable';
import { taskSchema } from './schema';
import { mockedTasks } from './tasks';

import { Candidate } from '@/types';

interface CandidateDetailCardProps {
  candidate: Candidate;
}

async function getTasks() {
  const tasks = mockedTasks;
  return z.array(taskSchema).parse(tasks);
}
const tasks = await getTasks();

export const CandidateDetailCard = ({
  candidate,
}: CandidateDetailCardProps) => {
  return (
    <div className="space-y-8 p-6 rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 col-span-3 h-full">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {candidate.first_name} {candidate.last_name}
          </h2>
          <p className="text-muted-foreground">{candidate.summary}</p>
        </div>
        <div className="text-2xl font-bold tracking-tight">
          {candidate.total_score}
        </div>
      </div>
      <DataTable data={tasks} columns={columns} />
    </div>
  );
};
