import { z } from 'zod';

export interface Company {
  id: string;
  name: string;
  email: string;
  github_username: string;
}

export const candidateSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  assessment: z.object({
    assessment_id: z.string(),
    assessment_name: z.string(),
    interview_id: z.string(),
    interview_status: z.string(),
    total_score: z.number(),
    created_at: z.string(),
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
  position_type: z.string(),
  position_level: z.string(),
  // createdAt: z.string(),
  updated_at: z.string(),
  num_candidates: z.number(),
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
      first_name: z.string(),
      last_name: z.string(),
      email: z.string(),
      assessment: z.object({
        assessment_id: z.string(),
        assessment_name: z.string(),
        interview_id: z.string(),
        interview_status: z.string(),
        total_score: z.number(),
        created_at: z.string(),
      }),
    })
  ),
});

export type Assessment = z.infer<typeof assessmentSchema>;

export interface Question {
  text: string;
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
