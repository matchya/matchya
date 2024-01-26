import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Template from '../template/InterviewDetailPage/InterviewDetailPage';

import { caseSensitiveAxiosInstance } from '@/lib/axios';
import { trackEvent } from '@/lib/rudderstack';
import { Interview } from '@/types';

function InterviewDetailPage() {
  const [interview, setInterview] = useState<Interview | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState(null);
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
        setInterview(response.data.payload.interview);
        if (response.data.payload.interview.answers.length > 0) {
          setCurrentAnswer(
            response.data.payload.interview.answers[0]
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectVideo = (answer: any) => {
    if (!interview || !interview.answers.length) return;
    const id = answer.questionId
    trackEvent({ eventName: 'select_video', properties: { id } });
    setCurrentAnswer(answer);
  };

  if (!interview) {
    return null;
  }

  return (
    <Template
      currentAnswer={currentAnswer}
      interview={interview}
      onSelectVideo={handleSelectVideo}
    />
  );
}

export default InterviewDetailPage;
