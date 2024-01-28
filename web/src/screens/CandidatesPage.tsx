import { useEffect, useState } from 'react';

import { caseSensitiveAxiosInstance } from '@/lib/axios';
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
        setCandidates(response.data.payload.candidates);
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
