'use client';
import { useState } from 'react';
import { LearnScreen } from '@/components/screens/LearnScreen';

export default function LearnPage() {
  const [dark] = useState(true);
  return <LearnScreen dark={dark}/>;
}
