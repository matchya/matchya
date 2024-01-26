import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { caseSensitiveAxiosInstance } from '@/lib/axios';
import { trackEvent } from '@/lib/rudderstack';
import AssessmentsPageTemplate from '@/template/AssessmentsPage/AssessmentsPage';
import { Assessment } from '@/types';

const AssessmentsPage = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await caseSensitiveAxiosInstance.get('/assessments');
      if (response.data.status === 'success') {
        setAssessments(response.data.payload.assessments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigateToAssessment = () => {
    trackEvent({
      eventName: 'navigate_to_assessment',
      properties: { assessmentsCount: assessments.length },
    });
    navigate('/assessments/create');
  };

  const handleNavigateToDetail = (id: string) => {
    trackEvent({
      eventName: 'navigate_to_assessment_details',
      properties: { assessmentId: id },
    });
    navigate(`/assessments/${id}`);
  };

  return (
    <AssessmentsPageTemplate
      assessments={assessments}
      onNavigateToAssessment={handleNavigateToAssessment}
      handleNavigateToDetail={handleNavigateToDetail}
    />
  );
};

export default AssessmentsPage;
