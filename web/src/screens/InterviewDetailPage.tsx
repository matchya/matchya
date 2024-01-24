import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Template from '../template/InterviewDetailPage/InterviewDetailPage';

import { axiosInstance } from '@/lib/axios';

function InterviewDetailPage() {
  const [interview, setInterview] = useState(null);
  const [questionId, setQuestionId] = useState('');
  const params = useParams<{ id: string }>();

  useEffect(() => {
    fetchInterviewResults();
  }, [params.id]);

  const fetchInterviewResults = async () => {
    try {
      const response = await axiosInstance.get(
        `/interviews/${params.id}/results`
      );
      if (response.data.status === 'success') {
        setInterview(response.data.payload.interview);
        setQuestionId(response.data.payload.interview.answers[0].question_id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!interview) {
    return null;
  }

  return (
    <Template
      questionId={questionId}
      interview={interview}
      selectVideo={(questionId: string) => setQuestionId(questionId)}
    />
  );
}

export default InterviewDetailPage;
