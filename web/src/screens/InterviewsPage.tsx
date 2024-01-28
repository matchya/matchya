import { useEffect, useState } from 'react';

import { caseSensitiveAxiosInstance } from '@/lib/axios';
import InterviewsPageTemplate from '@/template/InterviewsPage/InterviewsPage';
import { Interview } from '@/types';

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setIsLoading(true);
      const response = await caseSensitiveAxiosInstance.get('/interviews');
      if (response.data.status === 'success') {
        setInterviews(response.data.payload.interviews);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return <InterviewsPageTemplate interviews={interviews} isLoading={isLoading} />;
};

export default InterviewsPage;
