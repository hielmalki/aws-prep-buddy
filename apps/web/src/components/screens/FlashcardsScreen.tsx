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
import { Flame, Chevron, Cards, Plus } from '@/components/icons';

interface FlashcardsScreenProps { dark?: boolean; }

// ── Swipeable deck row ─────────────────────────────────────
function SwipeableDeckRow({
  dark,
  deckId,
  name,
  total,
  due,
  color,
  onTap,
  onDelete,
}: {
  dark: boolean;
  deckId: string;
  name: string;
  total: number;
  due: number;
  color: string;
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
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16 }}>
      {/* Delete button revealed on swipe */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: DELETE_W, background: '#EF4444',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '0 16px 16px 0',
      }}>
        <button
          onClick={handleDelete}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontFamily: baseFont, fontSize: 13, fontWeight: 700, padding: '0 12px' }}
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
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: 16, padding: 14,
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: dark ? 'none' : '0 1px 2px rgba(15,23,42,0.04)',
          transform: `translateX(${offset}px)`,
          transition: offset === 0 ? 'transform .25s' : 'none',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 4, left: -2, width: 30, height: 36, borderRadius: 7, background: dark ? 'rgba(148,163,184,0.18)' : '#F1F5F9', transform: 'rotate(-8deg)' }}/>
          <div style={{ position: 'absolute', top: 2, left: 6, width: 32, height: 38, borderRadius: 8, background: color, opacity: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <Cards size={18} color="#fff"/>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
          <div style={{ fontSize: 11, color: t.textMuted, marginTop: 3 }}>{total} {total === 1 ? 'card' : 'cards'}</div>
        </div>
        {due > 0 ? (
          <div style={{ padding: '4px 9px', borderRadius: 999, background: t.accentSoft, color: t.accent, fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{due} due</div>
        ) : (
          <div style={{ padding: '4px 9px', borderRadius: 999, background: t.greenSoft, color: t.green, fontSize: 11, fontWeight: 700 }}>✓ up to date</div>
        )}
        <Chevron size={15} color={t.textMuted}/>
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
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>New Deck</div>
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          placeholder="Deck name..."
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
          }}>Cancel</button>
          <button onClick={handleCreate} disabled={!name.trim() || saving} style={{
            flex: 1, padding: '11px 0', borderRadius: 12, border: 'none',
            background: !name.trim() ? t.border : `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)`,
            color: !name.trim() ? t.textMuted : '#fff',
            fontFamily: baseFont, fontSize: 14, fontWeight: 700, cursor: name.trim() ? 'pointer' : 'default',
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
            background: '#EF4444', color: '#fff',
            fontFamily: baseFont, fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>Delete</button>
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
  const deckColors = ['#FF9900', '#60A5FA', '#4ADE80', '#A78BFA', '#F472B6', '#FB923C', '#34D399'];

  async function handleDeleteConfirm() {
    if (!confirmDelete) return;
    await deleteDeck(confirmDelete.deckId);
    setConfirmDelete(null);
  }

  if (!hydrated) {
    return (
      <div style={{ background: t.bgGrad, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
        <div style={{ padding: '60px 20px 14px' }}>
          <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>Review</div>
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
      <div style={{ background: t.bgGrad, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
        {/* Header */}
        <div style={{ padding: '60px 20px 14px' }}>
          <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>Review</div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6, marginTop: 2 }}>Flashcards</div>
          <div style={{ fontSize: 13, color: t.textMuted, marginTop: 4 }}>
            <span style={{ color: t.accent, fontWeight: 600 }}>{allDue}</span> cards due today
            {deckCount > 0 && <> · {deckCount} {deckCount === 1 ? 'deck' : 'decks'}</>}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 110px' }}>

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
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 5, letterSpacing: -0.2 }}>My Mistakes</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
                  {mistakesTotal} {mistakesTotal === 1 ? 'card' : 'cards'} · from wrong answers
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
              {mistakesDue > 0 && (
                <div style={{ padding: '5px 10px', borderRadius: 999, background: t.accent, color: '#fff', fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {mistakesDue} due
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

          {/* User Decks section */}
          <div style={{ marginTop: 22, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>Your Decks</div>
          </div>

          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {userDecks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: t.textMuted, fontSize: 13 }}>
                No decks yet — tap + to create one.
              </div>
            )}
            {userDecks.map((d, idx) => {
              const total = totalCardsForDeck(cards, d.deckId);
              const due = dueCardsForDeck(cards, d.deckId, now).length;
              const color = deckColors[idx % deckColors.length];
              return (
                <SwipeableDeckRow
                  key={d.deckId}
                  dark={dark}
                  deckId={d.deckId}
                  name={d.name}
                  total={total}
                  due={due}
                  color={color}
                  onTap={() => router.push(`/flashcards/${encodeURIComponent(d.deckId)}`)}
                  onDelete={() => setConfirmDelete({ deckId: d.deckId, name: d.name })}
                />
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
