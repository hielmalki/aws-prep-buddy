export interface AnswerRecord {
  userId: string;
  examId: number;
  questionNumber: number;
  picked: string[];
  correct: boolean;
  updatedAt: number;
}

export interface SessionRecord {
  userId: string;
  sessionId: string;
  strategy: string;
  examId?: number;
  questionIds: string[];
  currentIdx: number;
  updatedAt: number;
}

export interface SettingsRecord {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  llmProvider: 'anthropic' | 'openai';
  dailyGoal: number;
  updatedAt: number;
}

export interface StreakRecord {
  userId: string;
  lastActivityDate: string | null; // "YYYY-MM-DD"
  currentStreak: number;
  longestStreak: number;
  updatedAt: number;
}

export interface FlashcardDeckRecord {
  userId: string;
  deckId: string;
  name: string;
  description?: string;
  isAuto: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface FlashcardRecord {
  userId: string;
  cardId: string;
  deckId: string;
  front: string;
  back: string;
  tags: string[];
  source?: { type: 'wrong-answer'; examId: number; questionNumber: number };
  easeFactor: number;
  interval: number;
  repetitions: number;
  lapses: number;
  dueAt: number;
  lastReviewedAt: number | null;
  createdAt: number;
  updatedAt: number;
}
