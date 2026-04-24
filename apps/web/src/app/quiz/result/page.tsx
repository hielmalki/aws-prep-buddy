import { redirect } from 'next/navigation';
import { getExamLength } from '@/lib/data';
import { ResultScreen } from '@/components/screens/ResultScreen';

interface Props {
  searchParams: Promise<{ exam?: string }>;
}

export default async function ResultPage({ searchParams }: Props) {
  const { exam } = await searchParams;
  const examId = Math.max(1, Math.min(23, Number(exam ?? 1) || 1));
  const total = getExamLength(examId);
  if (total === 0) redirect('/');
  return <ResultScreen examId={examId} total={total} />;
}
