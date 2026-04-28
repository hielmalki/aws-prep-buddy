'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { theme, baseFont } from '@/lib/theme';
import { useFlashcardStore } from '@aws-prep/core';
import { BottomNav } from '@/components/ui/BottomNav';
import { CardEditorSheet } from '@/components/ui/CardEditorSheet';
import { Chevron, Plus, Edit } from '@/components/icons';

interface DeckDetailScreenProps {
  deckId: string;
  dark?: boolean;
}

// ── Rename Deck Modal ──────────────────────────────────────
function RenameDeckModal({ dark, open, currentName, onSave, onClose }: {
  dark: boolean; open: boolean; currentName: string;
  onSave(name: string): void; onClose(): void;
}) {
  const t = theme(dark);
  const [name, setName] = useState(currentName);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) { setName(currentName); requestAnimationFrame(() => setMounted(true)); }
    else setMounted(false);
  }, [open, currentName]);

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Rename Deck</div>
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && name.trim()) onSave(name.trim()); }}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 12, boxSizing: 'border-box',
            background: t.surface2, color: t.text, fontFamily: baseFont,
            fontSize: 15, fontWeight: 600, border: `1.5px solid ${t.accent}`, outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px 0', borderRadius: 12, border: `1px solid ${t.border}`,
            background: 'transparent', color: t.textMuted, fontFamily: baseFont, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={() => name.trim() && onSave(name.trim())} disabled={!name.trim()} style={{
            flex: 1, padding: '11px 0', borderRadius: 12, border: 'none',
            background: name.trim() ? t.accent : t.border,
            color: name.trim() ? t.accentText : t.textMuted,
            fontFamily: baseFont, fontSize: 14, fontWeight: 700, cursor: name.trim() ? 'pointer' : 'default',
          }}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ── Confirm Delete Modal ───────────────────────────────────
function ConfirmDeleteModal({ dark, open, deckName, onConfirm, onCancel }: {
  dark: boolean; open: boolean; deckName: string; onConfirm(): void; onCancel(): void;
}) {
  const t = theme(dark);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) requestAnimationFrame(() => setMounted(true));
    else setMounted(false);
  }, [open]);

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onCancel} style={{
        position: 'absolute', inset: 0,
        background: dark ? 'rgba(2,6,15,0.6)' : 'rgba(15,23,42,0.4)',
        backdropFilter: 'blur(4px)',
        opacity: mounted ? 1 : 0, transition: 'opacity .2s',
      }}/>
      <div style={{
        position: 'relative', width: 'calc(100% - 48px)', maxWidth: 340,
        background: t.surface, borderRadius: 20, padding: '24px 20px 20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        transform: mounted ? 'scale(1)' : 'scale(0.92)',
        transition: 'transform .25s cubic-bezier(.2,.8,.2,1), opacity .25s',
        opacity: mounted ? 1 : 0,
        fontFamily: baseFont, color: t.text,
      }}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Delete deck?</div>
        <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 20 }}>
          &ldquo;{deckName}&rdquo; and all its cards will be permanently deleted.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '11px 0', borderRadius: 12, border: `1px solid ${t.border}`,
            background: 'transparent', color: t.textMuted, fontFamily: baseFont, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '11px 0', borderRadius: 12, border: 'none',
            background: t.danger, color: '#fff',
            fontFamily: baseFont, fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Screen ────────────────────────────────────────────
export function DeckDetailScreen({ deckId, dark = false }: DeckDetailScreenProps) {
  const t = theme(dark);
  const router = useRouter();

  const decks = useFlashcardStore(s => s.decks);
  const cards = useFlashcardStore(s => s.cards);
  const hydrated = useFlashcardStore(s => s.hydrated);
  const deleteDeck = useFlashcardStore(s => s.deleteDeck);
  const updateDeck = useFlashcardStore(s => s.updateDeck);

  const [renameOpen, setRenameOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const store = useFlashcardStore.getState();
    if (!store.hydrated) store.hydrate();
  }, []);

  if (!hydrated) {
    return (
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: baseFont, color: t.textMuted }}>
        Loading…
      </div>
    );
  }

  const deck = decks[deckId];
  if (!deck) {
    return (
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: baseFont, color: t.textMuted }}>
        Deck not found.
      </div>
    );
  }

  const deckCards = Object.values(cards).filter(c => c.deckId === deckId);
  const now = Date.now();
  const dueCount = deckCards.filter(c => c.dueAt <= now).length;

  async function handleDelete() {
    await deleteDeck(deckId);
    router.push('/flashcards');
  }

  async function handleRename(name: string) {
    await updateDeck(deckId, { name });
    setRenameOpen(false);
  }

  function openNewCard() {
    setEditingCardId(undefined);
    setEditorOpen(true);
  }

  function openEditCard(cardId: string) {
    setEditingCardId(cardId);
    setEditorOpen(true);
  }

  return (
    <>
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
        {/* Header */}
        <div style={{ padding: '60px 20px 14px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <button
            onClick={() => router.back()}
            style={{ marginTop: 4, background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <div style={{ transform: 'rotate(180deg)', display: 'flex' }}>
              <Chevron size={20} color={t.textMuted} />
            </div>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2 }}>{deck.name}</div>
            <div style={{ fontSize: 13, color: t.textMuted, marginTop: 4 }}>
              {deckCards.length} {deckCards.length === 1 ? 'card' : 'cards'}
              {dueCount > 0 && <> · <span style={{ color: t.accent, fontWeight: 600 }}>{dueCount} due</span></>}
            </div>
          </div>
          <button
            onClick={() => setRenameOpen(true)}
            style={{ marginTop: 4, width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Edit size={16} color={t.textMuted} />
          </button>
        </div>

        {/* Review button */}
        {deckCards.length > 0 && (
          <div style={{ padding: '0 20px 14px' }}>
            <button
              onClick={() => router.push(`/flashcards/review?deck=${encodeURIComponent(deckId)}`)}
              style={{
                width: '100%', height: 46, borderRadius: 14, border: 'none',
                background: t.accent,
                color: t.accentText, fontSize: 14, fontWeight: 700, fontFamily: baseFont,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: '0 6px 20px rgba(0,113,227,0.35)',
              }}
            >
              Start Review <Chevron size={16} color="#fff" />
            </button>
          </div>
        )}

        {/* Card list */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 130px' }}>
          {deckCards.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: t.textMuted, fontSize: 14 }}>
              No cards yet — tap + to add one.
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {deckCards.map(card => (
              <button
                key={card.cardId}
                onClick={() => openEditCard(card.cardId)}
                style={{
                  width: '100%', textAlign: 'left', background: t.surface,
                  border: `1px solid ${t.border}`, borderRadius: 14, padding: '12px 14px',
                  cursor: 'pointer', fontFamily: baseFont, color: t.text,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35, marginBottom: 4 }}>{card.front}</div>
                <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                  {card.back}
                </div>
                {card.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                    {card.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 999, background: t.accentSoft, color: t.accent, fontWeight: 600 }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* FAB — Add card */}
        <button
          onClick={openNewCard}
          style={{
            position: 'absolute', right: 20, bottom: 100,
            width: 56, height: 56, borderRadius: 18, border: 'none',
            background: t.accent,
            color: t.accentText, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 28px rgba(0,113,227,0.45), 0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 35,
          }}
        >
          <Plus size={26} color="#fff" />
        </button>

        {/* Delete deck button (not for auto-decks) */}
        {!deck.isAuto && (
          <div style={{ position: 'absolute', left: 20, bottom: 100, zIndex: 35 }}>
            <button
              onClick={() => setConfirmDeleteOpen(true)}
              style={{
                height: 44, padding: '0 16px', borderRadius: 14, border: `0.5px solid ${t.dangerSoft}`,
                background: t.dangerSoft,
                color: t.danger, fontSize: 13, fontWeight: 700, fontFamily: baseFont, cursor: 'pointer',
              }}
            >
              Delete Deck
            </button>
          </div>
        )}

        <BottomNav active="learn" t={t} />
      </div>

      <CardEditorSheet
        dark={dark}
        open={editorOpen}
        onClose={() => { setEditorOpen(false); setEditingCardId(undefined); }}
        deckId={deckId}
        cardId={editingCardId}
      />

      <RenameDeckModal
        dark={dark}
        open={renameOpen}
        currentName={deck.name}
        onSave={handleRename}
        onClose={() => setRenameOpen(false)}
      />

      <ConfirmDeleteModal
        dark={dark}
        open={confirmDeleteOpen}
        deckName={deck.name}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </>
  );
}
