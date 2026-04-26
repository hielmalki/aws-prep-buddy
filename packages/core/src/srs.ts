import type { FlashcardRecord } from './store/schema.js';

export type ReviewQuality = 'again' | 'hard' | 'good' | 'easy';

type SM2Fields = Pick<
  FlashcardRecord,
  'easeFactor' | 'interval' | 'repetitions' | 'lapses' | 'dueAt' | 'lastReviewedAt'
>;

const DAY_MS = 86_400_000;
const MIN_EASE = 1.3;

export function applyReview(card: FlashcardRecord, quality: ReviewQuality, now = Date.now()): SM2Fields {
  const { easeFactor, interval, repetitions, lapses } = card;

  if (quality === 'again') {
    return {
      easeFactor: Math.max(MIN_EASE, easeFactor - 0.20),
      interval: 0,
      repetitions: 0,
      lapses: lapses + 1,
      dueAt: now + 60_000,
      lastReviewedAt: now,
    };
  }

  let nextEase = easeFactor;
  let nextInterval: number;
  const nextReps = repetitions + 1;

  if (quality === 'hard') {
    nextEase = Math.max(MIN_EASE, easeFactor - 0.15);
    nextInterval = repetitions >= 2 ? Math.max(1, Math.round(interval * 1.2)) : 1;
  } else if (quality === 'good') {
    if (repetitions === 0) nextInterval = 1;
    else if (repetitions === 1) nextInterval = 6;
    else nextInterval = Math.round(interval * easeFactor);
  } else {
    // easy
    nextEase = easeFactor + 0.15;
    if (repetitions === 0) nextInterval = Math.round(1 * 1.3);
    else if (repetitions === 1) nextInterval = Math.round(6 * 1.3);
    else nextInterval = Math.round(interval * easeFactor * 1.3);
  }

  return {
    easeFactor: nextEase,
    interval: nextInterval,
    repetitions: nextReps,
    lapses,
    dueAt: now + nextInterval * DAY_MS,
    lastReviewedAt: now,
  };
}
