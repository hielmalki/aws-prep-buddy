import { create } from 'zustand';
import { getStorageAdapter } from './adapter.js';
import { useStreakStore } from './streak-store.js';
import type { AnswerRecord } from './schema.js';

export interface ProgressStats {
  totalAnswered: number;
  todayAnswered: number;
  correctCount: number;
  avgScore: number;
  lastExamId: number | null;
  lastQuestionNumber: number | null;
  topicAccuracy: Record<string, { correct: number; total: number }>;
}

function isSameLocalDay(ts: number, now = Date.now()): boolean {
  const a = new Date(ts), b = new Date(now);
  return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
}

function computeStats(answers: Record<string, AnswerRecord>): ProgressStats {
  const records = Object.values(answers);
  if (records.length === 0) {
    return { totalAnswered: 0, todayAnswered: 0, correctCount: 0, avgScore: 0, lastExamId: null, lastQuestionNumber: null, topicAccuracy: {} };
  }
  const correctCount = records.filter(r => r.correct).length;
  const todayAnswered = records.filter(r => isSameLocalDay(r.updatedAt)).length;
  const last = records.reduce((a, b) => (a.updatedAt > b.updatedAt ? a : b));
  return {
    totalAnswered: records.length,
    todayAnswered,
    correctCount,
    avgScore: Math.round((correctCount / records.length) * 100),
    lastExamId: last.examId,
    lastQuestionNumber: last.questionNumber,
    topicAccuracy: {},
  };
}

interface ProgressState {
  userId: string;
  answers: Record<string, AnswerRecord>;
  hydrated: boolean;
  stats: ProgressStats;
  hydrate: () => Promise<void>;
  recordAnswer: (examId: number, questionNumber: number, picked: string[], correct: boolean) => Promise<void>;
}

export function nextUnansweredInExam(
  answers: Record<string, AnswerRecord>,
  examId: number,
  total: number,
  fromQuestion = 1
): number | null {
  for (let q = fromQuestion; q <= total; q++) {
    if (!answers[`${examId}:${q}`]) return q;
  }
  return null;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  userId: 'local',
  answers: {},
  hydrated: false,
  stats: computeStats({}),

  hydrate: async () => {
    const { userId } = get();
    const list = await getStorageAdapter().list<AnswerRecord>('answers', { userId });
    const answers = Object.fromEntries(
      list.map(r => [`${r.examId}:${r.questionNumber}`, r])
    );
    set({ answers, stats: computeStats(answers), hydrated: true });
  },

  recordAnswer: async (examId, questionNumber, picked, correct) => {
    const { userId, answers } = get();
    const key = `${examId}:${questionNumber}`;
    const record: AnswerRecord = { userId, examId, questionNumber, picked, correct, updatedAt: Date.now() };
    const next = { ...answers, [key]: record };
    set({ answers: next, stats: computeStats(next) });
    await getStorageAdapter().put('answers', `${userId}:${key}`, record);
    useStreakStore.getState().bumpToday();
  },
}));
