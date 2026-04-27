import { DeckDetailScreen } from '@/components/screens/DeckDetailScreen';

export default async function Page({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params;
  return <DeckDetailScreen deckId={decodeURIComponent(deckId)} />;
}
