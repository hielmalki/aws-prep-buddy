import type { AnswerRecord } from './store/schema.js';

export interface TopicAccuracy {
  topic: string;
  correct: number;
  total: number;
  pct: number;
}

export type TopicLookup = (examId: number, questionNumber: number) => string[];

export function computeTopicAccuracy(
  answers: Record<string, AnswerRecord>,
  questionTopics: TopicLookup,
): TopicAccuracy[] {
  const buckets = new Map<string, { correct: number; total: number }>();
  for (const rec of Object.values(answers)) {
    const topics = questionTopics(rec.examId, rec.questionNumber);
    for (const topic of topics) {
      const b = buckets.get(topic) ?? { correct: 0, total: 0 };
      b.total += 1;
      if (rec.correct) b.correct += 1;
      buckets.set(topic, b);
    }
  }
  return Array.from(buckets.entries()).map(([topic, b]) => ({
    topic,
    correct: b.correct,
    total: b.total,
    pct: b.total === 0 ? 0 : Math.round((b.correct / b.total) * 100),
  }));
}

export interface WeakestTopicsOptions {
  minTotal?: number;
  maxPct?: number;
  limit?: number;
}

export function weakestTopics(
  acc: TopicAccuracy[],
  opts: WeakestTopicsOptions = {},
): TopicAccuracy[] {
  const { minTotal = 2, maxPct = 70, limit = 5 } = opts;
  return acc
    .filter(t => t.total >= minTotal && t.pct < maxPct)
    .sort((a, b) => a.pct - b.pct || b.total - a.total)
    .slice(0, limit);
}
