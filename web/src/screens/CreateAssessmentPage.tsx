import { useState } from 'react';

import Template from '../template/CreateAssessmentPage/CreateAssessmentPage';

function CreateAssessmentPage() {
  const [testName, setTestName] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const handleTestNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTestName(event.target.value);
  const handlePositionChange = (value: string) => setSelectedPosition(value);
  const handleLevelChange = (value: string) => setSelectedLevel(value);
  const handleNavigateToQuestionGenerationPage = () => {
    console.log('navigate to question generation page');
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
