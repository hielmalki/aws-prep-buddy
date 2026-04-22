import type { Question } from '@aws-prep/content';
import type { Session, Strategy } from './types.js';
export declare function selectQuestions(all: Question[], strategy: Strategy, options?: {
    examId?: number;
    n?: number;
    weakTopics?: string[];
}): Question[];
export declare function gradeAnswer(question: Question, picked: string[]): boolean;
export declare function createSession(questions: Question[], strategy: Strategy, examId?: number): Session;
export declare function submitAnswer(session: Session, picked: string[], timeMs: number): Session;
export declare function nextQuestion(session: Session): Session;
export declare function isSessionComplete(session: Session): boolean;
export declare function getSessionScore(session: Session): {
    correct: number;
    total: number;
    pct: number;
};
//# sourceMappingURL=quiz-engine.d.ts.map