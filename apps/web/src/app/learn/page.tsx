// import { LearnIndexScreen } from '@/components/screens/LearnIndexScreen';
// export default function LearnPage() { return <LearnIndexScreen />; }
import { redirect } from 'next/navigation';

export default function LearnPage() {
  redirect('/flashcards');
}
