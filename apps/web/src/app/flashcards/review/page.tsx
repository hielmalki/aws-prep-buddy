'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FlashcardReviewScreen } from '@/components/screens/FlashcardReviewScreen';

function ReviewPageInner() {
  const params = useSearchParams();
  const deckId = params.get('deck') ?? 'mistakes';
  return <FlashcardReviewScreen deckId={deckId} />;
}

export default function FlashcardReviewPage() {
  return (
    <Suspense>
      <ReviewPageInner />
    </Suspense>
  );
}
