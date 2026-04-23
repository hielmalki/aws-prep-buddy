import { create } from 'zustand';
import { getStorageAdapter } from './adapter.js';
import type { SettingsRecord } from './schema.js';

interface SettingsState {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  llmProvider: 'anthropic' | 'openai';
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  setLlmProvider: (provider: 'anthropic' | 'openai') => Promise<void>;
}

async function persist(state: SettingsState): Promise<void> {
  const record: SettingsRecord = {
    userId: state.userId,
    theme: state.theme,
    llmProvider: state.llmProvider,
    updatedAt: Date.now(),
  };
  await getStorageAdapter().put('settings', state.userId, record);
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  userId: 'local',
  theme: 'system',
  llmProvider: 'anthropic',
  hydrated: false,

  hydrate: async () => {
    const { userId } = get();
    const record = await getStorageAdapter().get<SettingsRecord>('settings', userId);
    if (record) {
      set({ theme: record.theme, llmProvider: record.llmProvider, hydrated: true });
    } else {
      set({ hydrated: true });
    }
  },

  setTheme: async (theme) => {
    set({ theme });
    await persist({ ...get(), theme });
  },

  setLlmProvider: async (llmProvider) => {
    set({ llmProvider });
    await persist({ ...get(), llmProvider });
  },
}));
