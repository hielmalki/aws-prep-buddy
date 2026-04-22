import type { Question } from '@aws-prep/content';
export type Strategy = 'sequential' | 'random' | 'weak-topic';
export interface AnswerEntry {
    examId: number;
    questionNumber: number;
    picked: string[];
    correct: boolean;
    timeMs: number;
}
export interface Session {
    id: string;
    strategy: Strategy;
    examId?: number;
    questions: Question[];
    currentIdx: number;
    answers: AnswerEntry[];
    startedAt: number;
    timePerQ: number[];
}
//# sourceMappingURL=types.d.ts.map