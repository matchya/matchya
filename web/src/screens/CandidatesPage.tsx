import { useEffect, useState } from 'react';

import { caseSensitiveAxiosInstance } from '@/lib/axios';
import CandidatesPageTemplate from '@/template/CandidatesPage/CandidatesPage';
import { Assessment, Candidate } from '@/types';

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchCandidates();
    fetchAssessments();
  }, []);

  const fetchCandidates = async () => {
    try {
      setIsLoading(true);
      const response = await caseSensitiveAxiosInstance.get('/candidates');
      if (response.data.status === 'success') {
        setCandidates(response.data.payload.candidates);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssessments = async () => {
    try {
      setIsLoading(true);
      const response = await caseSensitiveAxiosInstance.get('/assessments');
      if (response.data.status === 'success') {
        setAssessments(response.data.payload.assessments);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addCandidate = (candidate: Candidate) => {
    setCandidates([...candidates, candidate]);
  }

  return (
    <CandidatesPageTemplate candidates={candidates} assessments={assessments} isLoading={isLoading} addCandidate={addCandidate} />
  );
};

export default CandidatesPage;
