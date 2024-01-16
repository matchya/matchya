import {
  Assessment,
  Candidate,
  Checklist,
  Company,
  Interview,
  Position,
  Question,
  Test,
} from '../types';

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

export const mockedTests: Test[] = [
  {
    id: '1',
    name: 'Test 1',
    positionType: 'Software Engineer',
    positionLevel: 'Senior',
    candidateCount: 5,
    createdAt: '2022-01-01',
    updatedAt: '2022-01-01',
  },
  {
    id: '2',
    name: 'Test 1',
    positionType: 'Frontend Engineer',
    positionLevel: 'Junior',
    candidateCount: 5,
    createdAt: '2022-01-01',
    updatedAt: '2022-01-01',
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
  keyword: 'typescript',
  difficulty: 'medium',
};

export const mockedSelectedCandidate: Candidate = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  githubUsername: 'johndoe',
  result: {
    id: '1',
    testId: '1',
    testName: 'Test 1',
    totalScore: 90,
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
    githubUsername: 'janedoe',
    result: {
      id: '1',
      testId: '1',
      testName: 'Test 1',
      totalScore: 90,
      createdAt: '2022-01-01',
    },
  },
];

export const mockedSelectedPosition: Position = {
  id: '1',
  name: 'Position 1',
  checklist: {
    id: '1',
    repository_names: ['Repo 1', 'Repo 2'],
    criteria: [
      {
        id: '1',
        message: 'Criteria 1',
        keywords: ['keyword1', 'keyword2'],
        created_at: '2022-01-01T00:00:00Z',
      },
      {
        id: '2',
        message: 'Criteria 2',
        keywords: ['keyword3', 'keyword4'],
        created_at: '2022-01-02T00:00:00Z',
      },
    ],
  },
  candidates: mockedCandidates,
  checklist_status: 'active',
  questions: [mockedQuestion, mockedQuestion, mockedQuestion],
};

export const mockedPositions: Position[] = [
  mockedSelectedPosition,
  {
    id: '2',
    name: 'Position 2',
    checklist: {
      id: '2',
      repository_names: ['Repo 3', 'Repo 4'],
      criteria: [],
    },
    candidates: [],
    checklist_status: 'active',
    questions: [mockedQuestion],
  },
];

export const mockedCompanyInfo: Company = {
  id: '12398723948',
  name: 'Peter Parker',
  email: 'peterparker@gmail.com',
  github_username: 'peterparker',
  repository_names: ['repo1', 'repo2', 'repo3'],
  positions: [],
};

export const mockedChecklist: Checklist = {
  id: '1',
  repository_names: ['Repo 1', 'Repo 2'],
  criteria: [
    {
      id: '1',
      created_at: '2022-01-01',
      keywords: ['react', 'typescript', 'firebase', 'yo'],
      message: 'This is a description for the first item in the checklist',
    },
    {
      id: '2',
      created_at: '2022-01-02',
      keywords: ['react', 'typescript'],
      message: 'This is a description for the second item in the checklist',
    },
    {
      id: '3',
      created_at: '2022-01-03',
      keywords: ['react', 'typescript'],
      message: 'This is a description for the third item in the checklist',
    },
    {
      id: '4',
      created_at: '2022-01-04',
      keywords: ['react', 'typescript'],
      message: 'This is a description for the fourth item in the checklist',
    },
    {
      id: '5',
      created_at: '2022-01-05',
      keywords: ['react', 'typescript'],
      message: 'This is a description for the fifth item in the checklist',
    },
  ],
};

export const mockedAssessments: Assessment[] = [
  {
    criterion: {
      id: '1',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      keywords: [],
      created_at: '',
    },
    score: 7,
    reason: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    criterion: {
      id: '1',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      keywords: [],
      created_at: '',
    },
    score: 7,
    reason: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    criterion: {
      id: '1',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      keywords: [],
      created_at: '',
    },
    score: 7,
    reason: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    criterion: {
      id: '1',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      keywords: [],
      created_at: '',
    },
    score: 7,
    reason: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    criterion: {
      id: '1',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      keywords: [],
      created_at: '',
    },
    score: 7,
    reason: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    criterion: {
      id: '1',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      keywords: [],
      created_at: '',
    },
    score: 7,
    reason: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
];
