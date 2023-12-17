import { Avatar } from '../../Avatar/Avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../Card';

import { Candidate } from '@/types';

interface AllCandidatesCardProps {
  selectedCandidateId: string;
  candidates: Candidate[];
  onCandidateSelect: (candidateId: string) => void;
}

export const AllCandidatesCard = ({
  selectedCandidateId,
  candidates,
}: AllCandidatesCardProps) => {
  return (
    <Card className="col-span-3 h-full">
      <CardHeader>
        <CardTitle>Candidates</CardTitle>
        <CardDescription>
          You evaluated {candidates.length} candidates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {candidates.map(candidate => (
            <CandidateRow
              key={candidate.id}
              candidate={candidate}
              selectedCandidateId={selectedCandidateId}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface CandidateRowProps {
  candidate: Candidate;
  selectedCandidateId: string;
}

const CandidateRow = ({
  selectedCandidateId,
  candidate,
}: CandidateRowProps) => {
  return (
    <div
      className={`flex items-center p-2 rounded-md ${
        selectedCandidateId === candidate.id ? 'bg-gray-50' : ''
      }`}
    >
      <Avatar
        size={10}
        altName={`${candidate.first_name[0].toUpperCase()}${candidate.last_name[0].toUpperCase()}`}
      />
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{`${candidate.first_name} ${candidate.last_name}`}</p>
        <p className="text-sm text-muted-foreground">{candidate.email}</p>
      </div>
      <div className="ml-auto font-medium">{candidate.total_score}</div>
    </div>
  );
};
