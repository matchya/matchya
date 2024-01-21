import { z } from 'zod';

export interface Company {
  id: string;
  name: string;
  email: string;
  githubUsername: string;
  repositoryNames: string[];
  positions: Position[];
}

export const candidateSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  assessment: z.object({
    assessmentId: z.string(),
    assessmentName: z.string(),
    interviewId: z.string(),
    interviewStatus: z.string(),
    totalScore: z.number(),
    createdAt: z.string(),
  }),
});

export type Candidate = z.infer<typeof candidateSchema>;

export const interviewSchema = z.object({
  createdAt: z.string(),
  candidateName: z.string(),
  testName: z.string(),
  totalScore: z.number(),
});

export type Interview = z.infer<typeof interviewSchema>;

export const assessmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  positionType: z.string(),
  positionLevel: z.string(),
  // createdAt: z.string(),
  updatedAt: z.string(),
  numCandidates: z.number(),
});

export type Assessment = z.infer<typeof assessmentSchema>;

export interface Criterion {
  id: string;
  message: string;
  keywords: string[];
  createdAt: string;
}

export interface Position {
  id: string;
  name: string;
  checklistStatus: string;
  checklist: Checklist;
  candidates: Candidate[];
  questions: Question[];
}

export interface Checklist {
  id: string;
  repositoryNames: string[];
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
