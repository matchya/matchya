import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { axiosInstance } from '@/lib/client';
import AssessmentsPageTemplate from '@/template/AssessmentsPage/AssessmentsPage';

const AssessmentsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const res = await axiosInstance.get('/assessments');
      if (res.data.status == 'success') {
        console.log(res.data.payload);
      }
    } catch (err) {
      console.error(err);
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
      onNavigateToAssessment={handleNavigateToAssessment}
      handleNavigateToDetail={handleNavigateToDetail}
    />
  );
};

export default AssessmentsPage;
