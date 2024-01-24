import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Template from '../template/CreateAssessmentPage/CreateAssessmentPage';

import { caseSensitiveAxiosInstance } from '@/lib/client';
import { trackEvent } from '@/lib/rudderstack';

function CreateAssessmentPage() {
  const navigate = useNavigate();
  const [testName, setTestName] = useState('Untitled');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    trackEvent({
      eventName: 'create_assessment',
      properties: {
        testName,
        selectedPosition,
        selectedLevel,
      },
    });
    if (testName === '' || selectedPosition === '' || selectedLevel === '') {
      alert('Test name is required');
      return;
    }
    try {
      setIsLoading(true);
      const data = {
        name: testName,
        positionType: selectedPosition,
        positionLevel: selectedLevel,
      };
      const response = await caseSensitiveAxiosInstance.post(
        '/assessments',
        data
      );
      if (response.data.status === 'success') {
        console.log(response.data.payload);
        const id = response.data.payload.assessmentId;
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
      onTestNameChange={e => setTestName(e.target.value)}
      onPositionChange={(value: string) => setSelectedPosition(value)}
      onLevelChange={(value: string) => setSelectedLevel(value)}
      handleSubmit={handleSubmit}
    />
  );
}

export default CreateAssessmentPage;
