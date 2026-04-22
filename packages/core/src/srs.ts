// SM-2 stub — no-op in MVP, real implementation in Phase 2
export interface ReviewRecord {
  questionId: string;
  easeFactor: number;
  interval: number;
  nextReview: number;
  repetitions: number;
}

// quality: 0–5 (0=complete blackout, 5=perfect)
export function recordAnswer(_questionId: string, _quality: 0 | 1 | 2 | 3 | 4 | 5): void {}
