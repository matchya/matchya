export interface Company {
  id: string;
  name: string;
  email: string;
}

export interface Interview {
  id: string;
  totalScore: number;
  summary: string;
  createdAt: string;
  assessment: Assessment;
  candidate: Candidate;
  answers: Answer[];
}

export interface Answer {
  questionId: string;
  questionText: string;
  questionTopic: string;
  questionDifficulty: string;
  feedback: string;
  score: number;
  videoUrl: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  assessment?: Assessment;
}

export interface Assessment {
  id: string;
  name: string;
  positionType?: string;
  positionLevel?: string;
  createdAt?: string;
  updatedAt?: string;
  numCandidates?: number;
  quizes?: Quiz[];
  candidates?: Candidate[];
  interviewId?: string;
  interviewStatus?: string;
  totalScore?: number;
  summary?: string;
}

export interface Quiz {
  id: string;
  context: string;
  description: string;
  metrics?: Metric[];
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
