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
    position_type: 'Software Engineer',
    position_level: 'Senior',
    num_candidates: 5,
    // created_at: '2022-01-01',
    updated_at: '2022-01-01',
    questions: [],
    candidates: [],
  },
  {
    id: '2',
    name: 'Test 1',
    position_type: 'Frontend Engineer',
    position_level: 'Junior',
    num_candidates: 5,
    // created_at: '2022-01-01',
    updated_at: '2022-01-01',
    questions: [],
    candidates: []
  },
];

export const mockedQuestion: Question = {
  id: '1',
  text:
    'How would you optimize a Dockerfile for a web application to ensure efficient build times and image sizes? Describe the steps you would take and the rationale behind them.',
  metrics: [
    {
      'id': '1',
      'name': 'Knowledge of Dockerfile optimization techniques',
    },
    {
      'id': '2',
      'name': 'Efficient image construction and management',
    },
    {
      'id': '3',
      'name': 'Rationale behind optimization choices',
    },
    {
      'id': '4',
      'name': 'Awareness of potential pitfalls and best practices.',
    }
  ],
  topic: 'typescript',
  difficulty: 'medium',
};

export const mockedSelectedCandidate: Candidate = {
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  assessment: {
    assessment_id: '1',
    interview_id: '1',
    assessment_name: 'Test 1',
    total_score: 90,
    interview_status: 'COMPLETED',
    created_at: '2022-01-01',
  },
};

export const mockedCandidates: Candidate[] = [
  mockedSelectedCandidate,
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane.doe@example.com',
    assessment: {
      assessment_id: '1',
      interview_id: '1',
      assessment_name: 'Test 1',
      total_score: 90,
      interview_status: 'PENDING',
      created_at: '2022-01-01',
    },
  },
];

export const mockedCompanyInfo: Company = {
  id: '12398723948',
  name: 'Peter Parker',
  email: 'peterparker@gmail.com',
  github_username: 'peterparker',
};
