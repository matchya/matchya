import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { caseSensitiveAxiosInstance } from '@/lib/client';
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
    navigate('/create-assessment');
  };

  const handleNavigateToDetail = (id: string) => {
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
