import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Template from '../template/InterviewDetailPage/InterviewDetailPage';

import { caseSensitiveAxiosInstance } from '@/lib/axios';
import { Interview } from '@/types';

function InterviewDetailPage() {
  const [interviewData, setInterviewData] = useState<Interview | null>(null);
  const params = useParams<{ id: string }>();

  useEffect(() => {
    fetchInterviewResults();
  }, [params.id]);

  const fetchInterviewResults = async () => {
    try {
      const response = await caseSensitiveAxiosInstance.get(
        `/interviews/${params.id}/results`
      );
      if (response.data.status === 'success') {
        setInterviewData(response.data.payload.interview);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!interviewData || !interviewData.answers.length) {
    return null;
  }

  return <Template interviewData={interviewData} />;
}

export default InterviewDetailPage;
