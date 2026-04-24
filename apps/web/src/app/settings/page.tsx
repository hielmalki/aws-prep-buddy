'use client';
import { useState } from 'react';
import { SettingsScreen } from '@/components/screens/SettingsScreen';

export default function SettingsPage() {
  const [dark, setDark] = useState(true);
  return <SettingsScreen dark={dark} onToggleDark={() => setDark(d => !d)}/>;
}
