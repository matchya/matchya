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
  quizId: string;
  quizContext: string;
  quizTopic: string;
  quizSubtopic: string;
  quizDifficulty: string;
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
  quizzes?: Quiz[];
  candidates?: Candidate[];
  interviewId?: string;
  interviewStatus?: string;
  totalScore?: number;
  summary?: string;
}

export interface Quiz {
  id: string;
  context: string;
  subtopic: string;
  description: string;
  isOriginal: boolean;
  difficulty: string;
  topic: string;
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  questionNumber: number;
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
