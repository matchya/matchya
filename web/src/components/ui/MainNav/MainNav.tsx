import { useState, useEffect, useRef } from 'react';

import { AddCandidateDialog } from '../Dialog/AddCandidateDialog/AddCandidateDialog';
import { GenerateCriteriaDialog } from '../Dialog/GenerateCriteriaDialog/GenerateCriteriaDialog';
import { Icons } from '../Icons/Icons';
import { ChecklistSheet } from '../Sheet/ChecklistSheet/ChecklistSheet';
import { Sheet, SheetTrigger } from '../Sheet/Sheet';

import { Button } from '@/components/ui/Button/Button';
import { axiosInstance } from '@/helper';
import { cn } from '@/lib/utils';
import { usePositionStore } from '@/store/usePositionStore';
import { Candidate, CustomError } from '@/types';

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const POLLING_INTERVAL = 20000;
  const [shouldOpen, setShouldOpen] = useState({
    generateCriteria: false,
    addCandidate: false,
  });
  const { selectedPosition, selectPosition, setPositionDetail } =
    usePositionStore();
  const [isAddCandidateLoading, setIsAddCandidateLoading] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        if (!selectedPosition) {
          return;
        }
        const response = await axiosInstance.get(
          `/positions/status/checklist/${selectedPosition?.id}`
        );
        if (response.data.payload.checklist_status === 'succeeded') {
          setPositionDetail(selectedPosition.id);
          selectedPosition.checklist_status = 'succeeded';
          clearInterval(interval);
        }
        if (response.data.payload.checklist_status === 'failed') {
          selectPosition({ ...selectedPosition, checklist_status: 'failed' });
          clearInterval(interval);
        }
      } catch (error) {
        console.error(error);
        // handle error appropriately
      }
    };

    if (selectedPosition?.checklist_status === 'scheduled') {
      interval = setInterval(fetchStatus, POLLING_INTERVAL);
    }

    return () => clearInterval(interval);
  }, [selectedPosition?.checklist_status]);

  const getMessage = () => {
    if (selectedPosition?.checklist_status === 'scheduled') {
      return 'Generating Criteria...';
    } else if (selectedPosition?.checklist_status === 'unscheduled') {
      return 'Generate Criteria';
    } else {
      return 'Generation Failed';
    }
  };

  const handleAddCandidate = async (candidateInput: {
    firstName: string;
    lastName: string;
    githubUsername: string;
    email: string;
  }) => {
    if (!selectedPosition?.checklist.id) {
      return;
    }
    setIsAddCandidateLoading(true);
    try {
      const response = await axiosInstance.post('/checklists/evaluate', {
        checklist_id: selectedPosition?.checklist.id,
        candidate_first_name: candidateInput.firstName,
        candidate_last_name: candidateInput.lastName,
        candidate_github_username: candidateInput.githubUsername,
        candidate_email: candidateInput.email,
      });
      if (response.data.status === 'success') {
        const id = response.data.payload.candidate_id;
        const candidate: Candidate = {
          id: id,
          first_name: candidateInput.firstName,
          last_name: candidateInput.lastName,
          email: candidateInput.email,
          github_username: candidateInput.githubUsername,
          total_score: 0,
          summary: '',
          status: 'scheduled',
          assessments: [],
        };
        selectedPosition?.checklist.candidates.push(candidate);
        selectPosition(selectedPosition);
        setShouldOpen({ ...shouldOpen, addCandidate: false });
      }
    } catch (error) {
      const err = error as CustomError;
      if (err.response.status === 400) {
        console.error(err.response.data.message);
      } else {
        console.error('Something went wrong. Please try again.');
      }
    }
    setIsAddCandidateLoading(false);
  };

  return (
    <Sheet>
      <nav
        className={cn('flex items-center space-x-4 lg:space-x-6', className)}
        {...props}
      >
        {['unscheduled', 'scheduled', 'failed'].includes(
          selectedPosition ? selectedPosition.checklist_status : ''
        ) ? (
          <Button
            disabled={
              selectedPosition?.checklist_status !== 'unscheduled' &&
              selectedPosition?.checklist_status !== 'failed'
            }
            onClick={() =>
              setShouldOpen({
                ...shouldOpen,
                generateCriteria: !shouldOpen.generateCriteria,
              })
            }
          >
            {selectedPosition?.checklist_status === 'scheduled' && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {getMessage()}
          </Button>
        ) : null}
        {selectedPosition?.checklist_status === 'succeeded' ? (
          <>
            <SheetTrigger asChild>
              <Button variant="outline">See Checklist</Button>
            </SheetTrigger>
            <ChecklistSheet selectedPosition={selectedPosition} />
          </>
        ) : null}
        {selectedPosition &&
        selectedPosition.checklist_status === 'succeeded' ? (
          <div>
            <Button
              onClick={() =>
                setShouldOpen({ ...shouldOpen, addCandidate: true })
              }
              variant="outline"
            >
              Add Candidate
            </Button>
            <AddCandidateDialog
              shouldOpen={shouldOpen.addCandidate}
              isLoading={isAddCandidateLoading}
              onClose={() =>
                setShouldOpen({ ...shouldOpen, addCandidate: false })
              }
              onSubmit={handleAddCandidate}
            />
          </div>
        ) : null}
        <GenerateCriteriaDialog
          shouldOpen={shouldOpen.generateCriteria}
          onClose={() =>
            setShouldOpen({ ...shouldOpen, generateCriteria: false })
          }
        />
      </nav>
    </Sheet>
  );
}
