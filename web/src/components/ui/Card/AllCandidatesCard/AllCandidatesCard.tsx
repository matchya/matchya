import { useState } from 'react';

import { Avatar } from '../../Avatar/Avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../Card';

import { Button } from '@/components/ui/Button/Button';
import { Icons } from '@/components/ui/Icons/Icons';
import { axiosInstance } from '@/helper';
import { usePositionStore } from '@/store/usePositionStore';
import { Candidate, CustomError } from '@/types';

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
  const [retryDisabled, setRetryDisabled] = useState(false);
  const {
    selectedPosition,
    selectPosition,
    selectedCandidate,
    selectCandidate,
  } = usePositionStore();

  const handleSelect = () => {
    if (selectedCandidate?.id === candidate.id) {
      return;
    }
    selectCandidate(candidate);
  };

  const handleRetry = async () => {
    candidate = { ...candidate, status: 'scheduled' };
    try {
      if (!selectedPosition || !selectedCandidate) {
        return;
      }
      setRetryDisabled(true);
      const res = await axiosInstance.post('/checklists/evaluate', {
        checklist_id: selectedPosition?.checklist.id,
        candidate_first_name: candidate.first_name,
        candidate_last_name: candidate.last_name,
        candidate_github_username: candidate.github_username,
        candidate_email: candidate.email,
      });
      if (res.data.status === 'success') {
        selectPosition({
          ...selectedPosition,
          candidates: selectedPosition.candidates.map(c =>
            c.id === candidate.id ? candidate : c
          ),
        });
      }
    } catch (error) {
      const err = error as CustomError;
      if (err.response.status === 400) {
        console.error(err.response.data.message);
      } else {
        console.error('Something went wrong. Please try again.');
      }
    } finally {
      setRetryDisabled(false);
    }
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
        <Icons.spinner className="ml-auto mr-5 h-5 w-5 animate-spin" />
      ) : candidate.status == 'failed' ? (
        <Button
          variant="outline"
          disabled={retryDisabled}
          size="sm"
          className="ml-auto font-medium"
          onClick={handleRetry}
        >
          Retry
        </Button>
      ) : (
        <div className="ml-auto mr-5 font-medium">{candidate.total_score}</div>
      )}
    </div>
  );
};
