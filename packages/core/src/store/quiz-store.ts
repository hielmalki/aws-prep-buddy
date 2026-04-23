import { create } from 'zustand';
import type { Session, Strategy } from '../types.js';
import { createSession, submitAnswer, nextQuestion, isSessionComplete, getSessionScore } from '../quiz-engine.js';
import type { Question } from '@aws-prep/content';

interface QuizState {
  session: Session | null;
  start: (questions: Question[], strategy: Strategy, examId?: number) => void;
  answer: (picked: string[], timeMs: number) => void;
  advance: () => void;
  reset: () => void;
  score: () => { correct: number; total: number; pct: number } | null;
  isComplete: () => boolean;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  session: null,

  start: (questions, strategy, examId) => {
    set({ session: createSession(questions, strategy, examId) });
  },

  answer: (picked, timeMs) => {
    const { session } = get();
    if (!session) return;
    set({ session: submitAnswer(session, picked, timeMs) });
  },

  advance: () => {
    const { session } = get();
    if (!session) return;
    set({ session: nextQuestion(session) });
  },

  reset: () => set({ session: null }),

  score: () => {
    const { session } = get();
    return session ? getSessionScore(session) : null;
  },

  isComplete: () => {
    const { session } = get();
    return session ? isSessionComplete(session) : false;
  },
}));
