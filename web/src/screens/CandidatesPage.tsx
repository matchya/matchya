import { useEffect, useState } from 'react';

import { caseSensitiveAxiosInstance } from '@/lib/client';
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
      const response = await caseSensitiveAxiosInstance.get('/candidates');
      if (response.data.status === 'success') {
        const candidates: Candidate[] = response.data.payload.candidates.map(
          (candidate: any) => {
            return {
              id: candidate.id,
              firstName: candidate.firstName,
              lastName: candidate.lastName,
              email: candidate.email,
              assessment: {
                assessmentId: candidate.assessment.assessmentId,
                assessmentName: candidate.assessment.assessmentName,
                interviewId: candidate.assessment.interviewId,
                interviewStatus: candidate.assessment.interviewStatus,
                totalScore: candidate.assessment.totalScore,
                createdAt: candidate.assessment.createdAt,
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
