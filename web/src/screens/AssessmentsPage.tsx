import { useNavigate } from 'react-router-dom';

import AssessmentsPageTemplate from '@/template/AssessmentsPage/AssessmentsPage';

const AssessmentsPage = () => {
  const navigate = useNavigate();
  const handleNavigateToAssessment = () => {
    navigate('/create-assessment');
  };
  return (
    <AssessmentsPageTemplate
      onNavigateToAssessment={handleNavigateToAssessment}
    />
  );
};

export default AssessmentsPage;
