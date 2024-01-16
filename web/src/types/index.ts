import { z } from 'zod';

export interface Company {
  id: string;
  name: string;
  email: string;
  github_username: string;
  repository_names: string[];
  positions: Position[];
}

export const candidateSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  githubUsername: z.string(),
  result: z.object({
    id: z.string(),
    testId: z.string(),
    testName: z.string(),
    totalScore: z.number(),
    createdAt: z.string(),
  }),
});

export type Candidate = z.infer<typeof candidateSchema>;

export interface Assessment {
  criterion: Criterion;
  score: number;
  reason: string;
}

export const interviewSchema = z.object({
  createdAt: z.string(),
  candidateName: z.string(),
  testName: z.string(),
  totalScore: z.number(),
});

export type Interview = z.infer<typeof interviewSchema>;

export const testSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  name: z.string(),
  positionType: z.string(),
  positionLevel: z.string(),
  candidateCount: z.number(),
});

export type Test = z.infer<typeof testSchema>;

export interface Criterion {
  id: string;
  message: string;
  keywords: string[];
  created_at: string;
}

export interface Position {
  id: string;
  name: string;
  checklist_status: string;
  checklist: Checklist;
  candidates: Candidate[];
  questions: Question[];
}

export interface Checklist {
  id: string;
  repository_names: string[];
  criteria: Criterion[];
}

export interface Score {
  name: string;
  value: number;
  details: string;
  evaluations: Evaluation[];
}

export interface Evaluation {
  criteria: string;
  score: number;
  reason: string;
}

export interface Question {
  question: string;
  metrics: string[];
  keyword: string;
  difficulty: string;
}

export interface CustomError {
  response: {
    status: number;
    data: {
      status: string;
      message: string;
    };
  };
}
