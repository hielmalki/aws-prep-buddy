'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { theme, baseFont } from '@/lib/theme';
import { useFlashcardStore, dueCardsForDeck, applyReview } from '@aws-prep/core';
import type { ReviewQuality, FlashcardRecord } from '@aws-prep/core';
import { CardEditorSheet } from '@/components/ui/CardEditorSheet';
import { Check, Flip, Edit, Close } from '@/components/icons';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface FlashcardReviewScreenProps {
  dark?: boolean;
  deckId: string;
}

function formatInterval(card: FlashcardRecord, quality: ReviewQuality): string {
  const preview = applyReview(card, quality);
  if (quality === 'again') return '1 min';
  if (preview.interval === 0) return '1 min';
  if (preview.interval === 1) return '1 day';
  return `${preview.interval} days`;
}

export function FlashcardReviewScreen({ dark = false, deckId }: FlashcardReviewScreenProps) {
  const t = theme(dark);
  const router = useRouter();

  const decks = useFlashcardStore(s => s.decks);
  const cards = useFlashcardStore(s => s.cards);
  const hydrated = useFlashcardStore(s => s.hydrated);
  const reviewCard = useFlashcardStore(s => s.reviewCard);

  const [flipped, setFlipped] = useState(false);
  const [sessionCards, setSessionCards] = useState<FlashcardRecord[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      useFlashcardStore.getState().hydrate().then(() =>
        useFlashcardStore.getState().ensureMistakesDeck()
      );
    }
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const due = dueCardsForDeck(cards, deckId);
    setSessionCards(due);
    setCurrentIdx(0);
    setFlipped(false);
  }, [hydrated, deckId]); // eslint-disable-line react-hooks/exhaustive-deps

  const deck = decks[deckId];
  const deckName = deck?.name ?? '…';
  const currentCard = sessionCards[currentIdx] ?? null;
  const total = sessionCards.length;
  const progress = total > 0 ? Math.round((currentIdx / total) * 100) : 0;

  const srsButtons: { quality: ReviewQuality; label: string; color: string; bg: string }[] = currentCard ? [
    { quality: 'again', label: 'Again', color: t.danger,  bg: t.dangerSoft  },
    { quality: 'hard',  label: 'Hard',  color: t.warning, bg: t.warningSoft },
    { quality: 'good',  label: 'Good',  color: t.success, bg: t.successSoft },
    { quality: 'easy',  label: 'Easy',  color: t.accent,  bg: t.accentSoft  },
  ] : [];

  async function handleReview(quality: ReviewQuality) {
    if (!currentCard) return;
    await reviewCard(currentCard.cardId, quality);
    setCurrentIdx(i => i + 1);
    setFlipped(false);
  }

  const CircleBtn = ({ children, onClick }: { children: React.ReactNode; onClick(): void }) => (
    <button
      onClick={onClick}
      style={{
        width: 36, height: 36, borderRadius: 18, border: 'none',
        background: t.surface2, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );

  if (!hydrated) {
    return (
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text }}>
        <div style={{ padding: '60px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: t.surface2 }}/>
          <div style={{ height: 14, width: 120, borderRadius: 8, background: t.surface2 }}/>
        </div>
      </div>
    );
  }

  if (!currentCard || currentIdx >= total) {
    return (
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text }}>
        <div style={{ padding: '60px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <CircleBtn onClick={() => router.push('/flashcards')}>
            <Close size={17} color={t.text}/>
          </CircleBtn>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.textMuted }}>{deckName}</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 140, height: 140, marginBottom: 8 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 70, background: t.successSoft }}/>
            <div style={{ position: 'absolute', inset: 18, borderRadius: 52, background: t.successSoft, opacity: 0.7 }}/>
            <div style={{ position: 'absolute', inset: 36, borderRadius: 36, background: t.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={40} color="#fff"/>
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, marginTop: 18, letterSpacing: -0.4 }}>You&apos;re all caught up</div>
          <div style={{ fontSize: 14, color: t.textMuted, marginTop: 8, lineHeight: 1.55, maxWidth: 280 }}>
            No cards due. Check back tomorrow for your next review.
          </div>
          <button
            onClick={() => router.push('/flashcards')}
            style={{ marginTop: 24, padding: '12px 20px', borderRadius: 12, border: 'none', background: t.accent, color: t.accentText, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: baseFont, letterSpacing: -0.1 }}
          >
            Add a card
          </button>
          <button
            onClick={() => router.push('/flashcards')}
            style={{ marginTop: 8, padding: '10px 18px', borderRadius: 10, border: 'none', background: 'transparent', color: t.textMuted, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: baseFont }}
          >
            Back to decks
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
        {/* Top bar */}
        <div style={{ padding: '60px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <CircleBtn onClick={() => router.push('/flashcards')}>
            <Close size={17} color={t.text}/>
          </CircleBtn>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 500, color: t.textMuted, marginBottom: 5 }}>
              <span>{deckName}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', color: t.text }}>{currentIdx + 1} / {total}</span>
            </div>
            <ProgressBar pct={progress} t={t} h={4}/>
          </div>
          <CircleBtn onClick={() => setEditorOpen(true)}>
            <Edit size={15} color={t.textMuted}/>
          </CircleBtn>
        </div>

        {/* Card area */}
        <div style={{ flex: 1, padding: '24px 22px 0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setFlipped(f => !f)}
              onKeyDown={e => e.key === 'Enter' && setFlipped(f => !f)}
              style={{ width: '100%', maxHeight: 460, aspectRatio: '0.78', position: 'relative', cursor: 'pointer' }}
            >
              {!flipped ? (
                <div style={{
                  position: 'absolute', inset: 0,
                  borderRadius: 18, background: t.cardBg,
                  border: `0.5px solid ${t.border}`,
                  boxShadow: dark
                    ? '0 12px 40px rgba(0,0,0,0.5)'
                    : '0 1px 2px rgba(0,0,0,0.04), 0 16px 40px rgba(0,0,0,0.08)',
                  padding: 22,
                  display: 'flex', flexDirection: 'column',
                }}>
                  {currentCard.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {currentCard.tags.slice(0, 3).map((tag, i) => (
                        <span key={tag} style={{
                          fontSize: 11, padding: '3px 9px', borderRadius: 6,
                          background: i === 0 ? t.accentSoft : t.surface2,
                          color: i === 0 ? t.accent : t.textMuted,
                          fontWeight: i === 0 ? 600 : 500,
                          letterSpacing: -0.1,
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px 4px' }}>
                    <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.3, letterSpacing: -0.5 }}>
                      {currentCard.front}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: t.textMuted, fontSize: 13 }}>
                    <Flip size={14} color={t.textMuted}/> Tap to flip
                  </div>
                </div>
              ) : (
                <div style={{
                  position: 'absolute', inset: 0,
                  borderRadius: 18, background: t.cardBg,
                  border: `0.5px solid ${t.accentHair}`,
                  boxShadow: dark
                    ? '0 12px 40px rgba(0,0,0,0.5), 0 0 0 3px rgba(10,132,255,0.10)'
                    : '0 1px 2px rgba(0,0,0,0.04), 0 16px 40px rgba(0,113,227,0.16)',
                  padding: 22,
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: t.accent, letterSpacing: 0.4, textTransform: 'uppercase' }}>Answer</div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '14px 0' }}>
                    <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.3, color: t.text, lineHeight: 1.45 }}>
                      {currentCard.back}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom action bar */}
          <div style={{ paddingTop: 18, paddingBottom: 24 }}>
            {!flipped ? (
              <button
                onClick={() => setFlipped(true)}
                style={{
                  width: '100%', height: 50, borderRadius: 12, border: 'none',
                  background: t.accent, color: t.accentText, fontSize: 16, fontWeight: 600,
                  fontFamily: baseFont, cursor: 'pointer', letterSpacing: -0.2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Flip size={17} color={t.accentText}/> Show Answer
              </button>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {srsButtons.map(b => (
                  <button
                    key={b.quality}
                    onClick={() => handleReview(b.quality)}
                    style={{
                      padding: '11px 4px', borderRadius: 12, border: 'none',
                      background: b.bg,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      cursor: 'pointer', fontFamily: baseFont,
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600, color: b.color, letterSpacing: -0.2 }}>{b.label}</div>
                    <div style={{
                      fontSize: 10, fontWeight: 600, color: b.color, opacity: 0.8,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {formatInterval(currentCard, b.quality)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CardEditorSheet
        dark={dark}
        open={editorOpen}
        deckId={currentCard.deckId}
        cardId={currentCard.cardId}
        onClose={() => setEditorOpen(false)}
      />
    </>
  );
}
