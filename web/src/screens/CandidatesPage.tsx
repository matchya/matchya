import { useEffect, useState } from 'react';

import { axiosInstance } from '@/lib/client';
import CandidatesPageTemplate from '@/template/CandidatesPage/CandidatesPage';
import { Candidate } from '@/types';

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/candidates');
      if (response.data.status === 'success') {
        const candidates: Candidate[] = response.data.payload.candidates.map(
          (candidate: any) => {
            return {
              id: candidate.id,
              name: candidate.name,
              email: candidate.email,
              assessment: {
                assessment_id: candidate.assessment.assessment_id,
                assessment_name: candidate.assessment.assessment_name,
                interview_id: candidate.assessment.interview_id,
                interview_status: candidate.assessment.interview_status,
                total_score: candidate.assessment.total_score,
                created_at: candidate.assessment.created_at,
              },
            };
          }
        );
        setCandidates(candidates);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CandidatesPageTemplate candidates={candidates} isLoading={isLoading} />
  );
};

export default CandidatesPage;
