import { redirect } from 'next/navigation';
import { LEARN_MODULES } from '@aws-prep/content';
import { LearnModuleScreen } from '@/components/screens/LearnModuleScreen';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function LearnSlugPage({ params }: Props) {
  const { slug } = await params;
  const mod = LEARN_MODULES.find(m => m.slug === slug);
  if (!mod) redirect('/learn');
  return <LearnModuleScreen module={mod} />;
}
