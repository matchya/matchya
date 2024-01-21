import { z } from 'zod';

export interface Company {
  id: string;
  name: string;
  email: string;
  githubUsername: string;
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
  questions: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      metrics: z.array(z.string()),
      topic: z.string(),
      difficulty: z.string(),
    })
  ),
  candidates: z.array(
    z.object({
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
    })
  ),
});

export type Assessment = z.infer<typeof assessmentSchema>;

export interface Question {
  question: string;
  metrics: string[];
  topic: string;
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
