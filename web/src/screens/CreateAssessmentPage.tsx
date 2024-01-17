import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Template from '../template/CreateAssessmentPage/CreateAssessmentPage';

function CreateAssessmentPage() {
  const navigate = useNavigate();
  const [testName, setTestName] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const handleTestNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTestName(event.target.value);
  const handlePositionChange = (value: string) => setSelectedPosition(value);
  const handleLevelChange = (value: string) => setSelectedLevel(value);
  const handleNavigateToQuestionGenerationPage = () => {
    // TODO: need a middle step to generate the questions
    navigate('/assessments/123');
  };

  return (
    <Template
      testName={testName}
      selectedPosition={selectedPosition}
      selectedLevel={selectedLevel}
      onTestNameChange={handleTestNameChange}
      onPositionChange={handlePositionChange}
      onLevelChange={handleLevelChange}
      onNavigateToQuestionGenerationPage={
        handleNavigateToQuestionGenerationPage
      }
    />
  );
}

export default CreateAssessmentPage;
