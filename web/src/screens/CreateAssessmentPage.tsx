import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Template from '../template/CreateAssessmentPage/CreateAssessmentPage';

import { caseSensitiveAxiosInstance } from '@/lib/axios';
import { trackEvent } from '@/lib/rudderstack';
import { Quiz } from '@/types';

function CreateAssessmentPage() {
  const navigate = useNavigate();
  const [assessmentName, setAssessmentName] = useState(
    'Junior Software Engineer Assessment'
  );
  const [selectedPosition, setSelectedPosition] = useState('Software Engineer');
  const [selectedLevel, setSelectedLevel] = useState('Junior');
  const [description, setDescription] = useState('');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingQuestionGeneration, setIsLoadingQuestionGeneration] = useState<boolean>(false);
  const [quizTopic, setQuizTopic] = useState<string>('');
  const [quizDifficulty, setQuizDifficulty] = useState<string>('easy');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await caseSensitiveAxiosInstance.get('/quizzes');
      if (response.data.status === 'success') {
        setQuizzes(response.data.payload.quizzes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    trackEvent({
      eventName: 'create_assessment',
      properties: {
        assessmentName,
        selectedPosition,
        selectedLevel,
        // quizIds: selectedQuizzes.map(quiz => quiz.id),
      },
    });
    if (
      assessmentName === '' ||
      selectedPosition === '' ||
      selectedLevel === ''
    ) {
      alert('Test name is required');
      return;
    }
    try {
      setIsLoading(true);
      const data = {
        name: assessmentName,
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
      assessmentName === '' ||
      assessmentName === `${selectedLevel} ${selectedPosition} Assessment`
    ) {
      setAssessmentName(`${selectedLevel} ${value} Assessment`);
    }
    setSelectedPosition(value);
  };

  const handleLevelChange = (value: string) => {
    if (
      assessmentName === '' ||
      assessmentName === `${selectedLevel} ${selectedPosition} Assessment`
    ) {
      setAssessmentName(`${value} ${selectedPosition} Assessment`);
    }
    setSelectedLevel(value);
  };

  const handleGenerateQuiz = async () => {
    trackEvent({
      eventName: 'generate_quiz',
      properties: {
        assessmentName,
        selectedPosition,
        selectedLevel,
      },
    });
    if (quizTopic === '') {
      alert('Please select a topic to generate quiz for');
      return;
    }
    const data = {
      positionType: selectedPosition,
      positionLevel: selectedLevel,
      topic: quizTopic,
      difficulty: quizDifficulty,
      positionDescription: description,
    };
    try {
      setIsLoadingQuestionGeneration(true);
      const response = await caseSensitiveAxiosInstance.post('/quizzes', data);
      if (response.data.status === 'success') {
        const newQuiz = response.data.payload.quiz;
        const newQuizzes = [newQuiz, ...quizzes];
        setQuizzes(newQuizzes);
        setQuizTopic('');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingQuestionGeneration(false)
    }
  };

  return (
    <Template
      assessmentName={assessmentName}
      quizzes={quizzes}
      selectedQuizzes={selectedQuizzes}
      description={description}
      selectedPosition={selectedPosition}
      selectedLevel={selectedLevel}
      quizTopic={quizTopic}
      quizDifficulty={quizDifficulty}
      isLoading={isLoading}
      onDescriptionChange={e => setDescription(e.target.value)}
      onAssessmentNameChange={e => setAssessmentName(e.target.value)}
      onPositionChange={(value: string) => handlePositionChange(value)}
      onLevelChange={(value: string) => handleLevelChange(value)}
      onTopicInputChange={(value: string) => setQuizTopic(value)}
      onDifficultyInputChange={(value: string) => setQuizDifficulty(value)}
      setSelectedQuizzes={setSelectedQuizzes}
      onSubmit={handleSubmit}
      handleGenerateQuiz={handleGenerateQuiz}
      isLoadingQuestionGeneration={isLoadingQuestionGeneration}
    />
  );
}

export default CreateAssessmentPage;
