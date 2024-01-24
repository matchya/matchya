import { z } from 'zod';

export interface Company {
  id: string;
  name: string;
  email: string;
}

export const candidateSchema = z.object({
  id: z.string(),
  name: z.string(),
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
  id: z.string(),
  totalScore: z.number(),
  summary: z.string(),
  createdAt: z.string(),
  assessment: z.object({
    id: z.string(),
    name: z.string(),
  }),
  candidate: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  answers: z.array(
    z.object({
      questionId: z.string(),
      questionText: z.string(),
      questionTopic: z.string(),
    })
  ),
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
      name: z.string(),
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
  id: string;
  text: string;
  metrics: Metric[];
  topic: string;
  difficulty: string;
}

export interface Metric {
  id: string;
  name: string;
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
