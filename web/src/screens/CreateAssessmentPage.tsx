import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Template from '../template/CreateAssessmentPage/CreateAssessmentPage';

import { caseSensitiveAxiosInstance } from '@/lib/axios';
import { trackEvent } from '@/lib/rudderstack';

function CreateAssessmentPage() {
  const navigate = useNavigate();
  const [testName, setTestName] = useState('Junior Software Engineer Assessment');
  const [selectedPosition, setSelectedPosition] = useState('Software Engineer');
  const [selectedLevel, setSelectedLevel] = useState('Junior');
  const [advanceSettingOpen, setAdvanceSettingOpen] = useState(false);
  const [topicInputValue, setTopicInputValue] = useState<string>('');
  const [specifiedTopics, setSpecifiedTopics] = useState<string[]>([]);
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
        topics: specifiedTopics,
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

  const handleAddTopics = () => {
    if (topicInputValue === '' || specifiedTopics.includes(topicInputValue)) {
      return;
    }
    setSpecifiedTopics([...specifiedTopics, topicInputValue]);
    setTopicInputValue('');
  }

  const handleRemoveTopic = (topic: string) => {  
    const newTopics = specifiedTopics.filter(t => t !== topic);
    setSpecifiedTopics(newTopics);
  }

  return (
    <Template
      testName={testName}
      selectedPosition={selectedPosition}
      selectedLevel={selectedLevel}
      advanceSettingOpen={advanceSettingOpen}
      topicInputValue={topicInputValue}
      specifiedTopics={specifiedTopics}
      isLoading={isLoading}
      onTestNameChange={e => setTestName(e.target.value)}
      onPositionChange={(value: string) => handlePositionChange(value)}
      onLevelChange={(value: string) => handleLevelChange(value)}
      setAdvanceSettingOpen={setAdvanceSettingOpen}
      setTopicInputValue={setTopicInputValue}
      handleAddTopics={handleAddTopics}
      handleRemoveTopic={handleRemoveTopic}
      handleSubmit={handleSubmit}
    />
  );
}

export default CreateAssessmentPage;
