export type { Session, AnswerEntry, Strategy } from './types.js';
export {
  selectQuestions,
  gradeAnswer,
  createSession,
  submitAnswer,
  nextQuestion,
  isSessionComplete,
  getSessionScore,
} from './quiz-engine.js';
export { applyReview } from './srs.js';
export type { ReviewQuality } from './srs.js';
export { FEATURES } from './features.js';
export {
  useQuizStore,
  useProgressStore,
  nextUnansweredInExam,
  wrongQuestionNumbersInExam,
  examProgress,
  useSettingsStore,
  DEFAULT_DAILY_GOAL,
  useStreakStore,
  setStorageAdapter,
  getStorageAdapter,
  computeNextStreak,
  todayString,
  useFlashcardStore,
  dueCardsForDeck,
  totalCardsForDeck,
  useTutorStore,
} from './store/index.js';
export type {
  StorageAdapter,
  ProgressStats,
  ExamProgress,
  AnswerRecord,
  SessionRecord,
  SettingsRecord,
  StreakRecord,
  FlashcardDeckRecord,
  FlashcardRecord,
  TutorMessageRecord,
  TutorSessionRecord,
  TutorMemoryRecord,
} from './store/index.js';
export { computeTopicAccuracy, weakestTopics } from './topic-accuracy.js';
export type { TopicAccuracy, TopicLookup, WeakestTopicsOptions } from './topic-accuracy.js';
