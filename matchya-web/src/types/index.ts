

export interface Score {
    // id: string;
    name: string;
    value: number;
    details: string;
    evaluations: Evaluation[];
}

export interface Evaluation {
    // id: string;
    criteria: string;
    score: number;
    reason: string;
}
