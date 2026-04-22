import type { Question } from '@aws-prep/content';
import type { Session, AnswerEntry, Strategy } from './types.js';

export function selectQuestions(
  all: Question[],
  strategy: Strategy,
  options: { examId?: number; n?: number; weakTopics?: string[] } = {}
): Question[] {
  const { examId, n, weakTopics = [] } = options;
  let pool: Question[];

  switch (strategy) {
    case 'sequential':
      pool = examId !== undefined ? all.filter(q => q.examId === examId) : all;
      break;
    case 'random':
      pool = [...all].sort(() => Math.random() - 0.5);
      break;
    case 'weak-topic': {
      const filtered = weakTopics.length > 0
        ? all.filter(q => q.topics.some(t => weakTopics.includes(t)))
        : [];
      pool = filtered.length > 0
        ? filtered.sort(() => Math.random() - 0.5)
        : [...all].sort(() => Math.random() - 0.5);
      break;
    }
  }

  return n !== undefined ? pool.slice(0, n) : pool;
}

export function gradeAnswer(question: Question, picked: string[]): boolean {
  if (picked.length === 0) return false;
  const correct = new Set(question.correctLetters);
  const chosen = new Set(picked);
  if (correct.size !== chosen.size) return false;
  for (const c of correct) if (!chosen.has(c)) return false;
  return true;
}

export function createSession(
  questions: Question[],
  strategy: Strategy,
  examId?: number
): Session {
  return {
    id: globalThis.crypto.randomUUID(),
    strategy,
    examId,
    questions,
    currentIdx: 0,
    answers: [],
    startedAt: Date.now(),
    timePerQ: [],
  };
}

export function submitAnswer(session: Session, picked: string[], timeMs: number): Session {
  const q = session.questions[session.currentIdx];
  if (!q) return session;
  const entry: AnswerEntry = {
    examId: q.examId,
    questionNumber: q.number,
    picked,
    correct: gradeAnswer(q, picked),
    timeMs,
  };
  return {
    ...session,
    answers: [...session.answers, entry],
    timePerQ: [...session.timePerQ, timeMs],
  };
}

export function nextQuestion(session: Session): Session {
  return { ...session, currentIdx: session.currentIdx + 1 };
}

export function isSessionComplete(session: Session): boolean {
  return session.currentIdx >= session.questions.length;
}

export function getSessionScore(session: Session): { correct: number; total: number; pct: number } {
  const correct = session.answers.filter(a => a.correct).length;
  const total = session.answers.length;
  return { correct, total, pct: total > 0 ? Math.round((correct / total) * 100) : 0 };
}
