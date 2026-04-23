'use client';
import { useEffect, useState } from 'react';
import { useProgressStore, useSettingsStore, useStreakStore } from '@aws-prep/core';

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const hydrateProgress = useProgressStore(s => s.hydrate);
  const hydrateSettings = useSettingsStore(s => s.hydrate);
  const hydrateStreak = useStreakStore(s => s.hydrate);

  useEffect(() => {
    import('@/lib/store/dexie-adapter').then(({ initStorageAdapter }) =>
      initStorageAdapter().then(() =>
        Promise.all([hydrateProgress(), hydrateSettings(), hydrateStreak()])
      )
    ).then(() => setReady(true));
  }, [hydrateProgress, hydrateSettings, hydrateStreak]);

  if (!ready) return null;
  return <>{children}</>;
}
