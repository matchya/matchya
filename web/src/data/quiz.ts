import { Quiz } from '@/types';

export const mockedSelectedQuiz: Quiz = {
  id: '1',
  context:
    'How would you optimize a Dockerfile for a web application to ensure efficient build times and image sizes? Describe the steps you would take and the rationale behind them.',
  description: 'Optimizing Dockerfile',
  topic: 'typescript',
  subtopic: 'docker',
  isOriginal: true,
  createdAt: '2024-02-08 23:02:57.478524',
  questions: [
    {
      id: '1',
      text: 'How would you optimize a Dockerfile for a web application to ensure efficient build times and image sizes? Describe the steps you would take and the rationale behind them.',
      questionNumber: 1,
    },
    {
      id: '2',
      text: 'What are the steps you would take to optimize a Dockerfile for a web application to ensure efficient build times and image sizes? Describe the rationale behind them.',
      questionNumber: 2,
    },
    {
      id: '3',
      text: 'Describe the steps you would take to optimize a Dockerfile for a web application to ensure efficient build times and image sizes.',
      questionNumber: 3,
    },
  ],
  difficulty: 'medium',
};

export const mockedQuizzes: Quiz[] = [
  mockedSelectedQuiz,
  {
    id: '2',
    context: 'context here',
    description: 'Description 2',
    topic: 'Topic 2',
    subtopic: 'Subtopic 2',
    difficulty: 'Medium',
    isOriginal: true,
    questions: [
      {
        id: '1',
        text: 'Question 1',
        questionNumber: 1,
      },
      {
        id: '2',
        text: 'Question 2',
        questionNumber: 2,
      },
      {
        id: '3',
        text: 'Question 3',
        questionNumber: 3,
      },
    ],
    createdAt: '2024-02-08 23:02:57.478524',
  },
  {
    id: '3',
    context: 'context here',
    description: 'Description 3',
    topic: 'Topic 3',
    subtopic: 'Subtopic 3',
    difficulty: 'Hard',
    isOriginal: true,
    questions: [
      {
        id: '1',
        text: 'Question 1',
        questionNumber: 1,
      },
      {
        id: '2',
        text: 'Question 2',
        questionNumber: 2,
      },
      {
        id: '3',
        text: 'Question 3',
        questionNumber: 3,
      },
    ],
    createdAt: '2024-02-08 23:02:57.478524',
  },
];
