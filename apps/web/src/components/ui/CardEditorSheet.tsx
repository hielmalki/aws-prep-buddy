'use client';
import { useEffect, useState } from 'react';
import { theme, baseFont } from '@/lib/theme';
import { useFlashcardStore } from '@aws-prep/core';
import { X } from '@/components/icons';

interface CardEditorSheetProps {
  dark: boolean;
  open: boolean;
  onClose: () => void;
  deckId: string;
  /** When provided, edit mode instead of create mode */
  cardId?: string;
}

export function CardEditorSheet({ dark, open, onClose, deckId, cardId }: CardEditorSheetProps) {
  const t = theme(dark);
  const cards = useFlashcardStore(s => s.cards);
  const addCard = useFlashcardStore(s => s.addCard);
  const updateCard = useFlashcardStore(s => s.updateCard);

  const existing = cardId ? cards[cardId] : undefined;

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<'front' | 'back'>('front');

  useEffect(() => {
    if (open) {
      setFront(existing?.front ?? '');
      setBack(existing?.back ?? '');
      setTags(existing?.tags ?? []);
      setTagInput('');
      setTab('front');
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [open, existing]);

  if (!open) return null;

  function addTag(raw: string) {
    const cleaned = raw.trim().replace(/^#/, '');
    if (cleaned && !tags.includes(cleaned)) setTags(t => [...t, cleaned]);
    setTagInput('');
  }

  async function handleSave() {
    if (!front.trim() || !back.trim()) return;
    setSaving(true);
    try {
      if (cardId) {
        await updateCard(cardId, { front: front.trim(), back: back.trim(), tags });
      } else {
        await addCard({ deckId, front: front.trim(), back: back.trim(), tags });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const blue = dark ? '#60A5FA' : '#2563EB';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 80 }}>
      {/* backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: dark ? 'rgba(2,6,15,0.55)' : 'rgba(15,23,42,0.35)',
        backdropFilter: 'blur(4px)',
        opacity: mounted ? 1 : 0, transition: 'opacity .25s',
      }}/>

      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        maxHeight: '92%',
        background: dark ? 'rgba(15,23,42,0.96)' : 'rgba(255,255,255,0.98)',
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
        {/* grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: t.borderStrong }}/>
        </div>

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 18px 14px' }}>
          <button onClick={onClose} style={{ width: 60, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: t.textMuted, fontSize: 14, fontWeight: 500, fontFamily: baseFont, padding: 0 }}>
            Abbrechen
          </button>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{cardId ? 'Karte bearbeiten' : 'Neue Karte'}</div>
          <button
            onClick={handleSave}
            disabled={!front.trim() || !back.trim() || saving}
            style={{ width: 60, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right', color: (!front.trim() || !back.trim()) ? t.textSubtle : t.accent, fontSize: 14, fontWeight: 700, fontFamily: baseFont, padding: 0 }}
          >
            {saving ? '...' : 'Speichern'}
          </button>
        </div>

        {/* Front / Back tab toggle */}
        <div style={{ padding: '0 18px 14px' }}>
          <div style={{ display: 'inline-flex', padding: 3, borderRadius: 10, background: dark ? '#1E293B' : '#F1F5F9', border: `1px solid ${t.border}` }}>
            {(['front', 'back'] as const).map((s) => {
              const on = tab === s;
              return (
                <button key={s} onClick={() => setTab(s)} style={{
                  padding: '6px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700, fontFamily: baseFont,
                  background: on ? t.surface : 'transparent',
                  color: on ? t.text : t.textMuted,
                  boxShadow: on ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  transition: 'background .15s',
                }}>
                  {s === 'front' ? 'Front' : 'Back'}
                </button>
              );
            })}
          </div>
        </div>

        {/* body */}
        <div style={{ padding: '0 18px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 32 }}>
          {/* Front */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Front</div>
            <textarea
              value={front}
              onChange={e => setFront(e.target.value)}
              placeholder="Frage oder Begriff..."
              style={{
                width: '100%', minHeight: 92, padding: 14, borderRadius: 14, boxSizing: 'border-box',
                background: t.surface, color: t.text, fontFamily: baseFont, fontSize: 15, fontWeight: 600, lineHeight: 1.45,
                border: tab === 'front' ? `1.5px solid ${t.accent}` : `1px solid ${t.border}`,
                outline: 'none', resize: 'vertical',
              }}
            />
          </div>

          {/* Back */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Back</div>
            <textarea
              value={back}
              onChange={e => setBack(e.target.value)}
              placeholder="Antwort oder Erklärung..."
              style={{
                width: '100%', minHeight: 110, padding: 14, borderRadius: 14, boxSizing: 'border-box',
                background: t.surface, color: t.text, fontFamily: baseFont, fontSize: 14, lineHeight: 1.55,
                border: tab === 'back' ? `1.5px solid ${t.accent}` : `1px solid ${t.border}`,
                outline: 'none', resize: 'vertical',
              }}
            />
          </div>

          {/* Tags */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Tags</div>
            <div style={{
              padding: '8px 10px', borderRadius: 14,
              background: t.surface, border: `1px solid ${t.border}`,
              display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', minHeight: 50,
            }}>
              {tags.map((tag) => (
                <span key={tag} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '5px 4px 5px 9px', borderRadius: 999,
                  background: t.accentSoft, color: t.accent,
                  fontSize: 12, fontWeight: 600,
                }}>
                  #{tag}
                  <button onClick={() => setTags(ts => ts.filter(t2 => t2 !== tag))} style={{
                    width: 16, height: 16, borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,153,0,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                  }}>
                    <X size={10} color={t.accent}/>
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); } }}
                onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
                placeholder="Tag hinzufügen"
                style={{
                  border: `1px dashed ${t.borderStrong}`, borderRadius: 999, padding: '5px 9px',
                  background: 'transparent', color: t.textMuted, fontFamily: baseFont,
                  fontSize: 12, fontWeight: 600, outline: 'none', minWidth: 110,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
