'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { theme, baseFont } from '@/lib/theme';
import {
  useFlashcardStore,
  dueCardsForDeck,
  totalCardsForDeck,
} from '@aws-prep/core';
import { BottomNav } from '@/components/ui/BottomNav';
import { Flame, Chevron, Cards, Plus, Sparkle } from '@/components/icons';

interface FlashcardsScreenProps { dark?: boolean; }

// ── Swipeable deck row (used inside grouped iOS table) ─────
function SwipeableDeckRow({
  dark,
  name,
  total,
  due,
  color,
  isFirst,
  onTap,
  onDelete,
}: {
  dark: boolean;
  name: string;
  total: number;
  due: number;
  color: string;
  isFirst: boolean;
  onTap(): void;
  onDelete(): void;
}) {
  const t = theme(dark);
  const startXRef = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const DELETE_W = 80;

  function onTouchStart(e: React.TouchEvent) {
    startXRef.current = e.touches[0].clientX;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (startXRef.current === null) return;
    const dx = e.touches[0].clientX - startXRef.current;
    if (dx < 0) setOffset(Math.max(dx, -DELETE_W));
  }

  function onTouchEnd() {
    startXRef.current = null;
    setOffset(prev => (prev < -DELETE_W / 2 ? -DELETE_W : 0));
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    onDelete();
    setOffset(0);
  }

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      borderTop: isFirst ? 'none' : `0.5px solid ${t.border}`,
    }}>
      {/* Delete button revealed on swipe */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: DELETE_W, background: t.danger,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <button
          onClick={handleDelete}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontFamily: baseFont, fontSize: 13, fontWeight: 600, padding: '0 12px' }}
        >
          Delete
        </button>
      </div>

      {/* Row content */}
      <div
        onClick={() => { if (offset === 0) onTap(); else setOffset(0); }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          background: t.surface,
          padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
          transform: `translateX(${offset}px)`,
          transition: offset === 0 ? 'transform .25s' : 'none',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{
          width: 32, height: 36, borderRadius: 7, background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Cards size={16} color="#fff"/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: -0.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{total} {total === 1 ? 'card' : 'cards'}</div>
        </div>
        {due > 0 ? (
          <div style={{ padding: '3px 9px', borderRadius: 12, background: t.accentSoft, color: t.accent, fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{due}</div>
        ) : (
          <div style={{ color: t.success, fontSize: 14, fontWeight: 600 }}>✓</div>
        )}
        <Chevron size={14} color={t.textSubtle}/>
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
        background: dark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        opacity: mounted ? 1 : 0, transition: 'opacity .2s',
      }}/>
      <div style={{
        position: 'relative', width: 'calc(100% - 48px)', maxWidth: 360,
        background: t.surface, borderRadius: 18, padding: '24px 20px 20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: `0.5px solid ${t.border}`,
        transform: mounted ? 'scale(1)' : 'scale(0.92)',
        transition: 'transform .25s cubic-bezier(.2,.8,.2,1), opacity .25s',
        opacity: mounted ? 1 : 0,
        fontFamily: baseFont, color: t.text,
      }}>
        <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 16, letterSpacing: -0.3 }}>New Deck</div>
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          placeholder="Deck name..."
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 10, boxSizing: 'border-box',
            background: t.surface2, color: t.text, fontFamily: baseFont,
            fontSize: 15, fontWeight: 500, border: `0.5px solid ${t.accent}`, outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px 0', borderRadius: 10, border: `0.5px solid ${t.border}`,
            background: 'transparent', color: t.textMuted, fontFamily: baseFont, fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={handleCreate} disabled={!name.trim() || saving} style={{
            flex: 1, padding: '11px 0', borderRadius: 10, border: 'none',
            background: !name.trim() ? t.border : t.accent,
            color: !name.trim() ? t.textMuted : t.accentText,
            fontFamily: baseFont, fontSize: 14, fontWeight: 600, cursor: name.trim() ? 'pointer' : 'default',
            letterSpacing: -0.1,
          }}>
            {saving ? '...' : 'Create'}
          </button>
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
        background: dark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        opacity: mounted ? 1 : 0, transition: 'opacity .2s',
      }}/>
      <div style={{
        position: 'relative', width: 'calc(100% - 48px)', maxWidth: 340,
        background: t.surface, borderRadius: 18, padding: '24px 20px 20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: `0.5px solid ${t.border}`,
        transform: mounted ? 'scale(1)' : 'scale(0.92)',
        transition: 'transform .25s cubic-bezier(.2,.8,.2,1), opacity .25s',
        opacity: mounted ? 1 : 0,
        fontFamily: baseFont, color: t.text,
      }}>
        <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, letterSpacing: -0.3 }}>Delete deck?</div>
        <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 20, lineHeight: 1.45 }}>
          &ldquo;{deckName}&rdquo; and all its cards will be permanently deleted.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '11px 0', borderRadius: 10, border: `0.5px solid ${t.border}`,
            background: 'transparent', color: t.textMuted, fontFamily: baseFont, fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '11px 0', borderRadius: 10, border: 'none',
            background: t.danger, color: '#fff',
            fontFamily: baseFont, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            letterSpacing: -0.1,
          }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Screen ────────────────────────────────────────────
export function FlashcardsScreen({ dark = false }: FlashcardsScreenProps) {
  const t = theme(dark);
  const router = useRouter();

  const decks = useFlashcardStore(s => s.decks);
  const cards = useFlashcardStore(s => s.cards);
  const deleteDeck = useFlashcardStore(s => s.deleteDeck);
  const hydrated = useFlashcardStore(s => s.hydrated);

  const [newDeckOpen, setNewDeckOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ deckId: string; name: string } | null>(null);

  useEffect(() => {
    const store = useFlashcardStore.getState();
    store.hydrate().then(() => store.ensureMistakesDeck());
  }, []);

  const now = Date.now();
  const allDue = Object.values(decks).reduce((acc, d) => acc + dueCardsForDeck(cards, d.deckId, now).length, 0);
  const deckCount = Object.values(decks).filter(d => !d.isAuto).length;

  const mistakesDeck = decks['mistakes'];
  const mistakesTotal = mistakesDeck ? totalCardsForDeck(cards, 'mistakes') : 0;
  const mistakesDue = mistakesDeck ? dueCardsForDeck(cards, 'mistakes', now).length : 0;

  const userDecks = Object.values(decks).filter(d => !d.isAuto);
  const deckColors = [t.accent, t.danger, t.success, t.info, t.warning];

  async function handleDeleteConfirm() {
    if (!confirmDelete) return;
    await deleteDeck(confirmDelete.deckId);
    setConfirmDelete(null);
  }

  const Header = (
    <div style={{ padding: '60px 20px 14px' }}>
      <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>Review</div>
      <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.8, marginTop: 2, lineHeight: 1.1 }}>Flashcards</div>
      <div style={{ fontSize: 14, color: t.textMuted, marginTop: 6 }}>
        <span style={{ color: t.accent, fontWeight: 600 }}>{allDue}</span> cards due today
        {deckCount > 0 && <> · {deckCount} {deckCount === 1 ? 'deck' : 'decks'}</>}
      </div>
    </div>
  );

  if (!hydrated) {
    return (
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
        {Header}
        <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 76, borderRadius: 14, background: t.surface, border: `0.5px solid ${t.border}`, opacity: 0.6 }}/>
          ))}
        </div>
        <BottomNav active="learn" t={t}/>
      </div>
    );
  }

  return (
    <>
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
        {Header}

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 110px' }}>

          {/* Auto-Deck "My Mistakes" — danger semantic */}
          <div style={{
            borderRadius: 16, padding: 16,
            background: t.surface,
            border: `0.5px solid ${t.border}`,
            boxShadow: t.shadow,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 11,
                background: t.dangerSoft, color: t.danger,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Flame size={22} color={t.danger}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '2px 8px', borderRadius: 6,
                  background: t.dangerSoft, color: t.danger,
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                }}>
                  Auto-Deck
                </div>
                <div style={{ fontSize: 17, fontWeight: 600, marginTop: 5, letterSpacing: -0.3 }}>My Mistakes</div>
                <div style={{ fontSize: 13, color: t.textMuted, marginTop: 2 }}>
                  {mistakesTotal} {mistakesTotal === 1 ? 'card' : 'cards'} · from wrong answers
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
              <div style={{
                padding: '5px 10px', borderRadius: 8,
                background: mistakesDue > 0 ? t.danger : t.dangerSoft,
                color: mistakesDue > 0 ? '#fff' : t.danger,
                fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
              }}>
                {mistakesDue} due
              </div>
              <div style={{ flex: 1 }}/>
              <button
                onClick={() => router.push('/flashcards/review?deck=mistakes')}
                style={{
                  padding: '10px 18px', borderRadius: 10, border: 'none',
                  background: t.accent, color: t.accentText, fontSize: 14, fontWeight: 600,
                  fontFamily: baseFont, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4, letterSpacing: -0.1,
                }}
              >
                Review <Chevron size={14} color={t.accentText}/>
              </button>
            </div>
          </div>

          {/* AI generation row */}
          <button
            onClick={() => router.push('/quiz')}
            style={{
              marginTop: 12, width: '100%',
              padding: '14px 14px', borderRadius: 14,
              background: t.surface, border: `0.5px solid ${t.border}`,
              boxShadow: t.shadow,
              color: t.text, fontFamily: baseFont, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: t.infoSoft, color: t.info,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Sparkle size={18} color={t.info}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.1 }}>Generate from latest mistakes</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 1 }}>AI creates cards · ~10 sec</div>
            </div>
            <Chevron size={16} color={t.textMuted}/>
          </button>

          {/* User Decks section */}
          <div style={{ marginTop: 22, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.textMuted, letterSpacing: -0.1 }}>Your Decks</div>
          </div>

          {userDecks.length === 0 ? (
            <div style={{
              marginTop: 8,
              background: t.surface, borderRadius: 12,
              border: `0.5px solid ${t.border}`,
              boxShadow: t.shadow,
              textAlign: 'center', padding: '24px 0', color: t.textMuted, fontSize: 13,
            }}>
              No decks yet — tap + to create one.
            </div>
          ) : (
            <div style={{
              marginTop: 8,
              background: t.surface, borderRadius: 12,
              border: `0.5px solid ${t.border}`,
              boxShadow: t.shadow,
              overflow: 'hidden',
            }}>
              {userDecks.map((d, idx) => {
                const total = totalCardsForDeck(cards, d.deckId);
                const due = dueCardsForDeck(cards, d.deckId, now).length;
                const color = deckColors[idx % deckColors.length];
                return (
                  <SwipeableDeckRow
                    key={d.deckId}
                    dark={dark}
                    name={d.name}
                    total={total}
                    due={due}
                    color={color}
                    isFirst={idx === 0}
                    onTap={() => router.push(`/flashcards/${encodeURIComponent(d.deckId)}`)}
                    onDelete={() => setConfirmDelete({ deckId: d.deckId, name: d.name })}
                  />
                );
              })}
            </div>
          )}

          <div style={{ height: 16 }}/>
        </div>

        {/* FAB — System Blue */}
        <button
          onClick={() => setNewDeckOpen(true)}
          style={{
            position: 'absolute', right: 20, bottom: 100,
            width: 52, height: 52, borderRadius: 26, border: 'none',
            background: t.accent, color: t.accentText, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,113,227,0.40), 0 2px 6px rgba(0,0,0,0.12)',
            zIndex: 35,
          }}
        >
          <Plus size={24} color={t.accentText}/>
        </button>

        <BottomNav active="learn" t={t}/>
      </div>

      <NewDeckModal dark={dark} open={newDeckOpen} onClose={() => setNewDeckOpen(false)}/>
      <ConfirmDeleteModal
        dark={dark}
        open={!!confirmDelete}
        deckName={confirmDelete?.name ?? ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  );
}
