import { EvaluationTable } from '../../Table/EvaluationTable/EvaluationTable';

import { Candidate } from '@/types';

interface CandidateDetailCard {
  candidate: Candidate;
}

export const CandidateDetailCard = ({ candidate }: CandidateDetailCard) => {
  return (
    <div className="h-[calc(100vh-100px)] overflow-hidden space-y-8 p-6 rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 col-span-3">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {candidate?.first_name} {candidate?.last_name}
          </h2>
          <p className="text-muted-foreground">{candidate?.summary}</p>
        </div>
        <div className="text-2xl font-bold tracking-tight">
          {candidate?.total_score}
        </div>
      </div>
      <EvaluationTable assessments={candidate ? candidate.assessments : []} />
    </div>
  );
};
