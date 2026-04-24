import { redirect } from 'next/navigation';
import { getExamLength } from '@/lib/data';
import { ReviewScreen } from '@/components/screens/ReviewScreen';

interface Props {
  searchParams: Promise<{ exam?: string; i?: string }>;
}

export default async function ReviewPage({ searchParams }: Props) {
  const { exam, i } = await searchParams;
  const examId = Math.max(1, Math.min(23, Number(exam ?? 1) || 1));
  const startIndex = Math.max(0, Number(i ?? 0) || 0);
  const total = getExamLength(examId);
  if (total === 0) redirect('/');
  return <ReviewScreen examId={examId} total={total} startIndex={startIndex} />;
}
