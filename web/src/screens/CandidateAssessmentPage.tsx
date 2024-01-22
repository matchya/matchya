import { mockedQuestion } from '@/data/mock';
import { CandidateAssessmentPageTemplate } from '@/template';

const CandidateAssessmentPage = () => {
  return <CandidateAssessmentPageTemplate question={mockedQuestion} />;
};

export default CandidateAssessmentPage;
