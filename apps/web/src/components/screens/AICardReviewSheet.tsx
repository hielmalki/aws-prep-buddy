'use client';
import { useEffect, useRef, useState } from 'react';
import { theme, baseFont } from '@/lib/theme';
import { useFlashcardStore } from '@aws-prep/core';
import { getQuestion } from '@/lib/data';
import { CardEditorSheet } from '@/components/ui/CardEditorSheet';
import { Close, Sparkle, Check, X, Edit } from '@/components/icons';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AICardItem {
  examId: number;
  questionNumber: number;
}

export interface AICardReviewSheetProps {
  dark: boolean;
  open: boolean;
  onClose(): void;
  items: AICardItem[];
  deckId: string;
  deckName: string;
}

interface GeneratedCard {
  index: number;
  front: string;
  back: string;
  tags: string[];
  /** true = accepted (default), false = skipped */
  accepted: boolean;
  /** true if front substring ≥30 chars matches original question text */
  copyrightWarning: boolean;
}

// ── Copyright LCS guard ───────────────────────────────────────────────────────

function longestCommonSubstringLength(a: string, b: string): number {
  const aLow = a.toLowerCase();
  const bLow = b.toLowerCase();
  const m = aLow.length;
  const n = bLow.length;
  let maxLen = 0;
  // Use single row DP to save memory
  const prev = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    let diagVal = 0;
    for (let j = 1; j <= n; j++) {
      const tmp = prev[j];
      if (aLow[i - 1] === bLow[j - 1]) {
        prev[j] = diagVal + 1;
        if (prev[j] > maxLen) maxLen = prev[j];
      } else {
        prev[j] = 0;
      }
      diagVal = tmp;
    }
  }
  return maxLen;
}

function hasCopyrightRisk(front: string, originalText: string): boolean {
  return longestCommonSubstringLength(front, originalText) >= 30;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AICardReviewSheet({
  dark,
  open,
  onClose,
  items,
  deckId,
  deckName,
}: AICardReviewSheetProps) {
  const t = theme(dark);
  const addCard = useFlashcardStore(s => s.addCard);

  const [mounted, setMounted] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<(GeneratedCard | null)[]>([]);
  const [saving, setSaving] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Editor sheet state for editing a draft card
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<{ front: string; back: string; tags: string[] } | null>(null);

  // Mount/unmount animation
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [open]);

  // Start generation when opened
  useEffect(() => {
    if (!open || items.length === 0) return;

    setCards(new Array(items.length).fill(null));
    setError(null);
    setStreaming(true);

    const abort = new AbortController();
    abortRef.current = abort;

    (async () => {
      try {
        const res = await fetch('/api/flashcards/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, deckId }),
          signal: abort.signal,
        });

        if (!res.ok || !res.body) {
          setError(`Request failed (${res.status})`);
          setStreaming(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let lineBuffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          lineBuffer += decoder.decode(value, { stream: true });

          const parts = lineBuffer.split('\n');
          lineBuffer = parts.pop() ?? '';

          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6);
            try {
              const payload = JSON.parse(jsonStr);
              if (payload.done) {
                setStreaming(false);
                break;
              }
              if (payload.error) {
                setError(payload.error as string);
                setStreaming(false);
                break;
              }
              if (typeof payload.index === 'number') {
                const item = items[payload.index];
                const originalQ = item ? getQuestion(item.examId, item.questionNumber) : undefined;
                const copyrightWarning = originalQ
                  ? hasCopyrightRisk(payload.front as string, originalQ.text)
                  : false;

                const card: GeneratedCard = {
                  index: payload.index as number,
                  front: payload.front as string,
                  back: payload.back as string,
                  tags: Array.isArray(payload.tags) ? (payload.tags as string[]) : [],
                  accepted: true,
                  copyrightWarning,
                };

                setCards(prev => {
                  const next = [...prev];
                  next[payload.index as number] = card;
                  return next;
                });
              }
            } catch {
              // ignore malformed chunk
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Stream error');
        setStreaming(false);
      }
    })();

    return () => {
      abort.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function toggleAccept(idx: number) {
    setCards(prev => {
      const next = [...prev];
      const card = next[idx];
      if (card) next[idx] = { ...card, accepted: !card.accepted };
      return next;
    });
  }

  function openEdit(idx: number) {
    const card = cards[idx];
    if (!card) return;
    setEditingIdx(idx);
    setEditDraft({ front: card.front, back: card.back, tags: card.tags });
    setEditorOpen(true);
  }

  function applyEdit(front: string, back: string, tags: string[]) {
    if (editingIdx === null) return;
    setCards(prev => {
      const next = [...prev];
      const card = next[editingIdx];
      if (card) {
        const item = items[editingIdx];
        const originalQ = item ? getQuestion(item.examId, item.questionNumber) : undefined;
        next[editingIdx] = {
          ...card,
          front,
          back,
          tags,
          accepted: true,
          copyrightWarning: originalQ ? hasCopyrightRisk(front, originalQ.text) : false,
        };
      }
      return next;
    });
    setEditorOpen(false);
    setEditingIdx(null);
    setEditDraft(null);
  }

  async function handleSave() {
    const toSave = cards.filter((c): c is GeneratedCard => c !== null && c.accepted);
    if (toSave.length === 0) return;
    setSaving(true);
    try {
      for (let i = 0; i < toSave.length; i++) {
        const card = toSave[i];
        const item = items[card.index];
        await addCard({
          deckId,
          front: card.front,
          back: card.back,
          tags: card.tags,
          source: item
            ? { type: 'wrong-answer', examId: item.examId, questionNumber: item.questionNumber }
            : undefined,
        });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const acceptedCount = cards.filter(c => c?.accepted).length;
  const totalArrived = cards.filter(c => c !== null).length;

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 80 }}>
        {/* Backdrop */}
        <div
          onClick={() => { abortRef.current?.abort(); onClose(); }}
          style={{
            position: 'absolute', inset: 0,
            background: dark ? 'rgba(2,6,15,0.55)' : 'rgba(15,23,42,0.35)',
            backdropFilter: 'blur(4px)',
            opacity: mounted ? 1 : 0, transition: 'opacity .25s',
          }}
        />

        {/* Sheet */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          height: '90%',
          background: t.bg,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          boxShadow: '0 -8px 40px rgba(0,0,0,0.3)',
          color: t.text, fontFamily: baseFont,
          display: 'flex', flexDirection: 'column',
          transform: mounted ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform .35s cubic-bezier(.2,.8,.2,1)',
        }}>
          {/* Grabber */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 6 }}>
            <div style={{ width: 38, height: 4, borderRadius: 2, background: t.borderStrong }} />
          </div>

          {/* Header */}
          <div style={{ padding: '8px 18px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 11,
                background: `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                boxShadow: '0 6px 18px rgba(255,153,0,0.35)',
              }}>
                <Sparkle size={20} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>
                  {streaming
                    ? `Karten aus ${items.length} Fehlern generieren`
                    : error
                      ? `Karten aus ${items.length} Fehlern generieren`
                      : `Karten aus ${items.length} Fehlern generieren`}
                </div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {streaming && (
                    <span style={{ display: 'inline-flex', gap: 2 }}>
                      <span style={{ width: 4, height: 4, borderRadius: 2, background: t.accent, animation: 'fcdot 1.2s 0s infinite' }}/>
                      <span style={{ width: 4, height: 4, borderRadius: 2, background: t.accent, animation: 'fcdot 1.2s .15s infinite' }}/>
                      <span style={{ width: 4, height: 4, borderRadius: 2, background: t.accent, animation: 'fcdot 1.2s .3s infinite' }}/>
                    </span>
                  )}
                  {streaming
                    ? `Streaming · ${totalArrived} von ${items.length} Vorschlägen`
                    : error
                      ? 'Fehler aufgetreten'
                      : `${totalArrived} Vorschläge bereit`}
                </div>
              </div>
              <div style={{
                width: 32, height: 32, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
                onClick={() => { abortRef.current?.abort(); onClose(); }}
              >
                <Close size={16} color={t.textMuted} />
              </div>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div style={{ margin: '0 18px 12px', padding: '12px 14px', borderRadius: 12, background: dark ? 'rgba(248,113,113,0.12)' : '#FEF2F2', color: dark ? '#F87171' : '#DC2626', fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Card list */}
          <div style={{ flex: 1, overflow: 'auto', padding: '4px 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {cards.map((card, idx) =>
              card === null ? (
                // Skeleton
                <SkeletonRow key={idx} dark={dark} t={t} />
              ) : (
                <CardRow
                  key={idx}
                  card={card}
                  dark={dark}
                  t={t}
                  onToggleAccept={() => toggleAccept(idx)}
                  onEdit={() => openEdit(idx)}
                />
              )
            )}
            {items.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0', color: t.textMuted, fontSize: 14 }}>
                Keine Fragen ausgewählt.
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '12px 18px 24px',
            borderTop: `1px solid ${t.border}`,
            background: t.bg,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <button
              onClick={handleSave}
              disabled={streaming || acceptedCount === 0 || saving}
              style={{
                width: '100%', height: 50, borderRadius: 14, border: 'none',
                background: (streaming || acceptedCount === 0 || saving) ? t.border : t.accent,
                color: (streaming || acceptedCount === 0 || saving) ? t.textMuted : '#fff',
                fontFamily: baseFont, fontSize: 14, fontWeight: 700,
                cursor: (streaming || acceptedCount === 0 || saving) ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: (streaming || acceptedCount === 0 || saving) || dark ? 'none' : '0 8px 24px rgba(255,153,0,0.35)',
                transition: 'background .2s',
              }}
            >
              {!(streaming || acceptedCount === 0 || saving) && <Check size={18} color="#fff" />}
              {saving
                ? 'Speichere…'
                : streaming
                  ? 'Generiere…'
                  : `${acceptedCount} ${acceptedCount === 1 ? 'Karte' : 'Karten'} in „${deckName}" speichern`}
            </button>
          </div>
        </div>
      </div>

      {/* Inline editor for drafts — uses fake cardId pattern */}
      {editorOpen && editDraft !== null && (
        <InlineDraftEditor
          dark={dark}
          initialFront={editDraft.front}
          initialBack={editDraft.back}
          initialTags={editDraft.tags}
          onSave={applyEdit}
          onClose={() => { setEditorOpen(false); setEditingIdx(null); setEditDraft(null); }}
        />
      )}
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface RowProps {
  dark: boolean;
  t: ReturnType<typeof theme>;
}

function SkeletonRow({ dark, t }: RowProps) {
  return (
    <div style={{
      borderRadius: 14, padding: 14,
      background: t.surface, border: `1px solid ${t.border}`,
      display: 'flex', flexDirection: 'column', gap: 7,
    }}>
      <div style={{
        height: 12, borderRadius: 6, width: '85%',
        background: dark ? 'rgba(148,163,184,0.12)' : '#F1F5F9',
        backgroundImage: 'linear-gradient(90deg, transparent 0, rgba(255,255,255,0.5) 50%, transparent 100%)',
        backgroundSize: '200% 100%',
        animation: 'fcshimmer 1.4s infinite',
      }} />
      <div style={{ height: 10, borderRadius: 5, background: dark ? 'rgba(148,163,184,0.08)' : '#F8FAFC', width: '60%' }} />
      <div style={{ height: 10, borderRadius: 5, background: dark ? 'rgba(148,163,184,0.08)' : '#F8FAFC', width: '70%' }} />
    </div>
  );
}

interface CardRowProps extends RowProps {
  card: GeneratedCard;
  onToggleAccept(): void;
  onEdit(): void;
}

function CardRow({ card, dark, t, onToggleAccept, onEdit }: CardRowProps) {
  const isStreaming = !card.back || card.back === '';
  return (
    <div style={{
      borderRadius: 14, padding: 14,
      background: t.surface,
      border: `1px solid ${card.accepted ? t.accent + '44' : t.border}`,
      display: 'flex', gap: 10, alignItems: 'flex-start',
      opacity: isStreaming ? 0.95 : 1,
      transition: 'all .2s',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.35, color: t.text }}>{card.front}</div>
        {card.back ? (
          <div style={{ fontSize: 12, color: t.textMuted, marginTop: 5, lineHeight: 1.5 }}>{card.back}</div>
        ) : (
          <div style={{ marginTop: 7, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 8, borderRadius: 4, background: dark ? 'rgba(148,163,184,0.16)' : '#F1F5F9', width: '90%', backgroundImage: 'linear-gradient(90deg, transparent 0, rgba(255,153,0,0.3) 50%, transparent 100%)', backgroundSize: '200% 100%', animation: 'fcshimmer 1.4s infinite' }}/>
            <div style={{ height: 8, borderRadius: 4, background: dark ? 'rgba(148,163,184,0.10)' : '#F8FAFC', width: '60%' }}/>
          </div>
        )}
        {(card.tags.length > 0 || card.copyrightWarning) && (
          <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {card.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 10, padding: '2px 7px', borderRadius: 999,
                background: t.accentSoft, color: t.accent, fontWeight: 600,
              }}>#{tag}</span>
            ))}
            {card.copyrightWarning && (
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: dark ? '#FBBF24' : '#B45309',
                background: dark ? 'rgba(251,191,36,0.12)' : '#FFFBEB',
                padding: '2px 7px', borderRadius: 999, border: `1px solid ${dark ? 'rgba(251,191,36,0.3)' : '#FCD34D'}`,
              }}>⚠️ Bitte prüfen</span>
            )}
          </div>
        )}
      </div>
      {/* Vertical action stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        {isStreaming ? (
          <div style={{ width: 28, height: 28, borderRadius: 8, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, border: `2px solid ${t.accent}`, borderTopColor: 'transparent', animation: 'fcspin 0.8s linear infinite' }}/>
          </div>
        ) : (
          <>
            <button onClick={onToggleAccept} title={card.accepted ? 'Akzeptiert – klicken zum Überspringen' : 'Übersprungen – klicken zum Akzeptieren'}
              style={{ width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer', background: t.greenSoft, color: t.green, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: card.accepted ? 1 : 0.4 }}>
              <Check size={15} color={t.green}/>
            </button>
            <button onClick={onEdit} title="Bearbeiten"
              style={{ width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer', background: t.bg2, color: t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Edit size={13} color={t.textMuted}/>
            </button>
            <button onClick={onToggleAccept} title="Überspringen"
              style={{ width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer', background: t.redSoft, color: t.red, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: !card.accepted ? 1 : 0.4 }}>
              <X size={14} color={t.red}/>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Inline draft editor ───────────────────────────────────────────────────────

interface InlineDraftEditorProps {
  dark: boolean;
  initialFront: string;
  initialBack: string;
  initialTags: string[];
  onSave(front: string, back: string, tags: string[]): void;
  onClose(): void;
}

function InlineDraftEditor({ dark, initialFront, initialBack, initialTags, onSave, onClose }: InlineDraftEditorProps) {
  const t = theme(dark);
  const [front, setFront] = useState(initialFront);
  const [back, setBack] = useState(initialBack);
  const [tags] = useState<string[]>(initialTags);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90 }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: dark ? 'rgba(2,6,15,0.6)' : 'rgba(15,23,42,0.4)',
          backdropFilter: 'blur(4px)',
          opacity: mounted ? 1 : 0, transition: 'opacity .2s',
        }}
      />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: dark ? 'rgba(15,23,42,0.97)' : '#fff',
        border: `1px solid ${t.border}`, borderBottom: 'none',
        borderRadius: '24px 24px 0 0',
        padding: '16px 18px 40px',
        fontFamily: baseFont, color: t.text,
        transform: mounted ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform .3s cubic-bezier(.2,.8,.2,1)',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.3)',
        zIndex: 91,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: t.borderStrong }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, fontFamily: baseFont, fontSize: 14, fontWeight: 500, padding: 0 }}>
            Abbrechen
          </button>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Karte bearbeiten</div>
          <button
            onClick={() => onSave(front.trim(), back.trim(), tags)}
            disabled={!front.trim() || !back.trim()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: (!front.trim() || !back.trim()) ? t.textMuted : t.accent, fontFamily: baseFont, fontSize: 14, fontWeight: 700, padding: 0 }}
          >
            Fertig
          </button>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Front</div>
          <textarea
            value={front}
            onChange={e => setFront(e.target.value)}
            style={{
              width: '100%', minHeight: 72, padding: 12, borderRadius: 12, boxSizing: 'border-box',
              background: t.surface, color: t.text, fontFamily: baseFont, fontSize: 14, fontWeight: 600, lineHeight: 1.4,
              border: `1.5px solid ${t.accent}`, outline: 'none', resize: 'vertical',
            }}
          />
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Back</div>
          <textarea
            value={back}
            onChange={e => setBack(e.target.value)}
            style={{
              width: '100%', minHeight: 88, padding: 12, borderRadius: 12, boxSizing: 'border-box',
              background: t.surface, color: t.text, fontFamily: baseFont, fontSize: 13, lineHeight: 1.5,
              border: `1px solid ${t.border}`, outline: 'none', resize: 'vertical',
            }}
          />
        </div>
      </div>
    </div>
  );
}
