import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Template from '../template/CreateAssessmentPage/CreateAssessmentPage';

import { caseSensitiveAxiosInstance } from '@/lib/axios';
import { trackEvent } from '@/lib/rudderstack';
import { Quiz } from '@/types';

function CreateAssessmentPage() {
  const navigate = useNavigate();
  const [testName, setTestName] = useState(
    'Junior Software Engineer Assessment'
  );
  const [selectedPosition, setSelectedPosition] = useState('Software Engineer');
  const [selectedLevel, setSelectedLevel] = useState('Junior');
  const [quizes, setQuizes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchQuizes();
  }, []);

  const fetchQuizes = async () => {
    try {
      const response = await caseSensitiveAxiosInstance.get('/quizes');
      if (response.data.status === 'success') {
        setQuizes(response.data.payload.quizes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    trackEvent({
      eventName: 'create_assessment',
      properties: {
        testName,
        selectedPosition,
        selectedLevel,
        // quizIds: selectedQuizzes.map(quiz => quiz.id),
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
        topics: [],
      };
      const response = await caseSensitiveAxiosInstance.post(
        '/assessments',
        data
      );
      if (response.data.status === 'success') {
        const assessment = response.data.payload.assessment;
        navigate(`/assessments/${assessment.id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePositionChange = (value: string) => {
    if (
      testName === '' ||
      testName === `${selectedLevel} ${selectedPosition} Assessment`
    ) {
      setTestName(`${selectedLevel} ${value} Assessment`);
    }
    setSelectedPosition(value);
  };

  const handleLevelChange = (value: string) => {
    if (
      testName === '' ||
      testName === `${selectedLevel} ${selectedPosition} Assessment`
    ) {
      setTestName(`${value} ${selectedPosition} Assessment`);
    }
    setSelectedLevel(value);
  };

  return (
    <Template
      testName={testName}
      quizes={quizes}
      selectedPosition={selectedPosition}
      selectedLevel={selectedLevel}
      isLoading={isLoading}
      onTestNameChange={e => setTestName(e.target.value)}
      onPositionChange={(value: string) => handlePositionChange(value)}
      onLevelChange={(value: string) => handleLevelChange(value)}
      handleSubmit={handleSubmit}
    />
  );
}

export default CreateAssessmentPage;
