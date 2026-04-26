'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { theme, baseFont } from '@/lib/theme';
import {
  useFlashcardStore,
  useProgressStore,
  dueCardsForDeck,
  totalCardsForDeck,
  wrongQuestionNumbersInExam,
} from '@aws-prep/core';
import { getExamLength, EXAM_COUNT } from '@/lib/data';
import { BottomNav } from '@/components/ui/BottomNav';
import { CardEditorSheet } from '@/components/ui/CardEditorSheet';
import { AICardReviewSheet, type AICardItem } from '@/components/screens/AICardReviewSheet';
import { Flame, Sparkle, Chevron, Cards, Plus, Check } from '@/components/icons';

interface FlashcardsScreenProps { dark?: boolean; }

// ── Wrong-answer picker ────────────────────────────────────
function WrongAnswerPicker({
  dark,
  open,
  onClose,
  onConfirm,
}: {
  dark: boolean;
  open: boolean;
  onClose(): void;
  onConfirm(items: AICardItem[]): void;
}) {
  const t = theme(dark);
  const answers = useProgressStore(s => s.answers);
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Collect all wrong answers across all exams
  const wrongItems: AICardItem[] = [];
  for (let examId = 1; examId <= EXAM_COUNT; examId++) {
    const total = getExamLength(examId);
    const wrongNums = wrongQuestionNumbersInExam(answers, examId, total);
    for (const qNum of wrongNums) {
      wrongItems.push({ examId, questionNumber: qNum });
    }
  }
  // Sort most-recently-wrong first
  wrongItems.sort((a, b) => {
    const ta = answers[`${a.examId}:${a.questionNumber}`]?.updatedAt ?? 0;
    const tb = answers[`${b.examId}:${b.questionNumber}`]?.updatedAt ?? 0;
    return tb - ta;
  });

  useEffect(() => {
    if (open) {
      // Pre-select the most recent 20 wrong answers
      const initial = new Set<string>(
        wrongItems.slice(0, 20).map(i => `${i.examId}:${i.questionNumber}`)
      );
      setSelected(initial);
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  function toggleItem(key: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else if (next.size < 20) {
        next.add(key);
      }
      return next;
    });
  }

  function handleConfirm() {
    const items = wrongItems.filter(i => selected.has(`${i.examId}:${i.questionNumber}`));
    onConfirm(items);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 80 }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: dark ? 'rgba(2,6,15,0.55)' : 'rgba(15,23,42,0.35)',
        backdropFilter: 'blur(4px)',
        opacity: mounted ? 1 : 0, transition: 'opacity .25s',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        maxHeight: '82%',
        background: dark ? 'rgba(15,23,42,0.97)' : 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        border: `1px solid ${t.border}`, borderBottom: 'none',
        borderRadius: '24px 24px 0 0',
        color: t.text, fontFamily: baseFont,
        display: 'flex', flexDirection: 'column',
        transform: mounted ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform .35s cubic-bezier(.2,.8,.2,1)',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.25)',
      }}>
        {/* Grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: t.borderStrong }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '6px 18px 14px', justifyContent: 'space-between' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, fontFamily: baseFont, fontSize: 14, fontWeight: 500, padding: 0 }}>
            Abbrechen
          </button>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Fehler auswählen</div>
          <button
            onClick={handleConfirm}
            disabled={selected.size === 0}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: selected.size === 0 ? t.textMuted : t.accent, fontFamily: baseFont, fontSize: 14, fontWeight: 700, padding: 0 }}
          >
            Weiter ({selected.size})
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 16px' }}>
          {wrongItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: t.textMuted, fontSize: 14 }}>
              Noch keine falsch beantworteten Fragen.
            </div>
          ) : (
            <>
              <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 10 }}>
                {wrongItems.length} Fehler gefunden · max. 20 auswählbar
              </div>
              {wrongItems.map(item => {
                const key = `${item.examId}:${item.questionNumber}`;
                const isSelected = selected.has(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleItem(key)}
                    style={{
                      width: '100%', textAlign: 'left',
                      padding: '10px 12px', borderRadius: 12, marginBottom: 6,
                      background: isSelected ? t.accentSoft : t.surface,
                      border: `1px solid ${isSelected ? t.accent + '44' : t.border}`,
                      color: t.text, fontFamily: baseFont, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 10,
                      transition: 'all .15s',
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                      border: `2px solid ${isSelected ? t.accent : t.borderStrong}`,
                      background: isSelected ? t.accent : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isSelected && <Check size={12} color="#fff" />}
                    </div>
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>
                      Prüfung {item.examId} · Frage {item.questionNumber}
                    </div>
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── New Deck Modal ─────────────────────────────────────────
function NewDeckModal({ dark, open, onClose }: { dark: boolean; open: boolean; onClose: () => void }) {
  const t = theme(dark);
  const createDeck = useFlashcardStore(s => s.createDeck);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) { setName(''); requestAnimationFrame(() => setMounted(true)); }
    else setMounted(false);
  }, [open]);

  if (!open) return null;

  async function handleCreate() {
    if (!name.trim()) return;
    setSaving(true);
    try { await createDeck(name.trim()); onClose(); }
    finally { setSaving(false); }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: dark ? 'rgba(2,6,15,0.6)' : 'rgba(15,23,42,0.4)',
        backdropFilter: 'blur(4px)',
        opacity: mounted ? 1 : 0, transition: 'opacity .2s',
      }}/>
      <div style={{
        position: 'relative', width: 'calc(100% - 48px)', maxWidth: 360,
        background: t.surface, borderRadius: 20, padding: '24px 20px 20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        transform: mounted ? 'scale(1)' : 'scale(0.92)',
        transition: 'transform .25s cubic-bezier(.2,.8,.2,1), opacity .25s',
        opacity: mounted ? 1 : 0,
        fontFamily: baseFont, color: t.text,
      }}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Neues Deck</div>
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          placeholder="Deck-Name..."
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 12, boxSizing: 'border-box',
            background: dark ? '#0F172A' : '#F8FAFC', color: t.text, fontFamily: baseFont,
            fontSize: 15, fontWeight: 600, border: `1.5px solid ${t.accent}`, outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px 0', borderRadius: 12, border: `1px solid ${t.border}`,
            background: 'transparent', color: t.textMuted, fontFamily: baseFont, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Abbrechen</button>
          <button onClick={handleCreate} disabled={!name.trim() || saving} style={{
            flex: 1, padding: '11px 0', borderRadius: 12, border: 'none',
            background: !name.trim() ? t.border : `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)`,
            color: !name.trim() ? t.textMuted : '#fff',
            fontFamily: baseFont, fontSize: 14, fontWeight: 700, cursor: name.trim() ? 'pointer' : 'default',
          }}>
            {saving ? '...' : 'Erstellen'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Screen ────────────────────────────────────────────
export function FlashcardsScreen({ dark = true }: FlashcardsScreenProps) {
  const t = theme(dark);
  const router = useRouter();

  const decks = useFlashcardStore(s => s.decks);
  const cards = useFlashcardStore(s => s.cards);
  const hydrated = useFlashcardStore(s => s.hydrated);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [aiSheetOpen, setAiSheetOpen] = useState(false);
  const [aiItems, setAiItems] = useState<AICardItem[]>([]);
  const [newDeckOpen, setNewDeckOpen] = useState(false);
  const [editorState, setEditorState] = useState<{ open: boolean; deckId: string }>({ open: false, deckId: '' });

  useEffect(() => {
    const store = useFlashcardStore.getState();
    store.hydrate().then(() => store.ensureMistakesDeck());
  }, []);

  // Compute totals
  const now = Date.now();
  const allDue = Object.values(decks).reduce((acc, d) => acc + dueCardsForDeck(cards, d.deckId, now).length, 0);
  const deckCount = Object.values(decks).filter(d => !d.isAuto).length;

  const mistakesDeck = decks['mistakes'];
  const mistakesTotal = mistakesDeck ? totalCardsForDeck(cards, 'mistakes') : 0;
  const mistakesDue = mistakesDeck ? dueCardsForDeck(cards, 'mistakes', now).length : 0;

  const userDecks = Object.values(decks).filter(d => !d.isAuto);
  const deckColors = ['#FF9900', '#60A5FA', '#4ADE80', '#A78BFA', '#F472B6', '#FB923C', '#34D399'];

  if (!hydrated) {
    return (
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
        <div style={{ padding: '64px 20px 14px' }}>
          <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>Wiederholen</div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6, marginTop: 2 }}>Flashcards</div>
        </div>
        <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 76, borderRadius: 16, background: t.surface, border: `1px solid ${t.border}`, opacity: 0.6 }}/>
          ))}
        </div>
        <BottomNav active="learn" t={t}/>
      </div>
    );
  }

  return (
    <>
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
        {/* Header */}
        <div style={{ padding: '64px 20px 14px' }}>
          <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>Wiederholen</div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6, marginTop: 2 }}>Flashcards</div>
          <div style={{ fontSize: 13, color: t.textMuted, marginTop: 4 }}>
            <span style={{ color: t.accent, fontWeight: 600 }}>{allDue}</span> Karten heute fällig
            {deckCount > 0 && <> · {deckCount} {deckCount === 1 ? 'Deck' : 'Decks'}</>}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 120px' }}>

          {/* Auto-Deck "Meine Fehler" */}
          <div style={{
            position: 'relative', overflow: 'hidden',
            borderRadius: 18, padding: 16,
            background: dark
              ? `radial-gradient(140% 100% at 0% 0%, rgba(255,153,0,0.32) 0%, transparent 60%), linear-gradient(135deg, #1F2A44 0%, #1E293B 100%)`
              : `radial-gradient(140% 100% at 0% 0%, rgba(255,153,0,0.28) 0%, transparent 60%), linear-gradient(135deg, #FFFFFF 0%, #FFF4E0 100%)`,
            border: `1px solid ${dark ? 'rgba(255,153,0,0.35)' : 'rgba(255,153,0,0.4)'}`,
            boxShadow: dark ? 'none' : '0 1px 2px rgba(15,23,42,0.04), 0 12px 32px rgba(255,153,0,0.18)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)`,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(255,153,0,0.4)',
              }}>
                <Flame size={22} color="#fff"/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 999, background: 'rgba(255,153,0,0.18)', color: t.accent, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>
                  Auto-Deck
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 5, letterSpacing: -0.2 }}>Meine Fehler</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
                  {mistakesTotal} {mistakesTotal === 1 ? 'Karte' : 'Karten'} · aus falsch beantworteten Fragen
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
              {mistakesDue > 0 && (
                <div style={{ padding: '5px 10px', borderRadius: 999, background: t.accent, color: '#fff', fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {mistakesDue} fällig
                </div>
              )}
              <div style={{ flex: 1 }}/>
              <button
                onClick={() => router.push('/flashcards/review?deck=mistakes')}
                style={{
                  padding: '10px 16px', borderRadius: 12, border: 'none',
                  background: t.text, color: t.bg, fontSize: 13, fontWeight: 700,
                  fontFamily: baseFont, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                Review <Chevron size={14} color={t.bg}/>
              </button>
            </div>
          </div>

          {/* AI generation CTA */}
          <button
            onClick={() => setAiSheetOpen(true)}
            style={{
              marginTop: 12, width: '100%',
              padding: '12px 14px', borderRadius: 14, boxSizing: 'border-box',
              background: t.surface, border: `1.5px dashed ${dark ? 'rgba(255,153,0,0.35)' : 'rgba(232,136,0,0.35)'}`,
              color: t.text, fontFamily: baseFont, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 10, background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkle size={18} color={t.accent}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>✨ Aus Fehlern generieren</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1 }}>KI erstellt Karten · ~10 sek</div>
            </div>
            <Chevron size={16} color={t.textMuted}/>
          </button>

          {/* User Decks section */}
          <div style={{ marginTop: 22, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>Deine Decks</div>
          </div>

          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {userDecks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: t.textMuted, fontSize: 13 }}>
                Noch keine Decks — tippe auf + um ein neues zu erstellen.
              </div>
            )}
            {userDecks.map((d, idx) => {
              const total = totalCardsForDeck(cards, d.deckId);
              const due = dueCardsForDeck(cards, d.deckId, now).length;
              const color = deckColors[idx % deckColors.length];
              const greenColor = dark ? '#4ADE80' : '#16A34A';
              const greenSoft = dark ? 'rgba(74,222,128,0.14)' : '#DCFCE7';
              return (
                <div key={d.deckId} style={{
                  background: t.surface, border: `1px solid ${t.border}`,
                  borderRadius: 16, padding: 14,
                  display: 'flex', alignItems: 'center', gap: 12,
                  boxShadow: dark ? 'none' : '0 1px 2px rgba(15,23,42,0.04)',
                }}>
                  {/* stack mini icon */}
                  <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 4, left: -2, width: 30, height: 36, borderRadius: 7, background: dark ? 'rgba(148,163,184,0.18)' : '#F1F5F9', transform: 'rotate(-8deg)' }}/>
                    <div style={{ position: 'absolute', top: 2, left: 6, width: 32, height: 38, borderRadius: 8, background: color, opacity: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                      <Cards size={18} color="#fff"/>
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: t.textMuted, marginTop: 3 }}>{total} Karten</div>
                  </div>
                  {due > 0 ? (
                    <div style={{ padding: '4px 9px', borderRadius: 999, background: t.accentSoft, color: t.accent, fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{due} fällig</div>
                  ) : (
                    <div style={{ padding: '4px 9px', borderRadius: 999, background: greenSoft, color: greenColor, fontSize: 11, fontWeight: 700 }}>✓ aktuell</div>
                  )}
                  <button
                    onClick={() => setEditorState({ open: true, deckId: d.deckId })}
                    title="Karte hinzufügen"
                    style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${t.border}`, background: 'transparent', color: t.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Plus size={15} color={t.textMuted}/>
                  </button>
                  <button
                    onClick={() => router.push(`/flashcards/review?deck=${d.deckId}`)}
                    style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${t.border}`, background: 'transparent', color: t.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Chevron size={15} color={t.textMuted}/>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAB */}
        <button
          onClick={() => setNewDeckOpen(true)}
          style={{
            position: 'absolute', right: 20, bottom: 100,
            width: 56, height: 56, borderRadius: 18, border: 'none',
            background: `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)`,
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 28px rgba(255,153,0,0.45), 0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 35,
          }}
        >
          <Plus size={26} color="#fff"/>
        </button>

        <BottomNav active="learn" t={t}/>
      </div>

      <AICardReviewSheet dark={dark} open={aiSheetOpen} onClose={() => setAiSheetOpen(false)} items={aiItems} deckId="mistakes" deckName="Mistakes"/>
      <NewDeckModal dark={dark} open={newDeckOpen} onClose={() => setNewDeckOpen(false)}/>
      <CardEditorSheet dark={dark} open={editorState.open} deckId={editorState.deckId} onClose={() => setEditorState({ open: false, deckId: '' })}/>
    </>
  );
}
