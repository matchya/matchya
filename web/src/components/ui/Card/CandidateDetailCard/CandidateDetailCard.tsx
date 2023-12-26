import { EvaluationTable } from '../../Table/EvaluationTable/EvaluationTable';

import { usePositionStore } from '@/store/store';

export const CandidateDetailCard = () => {
  const { selectedCandidate } = usePositionStore();

  return (
    <div className="h-[calc(100vh-100px)] overflow-hidden space-y-8 p-6 rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 col-span-3">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {selectedCandidate?.first_name} {selectedCandidate?.last_name}
          </h2>
          <p className="text-muted-foreground">{selectedCandidate?.summary}</p>
        </div>
        <div className="text-2xl font-bold tracking-tight">
          {selectedCandidate?.total_score}
        </div>
      </div>
      <EvaluationTable
        assessments={selectedCandidate ? selectedCandidate.assessments : []}
      />
    </div>
  );
};
