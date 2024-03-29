import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { axiosInstance, caseSensitiveAxiosInstance } from '@/lib/axios';
import { trackEvent } from '@/lib/rudderstack';
import AssessmentsPageTemplate from '@/template/AssessmentsPage/AssessmentsPage';
import { Assessment } from '@/types';

const AssessmentsPage = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setIsLoading(true);
      const response = await caseSensitiveAxiosInstance.get('/assessments');
      if (response.data.status === 'success') {
        setAssessments(response.data.payload.assessments);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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

  const handleDeleteAssessment = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/assessments/${id}`);
      if (response.data.status === 'success') {
        setAssessments(assessments.filter((assessment) => assessment.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AssessmentsPageTemplate
      assessments={assessments}
      isLoading={isLoading}
      onNavigateToAssessment={handleNavigateToAssessment}
      handleNavigateToDetail={handleNavigateToDetail}
      handleDeleteAssessment={handleDeleteAssessment}
    />
  );
};

export default AssessmentsPage;
