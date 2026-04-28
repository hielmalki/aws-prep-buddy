import { create } from 'zustand';
import { getStorageAdapter } from './adapter.js';
import type { TutorMemoryRecord, TutorMessageRecord, TutorSessionRecord } from './schema.js';

const DEFAULT_SESSION = 'default';

function messageKey(userId: string, sessionId: string, seq: number): string {
  return `${userId}:${sessionId}:${seq.toString().padStart(8, '0')}`;
}

function sessionKey(userId: string, sessionId: string): string {
  return `${userId}:${sessionId}`;
}

function memoryKey(userId: string): string {
  return userId;
}

function emptySession(userId: string): TutorSessionRecord {
  return {
    userId,
    sessionId: DEFAULT_SESSION,
    summary: '',
    summaryUpToSeq: 0,
    turnsSinceMemoryUpdate: 0,
    updatedAt: 0,
  };
}

function emptyMemory(userId: string): TutorMemoryRecord {
  return {
    userId,
    goals: '',
    studyFocus: '',
    personalNotes: '',
    updatedAt: 0,
  };
}

interface TutorState {
  userId: string;
  sessionId: string;
  messages: TutorMessageRecord[];
  session: TutorSessionRecord;
  memory: TutorMemoryRecord;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  appendMessage: (role: 'user' | 'assistant', content: string) => Promise<TutorMessageRecord>;
  bumpTurnsSinceMemoryUpdate: () => Promise<void>;
  resetTurnsSinceMemoryUpdate: () => Promise<void>;
  replaceHistoryWithSummary: (summary: string, lastIncludedSeq: number) => Promise<void>;
  setMemory: (patch: Partial<Pick<TutorMemoryRecord, 'goals' | 'studyFocus' | 'personalNotes'>>) => Promise<void>;
  clearAll: () => Promise<void>;
}

export const useTutorStore = create<TutorState>((set, get) => ({
  userId: 'local',
  sessionId: DEFAULT_SESSION,
  messages: [],
  session: emptySession('local'),
  memory: emptyMemory('local'),
  hydrated: false,

  hydrate: async () => {
    const { userId, sessionId } = get();
    const adapter = getStorageAdapter();
    const [msgList, sessionRec, memoryRec] = await Promise.all([
      adapter.list<TutorMessageRecord>('tutorMessages', { userId }),
      adapter.get<TutorSessionRecord>('tutorSessions', sessionKey(userId, sessionId)),
      adapter.get<TutorMemoryRecord>('tutorMemory', memoryKey(userId)),
    ]);
    const messages = msgList
      .filter(m => m.sessionId === sessionId)
      .sort((a, b) => a.seq - b.seq);
    set({
      messages,
      session: sessionRec ?? emptySession(userId),
      memory: memoryRec ?? emptyMemory(userId),
      hydrated: true,
    });
  },

  appendMessage: async (role, content) => {
    const { userId, sessionId, messages } = get();
    const seq = (messages[messages.length - 1]?.seq ?? 0) + 1;
    const record: TutorMessageRecord = {
      userId,
      sessionId,
      seq,
      role,
      content,
      createdAt: Date.now(),
    };
    set({ messages: [...messages, record] });
    await getStorageAdapter().put('tutorMessages', messageKey(userId, sessionId, seq), record);
    return record;
  },

  bumpTurnsSinceMemoryUpdate: async () => {
    const { userId, sessionId, session } = get();
    const next: TutorSessionRecord = {
      ...session,
      userId,
      sessionId,
      turnsSinceMemoryUpdate: session.turnsSinceMemoryUpdate + 1,
      updatedAt: Date.now(),
    };
    set({ session: next });
    await getStorageAdapter().put('tutorSessions', sessionKey(userId, sessionId), next);
  },

  resetTurnsSinceMemoryUpdate: async () => {
    const { userId, sessionId, session } = get();
    const next: TutorSessionRecord = {
      ...session,
      userId,
      sessionId,
      turnsSinceMemoryUpdate: 0,
      updatedAt: Date.now(),
    };
    set({ session: next });
    await getStorageAdapter().put('tutorSessions', sessionKey(userId, sessionId), next);
  },

  replaceHistoryWithSummary: async (summary, lastIncludedSeq) => {
    const { userId, sessionId, messages, session } = get();
    const adapter = getStorageAdapter();
    const toRemove = messages.filter(m => m.seq <= lastIncludedSeq);
    const remaining = messages.filter(m => m.seq > lastIncludedSeq);
    await Promise.all(
      toRemove.map(m => adapter.delete('tutorMessages', messageKey(userId, sessionId, m.seq))),
    );
    const nextSession: TutorSessionRecord = {
      ...session,
      userId,
      sessionId,
      summary,
      summaryUpToSeq: lastIncludedSeq,
      updatedAt: Date.now(),
    };
    await adapter.put('tutorSessions', sessionKey(userId, sessionId), nextSession);
    set({ messages: remaining, session: nextSession });
  },

  setMemory: async patch => {
    const { userId, memory } = get();
    const next: TutorMemoryRecord = {
      ...memory,
      userId,
      ...patch,
      updatedAt: Date.now(),
    };
    set({ memory: next });
    await getStorageAdapter().put('tutorMemory', memoryKey(userId), next);
  },

  clearAll: async () => {
    const { userId, sessionId, messages } = get();
    const adapter = getStorageAdapter();
    await Promise.all(
      messages.map(m => adapter.delete('tutorMessages', messageKey(userId, sessionId, m.seq))),
    );
    await adapter.delete('tutorSessions', sessionKey(userId, sessionId));
    await adapter.delete('tutorMemory', memoryKey(userId));
    set({
      messages: [],
      session: emptySession(userId),
      memory: emptyMemory(userId),
    });
  },
}));
