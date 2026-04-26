import Dexie, { type Table } from 'dexie';
import { setStorageAdapter } from '@aws-prep/core';
import type { StorageAdapter, AnswerRecord, SessionRecord, SettingsRecord, StreakRecord, FlashcardDeckRecord, FlashcardRecord } from '@aws-prep/core';

type AnyRecord = { userId: string; updatedAt: number };

class AppDatabase extends Dexie {
  answers!: Table<AnswerRecord & { _key: string }>;
  sessions!: Table<SessionRecord & { _key: string }>;
  settings!: Table<SettingsRecord & { _key: string }>;
  streak!: Table<StreakRecord & { _key: string }>;
  flashcardDecks!: Table<FlashcardDeckRecord & { _key: string }>;
  flashcards!: Table<FlashcardRecord & { _key: string }>;

  constructor() {
    super('aws-prep-db');
    this.version(1).stores({
      answers: '_key, userId, examId, updatedAt',
      sessions: '_key, userId, updatedAt',
      settings: '_key, userId',
      streak: '_key, userId',
    });
    this.version(2).stores({
      answers: '_key, userId, examId, updatedAt',
      sessions: '_key, userId, updatedAt',
      settings: '_key, userId',
      streak: '_key, userId',
      flashcardDecks: '_key, userId',
      flashcards: '_key, userId, deckId, dueAt',
    });
  }
}

let db: AppDatabase;

function getDb(): AppDatabase {
  if (!db) db = new AppDatabase();
  return db;
}

function tableFor(name: string) {
  const d = getDb();
  switch (name) {
    case 'answers': return d.answers;
    case 'sessions': return d.sessions;
    case 'settings': return d.settings;
    case 'streak': return d.streak;
    case 'flashcardDecks': return d.flashcardDecks;
    case 'flashcards': return d.flashcards;
    default: throw new Error(`Unknown table: ${name}`);
  }
}

const dexieAdapter: StorageAdapter = {
  async get<T>(table: string, key: string): Promise<T | undefined> {
    const record = await tableFor(table).get(key);
    if (!record) return undefined;
    const { _key: _, ...rest } = record;
    return rest as T;
  },

  async put<T>(table: string, key: string, value: T): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (tableFor(table) as Table<any>).put({ ...(value as AnyRecord), _key: key });
  },

  async delete(table: string, key: string): Promise<void> {
    await tableFor(table).delete(key);
  },

  async list<T>(table: string, filter?: { userId?: string }): Promise<T[]> {
    const t = tableFor(table);
    const records = filter?.userId
      ? await t.where('userId').equals(filter.userId).toArray()
      : await t.toArray();
    return records.map(({ _key: _, ...rest }) => rest as T);
  },

  async clear(table: string): Promise<void> {
    await tableFor(table).clear();
  },
};

async function migrateFromLocalStorage(): Promise<void> {
  const LEGACY_KEY = 'aws-prep-progress';
  const raw = typeof window !== 'undefined' ? localStorage.getItem(LEGACY_KEY) : null;
  if (!raw) return;
  try {
    const store = JSON.parse(raw) as Record<string, {
      examId: number; questionNumber: number; picked: string[]; correct: boolean; timestamp: number;
    }>;
    const records = Object.values(store).map(r => ({
      userId: 'local',
      examId: r.examId,
      questionNumber: r.questionNumber,
      picked: r.picked,
      correct: r.correct,
      updatedAt: r.timestamp,
      _key: `local:${r.examId}:${r.questionNumber}`,
    }));
    await getDb().answers.bulkPut(records);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // ignore malformed legacy data
  }
}

export async function initStorageAdapter(): Promise<void> {
  await migrateFromLocalStorage();
  setStorageAdapter(dexieAdapter);
}
