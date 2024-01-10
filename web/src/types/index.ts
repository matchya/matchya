export interface Company {
  id: string;
  name: string;
  email: string;
  github_username: string;
  repository_names: string[];
  positions: Position[];
}

export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  github_username: string;
  total_score: number;
  summary: string;
  status: string;
  created_at: string;
  assessments: Assessment[];
}

export interface Assessment {
  criterion: Criterion;
  score: number;
  reason: string;
}

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
