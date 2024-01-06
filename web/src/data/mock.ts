import {
  Assessment,
  Candidate,
  Checklist,
  Company,
  Position,
  Question,
} from '../types';

export const mockQuestion: Question = {
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

export const mockSelectedCandidate: Candidate = {
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  github_username: 'johndoe',
  total_score: 85,
  summary: 'Experienced software developer',
  status: 'active',
  created_at: '2022-01-01T00:00:00Z',
  assessments: [
    {
      criterion: {
        id: '1',
        keywords: ['Problem Solving'],
        message: 'Ability to solve problems',
        created_at: '2022-01-01T00:00:00Z',
      },
      score: 4,
      reason: 'Good problem solving skills',
    },
    {
      criterion: {
        id: '2',
        keywords: ['Communication'],
        message: 'Ability to communicate effectively',
        created_at: '2022-01-01T00:00:00Z',
      },
      score: 4,
      reason: 'Good communication skills',
    },
  ],
};

export const mockCandidates: Candidate[] = [
  mockSelectedCandidate,
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane.doe@example.com',
    github_username: 'janedoe',
    total_score: 90,
    summary: 'Skilled frontend developer',
    status: 'active',
    created_at: '2022-01-01T00:00:00Z',
    assessments: [
      {
        criterion: {
          id: '1',
          keywords: ['Problem Solving'],
          message: 'Ability to solve problems',
          created_at: '2022-01-01T00:00:00Z',
        },
        score: 5,
        reason: 'Excellent problem solving skills',
      },
      {
        criterion: {
          id: '2',
          keywords: ['Communication'],
          message: 'Ability to communicate effectively',
          created_at: '2022-01-01T00:00:00Z',
        },
        score: 4,
        reason: 'Good communication skills',
      },
    ],
  },
];

export const mockSelectedPosition: Position = {
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
  candidates: mockCandidates,
  checklist_status: 'active',
};

export const mockPositions: Position[] = [
  mockSelectedPosition,
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
  },
];

export const mockCompanyInfo: Company = {
  id: '12398723948',
  name: 'Peter Parker',
  email: 'peterparker@gmail.com',
  github_username: 'peterparker',
  repository_names: ['repo1', 'repo2', 'repo3'],
  positions: [],
};

export const mockChecklist: Checklist = {
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
