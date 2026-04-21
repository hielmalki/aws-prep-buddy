'use client';
import { useState } from 'react';
import { QuizScreen } from '@/components/screens/QuizScreen';

export default function QuizPage() {
  const [dark] = useState(true);
  return <QuizScreen dark={dark}/>;
}
