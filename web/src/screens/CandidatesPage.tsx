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
        setCandidates(response.data.payload);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return <CandidatesPageTemplate candidates={candidates} isLoading={isLoading} />;
};

export default CandidatesPage;
