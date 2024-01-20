import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Template from '../template/CreateAssessmentPage/CreateAssessmentPage';

import { axiosInstance } from '@/lib/client';

function CreateAssessmentPage() {
  const navigate = useNavigate();
  const [testName, setTestName] = useState('Untitled');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (testName === '' || selectedPosition === '' || selectedLevel === '') {
      alert('Test name is required');
      return;
    }
    try {
      setIsLoading(true);
      const data = {
        name: testName,
        position_type: selectedPosition,
        position_level: selectedLevel,
      };
      const response = await axiosInstance.post('/assessments', data);
      if (response.data.status === 'success') {
        console.log(response.data.payload);
        const id = response.data.payload.assessment_id;
        navigate(`/assessments/${id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Template
      testName={testName}
      selectedPosition={selectedPosition}
      selectedLevel={selectedLevel}
      isLoading={isLoading}
      onTestNameChange={(e) => setTestName(e.target.value)}
      onPositionChange={(value: string) => setSelectedPosition(value)}
      onLevelChange={(value: string) => setSelectedLevel(value)}
      handleSubmit={handleSubmit}
    />
  );
}

export default CreateAssessmentPage;
