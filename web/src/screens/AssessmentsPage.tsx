import { useNavigate } from 'react-router-dom';

import AssessmentsPageTemplate from '@/template/AssessmentsPage/AssessmentsPage';

const AssessmentsPage = () => {
  const navigate = useNavigate();
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
