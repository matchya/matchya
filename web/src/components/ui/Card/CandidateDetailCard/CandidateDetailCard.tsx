import { z } from 'zod';

import { EvaluationTable } from '../../Table/EvaluationTable/EvaluationTable';
import { mockedAssessments } from '../../Table/EvaluationTable/mock';
import { assessmentSchema } from '../../Table/EvaluationTable/schema';

import { Candidate } from '@/types';

interface CandidateDetailCardProps {
  candidate: Candidate;
}

async function getAssessments() {
  const assessments = mockedAssessments;
  return z.array(assessmentSchema).parse(assessments);
}
const assessments = await getAssessments();

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
      <EvaluationTable assessments={assessments} />
    </div>
  );
};
