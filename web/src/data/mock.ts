import { Assessment, Candidate, Company, Question } from '../types';

export * from './interview';

export const mockedAssessments: Assessment[] = [
  {
    id: '1',
    name: 'Test 1',
    positionType: 'Software Engineer',
    positionLevel: 'Senior',
    numCandidates: 5,
    createdAt: '2022-01-01',
    updatedAt: '2022-01-01',
    questions: [],
    candidates: [],
  },
  {
    id: '2',
    name: 'Test 1',
    positionType: 'Frontend Engineer',
    positionLevel: 'Junior',
    numCandidates: 5,
    createdAt: '2022-01-01',
    updatedAt: '2022-01-01',
    questions: [],
    candidates: [],
  },
];

export const mockedQuestion: Question = {
  id: '1',
  text: 'How would you optimize a Dockerfile for a web application to ensure efficient build times and image sizes? Describe the steps you would take and the rationale behind them.',
  metrics: [
    {
      id: '1',
      name: 'Knowledge of Dockerfile optimization techniques',
    },
    {
      id: '2',
      name: 'Efficient image construction and management',
    },
    {
      id: '3',
      name: 'Rationale behind optimization choices',
    },
    {
      id: '4',
      name: 'Awareness of potential pitfalls and best practices.',
    },
  ],
  topic: 'typescript',
  difficulty: 'medium',
};

export const mockedSelectedCandidate: Candidate = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  assessment: {
    id: '1',
    interviewId: '1',
    name: 'Test 1',
    totalScore: 90,
    interviewStatus: 'COMPLETED',
    createdAt: '2022-01-01',
  },
};

export const mockedCandidates: Candidate[] = [
  mockedSelectedCandidate,
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    assessment: {
      id: '1',
      interviewId: '1',
      name: 'Test 1',
      totalScore: 90,
      interviewStatus: 'PENDING',
      createdAt: '2022-01-01',
    },
  },
];

export const mockedCompanyInfo: Company = {
  id: '12398723948',
  name: 'Peter Parker',
  email: 'peterparker@gmail.com',
};
