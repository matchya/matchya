import { Assessment, Candidate, Company, Quiz } from '../types';

export * from './interview';

export const mockedQuizzes: Quiz[] = [
  {
    id: '1',
    description: 'Description 1',
    topic: 'Topic 1',
    subtopic: 'Subtopic 1',
    difficulty: 'Easy',
    createdAt: '2024-02-08 23:02:57.478524',
  },
  {
    id: '2',
    description: 'Description 2',
    topic: 'Topic 2',
    subtopic: 'Subtopic 2',
    difficulty: 'Medium',
    createdAt: '2024-02-08 23:02:57.478524',
  },
  {
    id: '3',
    description: 'Description 3',
    topic: 'Topic 3',
    subtopic: 'Subtopic 3',
    difficulty: 'Hard',
    createdAt: '2024-02-08 23:02:57.478524',
  },
];

export const mockedAssessments: Assessment[] = [
  {
    id: '1',
    name: 'Test 1',
    positionType: 'Software Engineer',
    positionLevel: 'Senior',
    numCandidates: 5,
    createdAt: '2022-01-01',
    updatedAt: '2022-01-01',
    quizzes: [],
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
    quizzes: [],
    candidates: [],
  },
];

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
