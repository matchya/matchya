import { Assessment, Candidate, Company, Interview, Question } from '../types';

export const mockedInterviews: Interview[] = [
  {
    createdAt: '2022-01-01',
    candidateName: 'John Doe',
    testName: 'Test 1',
    totalScore: 90,
  },
  {
    createdAt: '2022-01-01',
    candidateName: 'John Doe',
    testName: 'Test 1',
    totalScore: 90,
  },
];

export const mockedAssessments: Assessment[] = [
  {
    id: '1',
    name: 'Test 1',
    positionType: 'Software Engineer',
    positionLevel: 'Senior',
    numCandidates: 5,
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
    updatedAt: '2022-01-01',
    questions: [],
    candidates: [],
  },
];

export const mockedQuestion: Question = {
  question:
    'How would you optimize a Dockerfile for a web application to ensure efficient build times and image sizes? Describe the steps you would take and the rationale behind them.',
  metrics: [
    'Knowledge of Dockerfile optimization techniques',
    'Efficient image construction and management',
    'Rationale behind optimization choices',
    'Awareness of potential pitfalls and best practices.',
  ],
  topic: 'typescript',
  difficulty: 'medium',
};

export const mockedSelectedCandidate: Candidate = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  assessment: {
    assessmentId: '1',
    interviewId: '1',
    assessmentName: 'Test 1',
    totalScore: 90,
    interviewStatus: 'COMPLETED',
    createdAt: '2022-01-01',
  },
};

export const mockedCandidates: Candidate[] = [
  mockedSelectedCandidate,
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    assessment: {
      assessmentId: '1',
      interviewId: '1',
      assessmentName: 'Test 1',
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
  githubUsername: 'peterparker',
};
