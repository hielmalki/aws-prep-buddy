'use client';
import { useState } from 'react';
import { HomeScreen } from '@/components/screens/HomeScreen';

export default function HomePage() {
  const [dark, setDark] = useState(true);
  return <HomeScreen dark={dark} onToggleDark={() => setDark(d => !d)}/>;
}
