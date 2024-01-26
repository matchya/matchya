import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { axiosInstance } from '@/lib/axios';
import AssessmentDetailPageTemplate from '@/template/AssessmentDetailPage/AssessmentDetailPage';
import { Assessment } from '@/types';

const AssessmentDetailPage = () => {
  const params = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  useEffect(() => {
    fetchAssessment();
  }, [params.id]);

  const fetchAssessment = async () => {
    try {
      const response = await axiosInstance.get(`/assessments/${params.id}`);
      if (response.data.status === 'success') {
        setAssessment(response.data.payload.assessment);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return <AssessmentDetailPageTemplate assessment={assessment} />;
};

export default AssessmentDetailPage;
