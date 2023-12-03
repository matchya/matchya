export interface Company {
    id: string;
    name: string;
    email: string;
    github_username: string;
    repository_names: string[];
    positions: Position[];
}

export interface Position {
    id: string;
    name: string;
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
