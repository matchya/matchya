import { Assessment } from '@/types';

export const mockedSelectedAssessment: Assessment = {
  id: '1',
  name: 'Test 1',
  positionType: 'Software Engineer',
  positionLevel: 'Senior',
  numCandidates: 5,
  createdAt: '2022-01-01',
  updatedAt: '2022-01-01',
  quizzes: [],
  candidates: [],
};

export const mockedAssessments: Assessment[] = [
  mockedSelectedAssessment,
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
