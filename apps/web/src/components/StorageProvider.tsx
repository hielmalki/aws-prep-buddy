'use client';
import { useEffect, useState } from 'react';
import { useProgressStore, useSettingsStore, useStreakStore } from '@aws-prep/core';
import { getAllQuestions } from '@/lib/data';

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const hydrateProgress = useProgressStore(s => s.hydrate);
  const setQuestions = useProgressStore(s => s.setQuestions);
  const hydrateSettings = useSettingsStore(s => s.hydrate);
  const hydrateStreak = useStreakStore(s => s.hydrate);

  useEffect(() => {
    setQuestions(getAllQuestions());
    import('@/lib/store/dexie-adapter').then(({ initStorageAdapter }) =>
      initStorageAdapter().then(() =>
        Promise.all([hydrateProgress(), hydrateSettings(), hydrateStreak()])
      )
    ).then(() => setReady(true));
  }, [hydrateProgress, setQuestions, hydrateSettings, hydrateStreak]);

  if (!ready) return null;
  return <>{children}</>;
}
