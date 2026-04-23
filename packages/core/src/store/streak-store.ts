import { create } from 'zustand';
import { getStorageAdapter } from './adapter.js';
import { computeNextStreak, todayString } from './streak-logic.js';
import type { StreakRecord } from './schema.js';

interface StreakState {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  bumpToday: () => Promise<void>;
}

export const useStreakStore = create<StreakState>((set, get) => ({
  userId: 'local',
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  hydrated: false,

  hydrate: async () => {
    const { userId } = get();
    const record = await getStorageAdapter().get<StreakRecord>('streak', userId);
    if (record) {
      set({
        currentStreak: record.currentStreak,
        longestStreak: record.longestStreak,
        lastActivityDate: record.lastActivityDate,
        hydrated: true,
      });
    } else {
      set({ hydrated: true });
    }
  },

  bumpToday: async () => {
    const { userId, currentStreak, longestStreak, lastActivityDate } = get();
    const today = todayString();
    const { streak, changed } = computeNextStreak(lastActivityDate, currentStreak, today);
    if (!changed) return;
    const nextLongest = Math.max(longestStreak, streak);
    const record: StreakRecord = {
      userId,
      lastActivityDate: today,
      currentStreak: streak,
      longestStreak: nextLongest,
      updatedAt: Date.now(),
    };
    set({ currentStreak: streak, longestStreak: nextLongest, lastActivityDate: today });
    await getStorageAdapter().put('streak', userId, record);
  },
}));
