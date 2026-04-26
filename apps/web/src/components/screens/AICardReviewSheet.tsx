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
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 18px 12px', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 11,
              background: t.accentSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Sparkle size={20} color={t.accent} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>KI-Karten-Generator</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 1 }}>
                {streaming
                  ? `Generiere ${items.length} Karten… (${totalArrived}/${items.length})`
                  : error
                    ? 'Fehler aufgetreten'
                    : `${totalArrived} Karten generiert`}
              </div>
            </div>
            <button
              onClick={() => { abortRef.current?.abort(); onClose(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, padding: 4 }}
            >
              <Close size={20} color={t.textMuted} />
            </button>
          </div>

          {/* Error state */}
          {error && (
            <div style={{ margin: '0 18px 12px', padding: '12px 14px', borderRadius: 12, background: dark ? 'rgba(248,113,113,0.12)' : '#FEF2F2', color: dark ? '#F87171' : '#DC2626', fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Card list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
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
            padding: '12px 18px 34px',
            borderTop: `1px solid ${t.border}`,
            background: dark ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.9)',
          }}>
            <button
              onClick={handleSave}
              disabled={streaming || acceptedCount === 0 || saving}
              style={{
                width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
                background: (streaming || acceptedCount === 0 || saving)
                  ? t.border
                  : `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)`,
                color: (streaming || acceptedCount === 0 || saving) ? t.textMuted : '#fff',
                fontFamily: baseFont, fontSize: 15, fontWeight: 700,
                cursor: (streaming || acceptedCount === 0 || saving) ? 'default' : 'pointer',
                transition: 'background .2s',
              }}
            >
              {saving
                ? 'Speichere…'
                : streaming
                  ? 'Generiere…'
                  : `${acceptedCount} ${acceptedCount === 1 ? 'Karte' : 'Karten'} in Deck '${deckName}' speichern`}
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
      borderRadius: 14, padding: '14px 14px',
      background: t.surface, border: `1px solid ${t.border}`,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{
        height: 14, borderRadius: 7, width: '70%',
        background: dark ? 'rgba(148,163,184,0.12)' : '#F1F5F9',
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />
      <div style={{
        height: 12, borderRadius: 6, width: '90%',
        background: dark ? 'rgba(148,163,184,0.08)' : '#F8FAFC',
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />
      <style>{`@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}`}</style>
    </div>
  );
}

interface CardRowProps extends RowProps {
  card: GeneratedCard;
  onToggleAccept(): void;
  onEdit(): void;
}

function CardRow({ card, dark, t, onToggleAccept, onEdit }: CardRowProps) {
  return (
    <div style={{
      borderRadius: 14, padding: '14px 14px',
      background: card.accepted ? t.surface : (dark ? 'rgba(15,23,42,0.4)' : '#F8FAFC'),
      border: `1px solid ${card.accepted ? t.accent + '44' : t.border}`,
      opacity: card.accepted ? 1 : 0.55,
      transition: 'all .2s',
    }}>
      {/* Front */}
      <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 5 }}>
        {card.front}
      </div>
      {/* Back */}
      <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.5, marginBottom: 8 }}>
        {card.back}
      </div>

      {/* Tags + warning row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {card.tags.map(tag => (
          <span key={tag} style={{
            fontSize: 11, fontWeight: 600, color: t.accent,
            background: t.accentSoft, padding: '3px 8px', borderRadius: 999,
          }}>
            #{tag}
          </span>
        ))}
        {card.copyrightWarning && (
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: dark ? '#FBBF24' : '#B45309',
            background: dark ? 'rgba(251,191,36,0.12)' : '#FFFBEB',
            padding: '3px 8px', borderRadius: 999, border: `1px solid ${dark ? 'rgba(251,191,36,0.3)' : '#FCD34D'}`,
          }}>
            ⚠️ Bitte prüfen
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <ActionButton
          label={card.accepted ? '✓' : '↩'}
          active={card.accepted}
          color={dark ? '#4ADE80' : '#16A34A'}
          activeBg={dark ? 'rgba(74,222,128,0.14)' : '#DCFCE7'}
          t={t}
          dark={dark}
          onClick={onToggleAccept}
          title={card.accepted ? 'Akzeptiert – klicken zum Überspringen' : 'Übersprungen – klicken zum Akzeptieren'}
        />
        <ActionButton
          label={<Edit size={13} color={t.textMuted} />}
          active={false}
          color={t.textMuted}
          activeBg={t.surface}
          t={t}
          dark={dark}
          onClick={onEdit}
          title="Bearbeiten"
        />
        <ActionButton
          label={<X size={13} color={dark ? '#F87171' : '#DC2626'} />}
          active={!card.accepted}
          color={dark ? '#F87171' : '#DC2626'}
          activeBg={dark ? 'rgba(248,113,113,0.12)' : '#FEF2F2'}
          t={t}
          dark={dark}
          onClick={card.accepted ? onToggleAccept : onToggleAccept}
          title="Überspringen"
        />
      </div>
    </div>
  );
}

interface ActionButtonProps {
  label: React.ReactNode;
  active: boolean;
  color: string;
  activeBg: string;
  t: ReturnType<typeof theme>;
  dark: boolean;
  onClick(): void;
  title?: string;
}

function ActionButton({ label, active, color, activeBg, t, onClick, title }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 32, height: 28, borderRadius: 8,
        border: `1px solid ${active ? color + '44' : t.border}`,
        background: active ? activeBg : 'transparent',
        color: active ? color : t.textMuted,
        cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: baseFont,
        transition: 'all .15s',
      }}
    >
      {label}
    </button>
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
