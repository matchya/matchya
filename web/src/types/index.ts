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
