import { useEffect, useState } from 'react';

import { axiosInstance } from '@/lib/axios';
import InterviewsPageTemplate from '@/template/InterviewsPage/InterviewsPage';
import { Interview } from '@/types';

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await axiosInstance.get('/interviews');
      if (response.data.status === 'success') {
        setInterviews(response.data.payload.interviews);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return <InterviewsPageTemplate interviews={interviews} />;
};

export default InterviewsPage;
