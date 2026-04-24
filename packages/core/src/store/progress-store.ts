import { create } from 'zustand';
import { getStorageAdapter } from './adapter.js';
import { useStreakStore } from './streak-store.js';
import type { AnswerRecord } from './schema.js';
import type { Question } from '@aws-prep/content';

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

function computeStats(
  answers: Record<string, AnswerRecord>,
  questions?: Question[]
): ProgressStats {
  const records = Object.values(answers);
  if (records.length === 0) {
    return { totalAnswered: 0, todayAnswered: 0, correctCount: 0, avgScore: 0, lastExamId: null, lastQuestionNumber: null, topicAccuracy: {} };
  }
  const correctCount = records.filter(r => r.correct).length;
  const todayAnswered = records.filter(r => isSameLocalDay(r.updatedAt)).length;
  const last = records.reduce((a, b) => (a.updatedAt > b.updatedAt ? a : b));

  const topicAccuracy: Record<string, { correct: number; total: number }> = {};
  if (questions && questions.length > 0) {
    for (const record of records) {
      const key = `${record.examId}:${record.questionNumber}`;
      const q = questions.find(q => q.examId === record.examId && q.number === record.questionNumber);
      if (!q) continue;
      for (const topic of q.topics) {
        if (!topicAccuracy[topic]) topicAccuracy[topic] = { correct: 0, total: 0 };
        topicAccuracy[topic].total++;
        if (record.correct) topicAccuracy[topic].correct++;
      }
    }
  }

  return {
    totalAnswered: records.length,
    todayAnswered,
    correctCount,
    avgScore: Math.round((correctCount / records.length) * 100),
    lastExamId: last.examId,
    lastQuestionNumber: last.questionNumber,
    topicAccuracy,
  };
}

interface ProgressState {
  userId: string;
  answers: Record<string, AnswerRecord>;
  hydrated: boolean;
  stats: ProgressStats;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
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

export function wrongQuestionNumbersInExam(
  answers: Record<string, AnswerRecord>,
  examId: number,
  total: number
): number[] {
  const wrong: number[] = [];
  for (let q = 1; q <= total; q++) {
    const r = answers[`${examId}:${q}`];
    if (r && !r.correct) wrong.push(q);
  }
  return wrong;
}

export interface ExamProgress {
  answered: number;
  correct: number;
  wrong: number;
  complete: boolean;
}

export function examProgress(
  answers: Record<string, AnswerRecord>,
  examId: number,
  total: number
): ExamProgress {
  let answered = 0, correct = 0;
  for (let q = 1; q <= total; q++) {
    const r = answers[`${examId}:${q}`];
    if (r) { answered++; if (r.correct) correct++; }
  }
  return { answered, correct, wrong: answered - correct, complete: answered === total };
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  userId: 'local',
  answers: {},
  hydrated: false,
  stats: computeStats({}),
  questions: [],

  setQuestions: (questions) => {
    const { answers } = get();
    set({ questions, stats: computeStats(answers, questions) });
  },

  hydrate: async () => {
    const { userId, questions } = get();
    const list = await getStorageAdapter().list<AnswerRecord>('answers', { userId });
    const answers = Object.fromEntries(
      list.map(r => [`${r.examId}:${r.questionNumber}`, r])
    );
    set({ answers, stats: computeStats(answers, questions), hydrated: true });
  },

  recordAnswer: async (examId, questionNumber, picked, correct) => {
    const { userId, answers, questions } = get();
    const key = `${examId}:${questionNumber}`;
    const record: AnswerRecord = { userId, examId, questionNumber, picked, correct, updatedAt: Date.now() };
    const next = { ...answers, [key]: record };
    set({ answers: next, stats: computeStats(next, questions) });
    await getStorageAdapter().put('answers', `${userId}:${key}`, record);
    useStreakStore.getState().bumpToday();
  },
}));
