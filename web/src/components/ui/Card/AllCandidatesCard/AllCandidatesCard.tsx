import { Avatar } from '../../Avatar/Avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../Card';

import { Icons } from '@/components/ui/Icons/Icons';
import { usePositionStore } from '@/store/usePositionStore';
import { Candidate } from '@/types';

interface AllCandidatesCardProps {
  candidates: Candidate[];
}

export const AllCandidatesCard = ({ candidates }: AllCandidatesCardProps) => {
  return (
    <Card className="col-span-3 h-[calc(100vh-100px)] overflow-hidden">
      <CardHeader>
        <CardTitle>Candidates</CardTitle>
        <CardDescription>
          You evaluated {candidates.length} candidates
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <div className="space-y-2 h-full pb-24 overflow-y-scroll">
          {candidates.map(candidate => (
            <CandidateRow key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface CandidateRowProps {
  candidate: Candidate;
}

const CandidateRow = ({ candidate }: CandidateRowProps) => {
  const { selectedCandidate, selectCandidate } = usePositionStore();
  const handleSelect = () => {
    if (selectedCandidate?.id === candidate.id) {
      return;
    }
    selectCandidate(candidate);
  };

  return (
    <div
      className={`flex items-center p-2 rounded-md ${
        selectedCandidate?.id === candidate.id ? 'bg-gray-50' : ''
      }`}
      onClick={handleSelect}
    >
      <Avatar
        size={10}
        altName={`${
          candidate.first_name.length > 0
            ? candidate.first_name[0].toUpperCase()
            : ''
        }${
          candidate.last_name.length > 0
            ? candidate.last_name[0].toUpperCase()
            : ''
        }`}
      />
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{`${candidate.first_name} ${candidate.last_name}`}</p>
        <p className="text-sm text-muted-foreground">{candidate.email}</p>
      </div>
      {candidate.status == 'scheduled' ? (
        <Icons.spinner className="ml-auto h-5 w-5 animate-spin" />
      ) : candidate.status == 'failed' ? (
        <div className="ml-auto font-medium">retry</div>
      ) : (
        <div className="ml-auto font-medium">{candidate.total_score}</div>
      )}
    </div>
  );
};
