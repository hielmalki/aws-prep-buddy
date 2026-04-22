'use client';
import { useEffect, useState } from 'react';
import { theme, baseFont, mono } from '@/lib/theme';
import { Sparkle, Close, Clip, Send } from '@/components/icons';

interface TutorSheetProps { dark: boolean; open: boolean; onClose: () => void; }

const msgs = [
  { role: 'user', text: 'Why is C wrong? Dedicated Hosts give me cost control too, right?' },
  { role: 'ai',   text: 'Good thinking! But Dedicated Hosts are more expensive, not cheaper — you pay for the entire physical machine regardless of utilization.', code: null },
  { role: 'ai',   text: 'Rough EC2 pricing hierarchy from cheapest → most expensive:', code: {
    body: '1. Spot         (up to −90%, interruptible)\n2. Savings Plan (−72%, 1–3 years)\n3. Reserved     (−72%, 1–3 years)\n4. On-Demand    (list price)\n5. Dedicated    (most expensive)',
  }},
];

const quickChips = ['Explain simpler', 'Give an example', 'Why not C?', 'Memory trick?'];

export function TutorSheet({ dark, open, onClose }: TutorSheetProps) {
  const t = theme(dark);
  const [model, setModel] = useState<'claude' | 'gpt'>('claude');
  const [input, setInput] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) requestAnimationFrame(() => setMounted(true));
    else setMounted(false);
  }, [open]);

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 80, pointerEvents: 'auto' }}>
      {/* backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: dark ? 'rgba(2,6,15,0.55)' : 'rgba(15,23,42,0.35)',
        backdropFilter: 'blur(4px)',
        opacity: mounted ? 1 : 0, transition: 'opacity .25s',
      }}/>

      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '88%',
        background: dark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.94)',
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
        <div style={{ padding: '6px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkle size={18} color="#fff"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>AI Tutor</div>
            <div style={{ fontSize: 11, color: t.textMuted }}>Online · replies in English</div>
          </div>
          {/* model toggle */}
          <div style={{ display: 'flex', padding: 3, borderRadius: 10, background: t.bg2, border: `1px solid ${t.border}` }}>
            {(['claude', 'gpt'] as const).map(m => (
              <button key={m} onClick={() => setModel(m)} style={{
                padding: '6px 12px', border: 'none', borderRadius: 7,
                background: model === m ? t.surface : 'transparent',
                color: model === m ? t.text : t.textMuted,
                fontSize: 12, fontWeight: 600, fontFamily: baseFont, cursor: 'pointer',
                textTransform: 'capitalize',
                boxShadow: model === m ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}>{m}</button>
            ))}
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: t.bg2, color: t.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Close size={16} color={t.text}/>
          </button>
        </div>

        {/* context chip */}
        <div style={{ padding: '0 16px 10px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 10px 7px 8px', borderRadius: 10,
            background: t.accentSoft, border: `1px solid ${t.border}`,
            fontSize: 12, color: t.text, fontWeight: 500,
          }}>
            <Clip size={13} color={t.accent}/>
            <span style={{ fontWeight: 600 }}>Question 4</span>
            <span style={{ color: t.textMuted }}>·</span>
            <span style={{ color: t.textMuted }}>EC2 Instance Types</span>
          </div>
        </div>

        {/* chat */}
        <div style={{ flex: 1, overflow: 'auto', padding: '4px 16px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%', padding: '10px 13px', borderRadius: 16,
                background: m.role === 'user' ? t.accent : (dark ? 'rgba(30,41,59,0.7)' : '#fff'),
                color: m.role === 'user' ? '#fff' : t.text,
                fontSize: 13, lineHeight: 1.5,
                border: m.role === 'user' ? 'none' : `1px solid ${t.border}`,
                borderBottomRightRadius: m.role === 'user' ? 4 : 16,
                borderBottomLeftRadius: m.role === 'user' ? 16 : 4,
              }}>
                {m.text}
                {m.code && (
                  <pre style={{
                    margin: '8px 0 0', padding: '10px 12px',
                    background: dark ? '#0B1120' : '#0F172A', color: '#E2E8F0',
                    borderRadius: 10, fontFamily: mono, fontSize: 11.5,
                    lineHeight: 1.5, overflow: 'auto',
                  }}>
                    {m.code.body.split('\n').map((ln, j) => {
                      const match = ln.match(/^(\d+\.\s+)(\w[\w\s]*?)(\s+\(.*\))?$/);
                      if (match) return (
                        <div key={j}>
                          <span style={{ color: '#64748B' }}>{match[1]}</span>
                          <span style={{ color: '#FFB545' }}>{match[2]}</span>
                          <span style={{ color: '#64748B' }}>{match[3] ?? ''}</span>
                        </div>
                      );
                      return <div key={j}>{ln}</div>;
                    })}
                  </pre>
                )}
              </div>
            </div>
          ))}
          {/* typing indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: t.textMuted, fontSize: 11, padding: '2px 4px' }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 5, height: 5, borderRadius: 3, background: t.textMuted, display: 'inline-block',
                  animation: `dot 1.2s ${i * 0.15}s infinite`,
                }}/>
              ))}
            </div>
            typing…
          </div>
        </div>

        {/* quick chips */}
        <div style={{ padding: '0 16px 10px', display: 'flex', gap: 6, overflowX: 'auto' }}>
          {quickChips.map(c => (
            <button key={c} style={{
              padding: '7px 12px', borderRadius: 999,
              background: t.bg2, border: `1px solid ${t.border}`,
              color: t.text, fontSize: 12, fontWeight: 500,
              fontFamily: baseFont, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{c}</button>
          ))}
        </div>

        {/* input */}
        <div style={{ padding: '10px 16px 24px', borderTop: `1px solid ${t.border}`, display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 44, borderRadius: 12, background: t.bg2, border: `1px solid ${t.border}` }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask the tutor…"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: baseFont, fontSize: 14, color: t.text }}
            />
          </div>
          <button style={{
            width: 44, height: 44, borderRadius: 12, border: 'none',
            background: input.trim() ? t.accent : t.bg2,
            color: input.trim() ? '#fff' : t.textMuted,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .15s',
          }}>
            <Send size={18} color={input.trim() ? '#fff' : t.textMuted}/>
          </button>
        </div>
      </div>
    </div>
  );
}
