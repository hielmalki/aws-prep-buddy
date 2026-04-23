import { redirect } from 'next/navigation';
import { getQuestion, getExamLength } from '@/lib/data';
import { QuizScreen } from '@/components/screens/QuizScreen';

interface Props {
  searchParams: Promise<{ exam?: string; q?: string }>;
}

export default async function QuizPage({ searchParams }: Props) {
  const { exam, q } = await searchParams;
  const examId = Math.max(1, Math.min(23, Number(exam ?? 1) || 1));
  const questionNum = Math.max(1, Number(q ?? 1) || 1);

  const question = getQuestion(examId, questionNum);
  if (!question) redirect(`/quiz?exam=${examId}&q=1`);

  const total = getExamLength(examId);

  return <QuizScreen key={`${examId}-${questionNum}`} question={question} examId={examId} questionNum={questionNum} total={total}/>;
}
