import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { QuestionsList } from '@/fragments';
import { axiosInstance } from '@/lib/axios';
import { AssessmentDetailPageTemplate } from '@/template';
import { Assessment } from '@/types';

const AssessmentDetailPage = () => {
  const params = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchAssessment();
  }, [params.id]);

  const fetchAssessment = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/assessments/${params.id}`);
      if (response.data.status === 'success') {
        const assessmentData: Assessment = response.data.payload.assessment;
        setAssessment(assessmentData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AssessmentDetailPageTemplate
      assessment={assessment}
      isLoading={isLoading}
      questionsListFragment={
        <QuestionsList initialQuestions={assessment?.questions || null} />
      }
    />
  );
};

export default AssessmentDetailPage;
