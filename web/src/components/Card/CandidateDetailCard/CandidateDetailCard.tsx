import { EvaluationTable } from '@/components';
import { Candidate } from '@/types';

interface CandidateDetailCard {
  candidate: Candidate;
}

const CandidateDetailCard = ({ candidate }: CandidateDetailCard) => {
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {candidate?.first_name} {candidate?.last_name}
          </h2>
          <p className="text-muted-foreground">{candidate?.summary}</p>
        </div>
        <div className="text-2xl font-bold tracking-tight">
          {candidate?.total_score.toFixed(1)}
        </div>
      </div>
      <EvaluationTable assessments={candidate ? candidate.assessments : []} />
    </div>
  );
};

export default CandidateDetailCard;
