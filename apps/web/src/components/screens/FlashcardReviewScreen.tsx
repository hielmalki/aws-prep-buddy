'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { theme, baseFont } from '@/lib/theme';
import { useFlashcardStore, dueCardsForDeck, applyReview } from '@aws-prep/core';
import type { ReviewQuality, FlashcardRecord } from '@aws-prep/core';
import { CardEditorSheet } from '@/components/ui/CardEditorSheet';
import { Back, Check, Flip, Edit } from '@/components/icons';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface FlashcardReviewScreenProps {
  dark?: boolean;
  deckId: string;
}

function formatInterval(card: FlashcardRecord, quality: ReviewQuality): string {
  const preview = applyReview(card, quality);
  if (quality === 'again') return '1 Min';
  if (preview.interval === 0) return '1 Min';
  if (preview.interval === 1) return '1 Tag';
  return `${preview.interval} Tage`;
}

export function FlashcardReviewScreen({ dark = true, deckId }: FlashcardReviewScreenProps) {
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

  // Hydrate on mount
  useEffect(() => {
    if (!hydrated) {
      useFlashcardStore.getState().hydrate().then(() =>
        useFlashcardStore.getState().ensureMistakesDeck()
      );
    }
  }, [hydrated]);

  // Load due cards for this deck once hydrated
  useEffect(() => {
    if (!hydrated) return;
    const due = dueCardsForDeck(cards, deckId);
    setSessionCards(due);
    setCurrentIdx(0);
    setFlipped(false);
  }, [hydrated, deckId]); // intentionally not re-running on cards change to avoid mid-session reshuffles

  const deck = decks[deckId];
  const deckName = deck?.name ?? '…';
  const currentCard = sessionCards[currentIdx] ?? null;
  const total = sessionCards.length;
  const progress = total > 0 ? Math.round((currentIdx / total) * 100) : 0;

  const blue = dark ? '#60A5FA' : '#2563EB';
  const blueSoft = dark ? 'rgba(96,165,250,0.18)' : '#DBEAFE';

  const srsButtons: { quality: ReviewQuality; label: string; color: string; bg: string }[] = currentCard ? [
    { quality: 'again', label: 'Again', color: t.red,   bg: dark ? 'rgba(248,113,113,0.18)' : '#FEE2E2' },
    { quality: 'hard',  label: 'Hard',  color: t.accent, bg: dark ? 'rgba(255,153,0,0.18)'  : '#FFEDD5' },
    { quality: 'good',  label: 'Good',  color: t.green,  bg: dark ? 'rgba(74,222,128,0.18)' : '#DCFCE7' },
    { quality: 'easy',  label: 'Easy',  color: blue,     bg: blueSoft },
  ] : [];

  async function handleReview(quality: ReviewQuality) {
    if (!currentCard) return;
    await reviewCard(currentCard.cardId, quality);
    setCurrentIdx(i => i + 1);
    setFlipped(false);
  }

  // Loading skeleton
  if (!hydrated) {
    return (
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text }}>
        <div style={{ padding: '64px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: t.surface, border: `1px solid ${t.border}` }}/>
          <div style={{ height: 14, width: 120, borderRadius: 8, background: t.surface }}/>
        </div>
      </div>
    );
  }

  // Empty / done state
  if (!currentCard || currentIdx >= total) {
    return (
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text }}>
        <div style={{ padding: '64px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => router.push('/flashcards')} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Back size={18} color={t.text}/>
          </button>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.textMuted }}>{deckName}</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 140, height: 140, marginBottom: 8 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 70, background: dark ? 'rgba(74,222,128,0.12)' : '#DCFCE7' }}/>
            <div style={{ position: 'absolute', inset: 18, borderRadius: 52, background: dark ? 'rgba(74,222,128,0.18)' : '#BBF7D0' }}/>
            <div style={{ position: 'absolute', inset: 36, borderRadius: 36, background: t.green, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 32px rgba(22,163,74,0.4)' }}>
              <Check size={40} color="#fff"/>
            </div>
            <div style={{ position: 'absolute', top: 8, right: 18, fontSize: 22 }}>✨</div>
            <div style={{ position: 'absolute', bottom: 14, left: 12, fontSize: 18 }}>🎉</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 18, letterSpacing: -0.4 }}>Du bist auf dem aktuellen Stand</div>
          <div style={{ fontSize: 14, color: t.textMuted, marginTop: 8, lineHeight: 1.55, maxWidth: 280 }}>
            Keine Karten mehr fällig. Komm morgen wieder!
          </div>
          <button
            onClick={() => router.push('/flashcards')}
            style={{ marginTop: 24, padding: '12px 20px', borderRadius: 12, border: 'none', background: t.text, color: t.bg, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: baseFont }}
          >
            Zurück zu Decks
          </button>
        </div>
      </div>
    );
  }

  const cardBg = dark ? '#1E293B' : '#FFFFFF';

  return (
    <>
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
        {/* Top bar */}
        <div style={{ padding: '64px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.push('/flashcards')}
            style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Back size={18} color={t.text}/>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: t.textMuted, marginBottom: 5 }}>
              <span style={{ fontSize: 12 }}>{deckName}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{currentIdx + 1} / {total}</span>
            </div>
            <ProgressBar pct={progress} t={t}/>
          </div>
          <button
            onClick={() => setEditorOpen(true)}
            style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Edit size={16} color={t.textMuted}/>
          </button>
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
                /* FRONT */
                <div style={{
                  position: 'absolute', inset: 0,
                  borderRadius: 20, background: cardBg,
                  border: `1px solid ${t.border}`,
                  boxShadow: dark ? '0 12px 40px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.2)' : '0 1px 2px rgba(15,23,42,0.04), 0 16px 40px rgba(15,23,42,0.10)',
                  padding: '22px 22px 18px',
                  display: 'flex', flexDirection: 'column',
                }}>
                  {currentCard.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      {currentCard.tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: dark ? '#0F172A' : '#F1F5F9', color: t.textMuted, fontWeight: 600 }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px 4px' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.35, letterSpacing: -0.3 }}>
                      {currentCard.front}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: t.textMuted, fontSize: 12 }}>
                    <Flip size={15} color={t.textMuted}/> Tippe zum Umdrehen
                  </div>
                </div>
              ) : (
                /* BACK */
                <div style={{
                  position: 'absolute', inset: 0,
                  borderRadius: 20, background: cardBg,
                  border: `1.5px solid ${t.accent}`,
                  boxShadow: dark ? '0 12px 40px rgba(0,0,0,0.4), 0 0 0 4px rgba(255,153,0,0.1)' : '0 1px 2px rgba(15,23,42,0.04), 0 16px 40px rgba(255,153,0,0.18)',
                  padding: '22px 22px 20px',
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: t.accent, letterSpacing: 0.6, textTransform: 'uppercase' }}>Antwort</div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '14px 0' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.6, color: t.accent, lineHeight: 1.25 }}>
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
                  width: '100%', height: 52, borderRadius: 14, border: 'none',
                  background: t.text, color: t.bg, fontSize: 15, fontWeight: 700,
                  fontFamily: baseFont, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Flip size={18} color={t.bg}/> Antwort anzeigen
              </button>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {srsButtons.map(b => (
                  <button
                    key={b.quality}
                    onClick={() => handleReview(b.quality)}
                    style={{
                      padding: '10px 4px', borderRadius: 14, border: `1.5px solid ${b.color}40`,
                      background: b.bg,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                      cursor: 'pointer', fontFamily: baseFont,
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 800, color: b.color, letterSpacing: -0.2 }}>{b.label}</div>
                    <div style={{
                      fontSize: 10, fontWeight: 600, color: b.color, opacity: 0.85,
                      fontVariantNumeric: 'tabular-nums',
                      padding: '2px 7px', borderRadius: 999,
                      background: dark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.7)',
                      border: `1px solid ${b.color}25`,
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
