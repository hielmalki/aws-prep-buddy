'use client';
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'aws-prep-progress';

interface AnswerRecord {
  examId: number;
  questionNumber: number;
  picked: string[];
  correct: boolean;
  timestamp: number;
}

type ProgressStore = Record<string, AnswerRecord>;

function load(): ProgressStore {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); } catch { return {}; }
}

function save(store: ProgressStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function recordAnswer(examId: number, questionNumber: number, picked: string[], correct: boolean) {
  const store = load();
  store[`${examId}:${questionNumber}`] = { examId, questionNumber, picked, correct, timestamp: Date.now() };
  save(store);
}

export interface ProgressStats {
  totalAnswered: number;
  correctCount: number;
  avgScore: number;
  streakDays: number;
  lastExamId: number | null;
  lastQuestionNumber: number | null;
  topicAccuracy: Record<string, { correct: number; total: number }>;
}

function computeStats(store: ProgressStore): ProgressStats {
  const records = Object.values(store);
  if (records.length === 0) {
    return { totalAnswered: 0, correctCount: 0, avgScore: 0, streakDays: 0, lastExamId: null, lastQuestionNumber: null, topicAccuracy: {} };
  }

  const correctCount = records.filter(r => r.correct).length;
  const avgScore = Math.round((correctCount / records.length) * 100);

  // streak: consecutive calendar days with ≥1 answer (backwards from today)
  const daySet = new Set(records.map(r => new Date(r.timestamp).toDateString()));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (daySet.has(d.toDateString())) streak++;
    else if (i > 0) break;
  }

  // last answered question
  const sorted = [...records].sort((a, b) => b.timestamp - a.timestamp);
  const last = sorted[0];

  return {
    totalAnswered: records.length,
    correctCount,
    avgScore,
    streakDays: streak,
    lastExamId: last.examId,
    lastQuestionNumber: last.questionNumber,
    topicAccuracy: {},
  };
}

export function useProgress(): ProgressStats {
  const [stats, setStats] = useState<ProgressStats>(() => computeStats(load()));

  useEffect(() => {
    const onStorage = () => setStats(computeStats(load()));
    window.addEventListener('storage', onStorage);
    // re-read on focus (same-tab updates via recordAnswer don't fire storage event)
    window.addEventListener('focus', onStorage);
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('focus', onStorage); };
  }, []);

  return stats;
}

export function useRecordAnswer() {
  return useCallback((examId: number, questionNumber: number, picked: string[], correct: boolean) => {
    recordAnswer(examId, questionNumber, picked, correct);
    // trigger re-read in same tab
    window.dispatchEvent(new Event('focus'));
  }, []);
}
