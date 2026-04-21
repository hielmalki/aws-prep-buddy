'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { theme, baseFont, mono, slate700, slate200 } from '@/lib/theme';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Chip } from '@/components/ui/Chip';
import { BottomNav } from '@/components/ui/BottomNav';
import { TutorSheet } from './TutorSheet';
import { Close, Sparkle, Chevron, ChevronDown, Check, X } from '@/components/icons';

interface QuizScreenProps { dark: boolean; }

const options = [
  { k: 'A', text: 'Reserved Instances mit 3-Jahres-Commitment', sub: 'Langzeit-Rabatt, aber unflexibel' },
  { k: 'B', text: 'Spot Instances für fehlertolerante Batch-Jobs', sub: 'Bis zu 90% günstiger, können unterbrochen werden' },
  { k: 'C', text: 'Dedicated Hosts mit On-Demand pricing', sub: 'Volle Kontrolle über physische Hardware' },
  { k: 'D', text: 'Savings Plans auf EC2-Familie', sub: 'Flexible Instance-Typen, fester Commit' },
];
const correct = 'B';

export function QuizScreen({ dark }: QuizScreenProps) {
  const t = theme(dark);
  const router = useRouter();
  const [picked, setPicked] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [expOpen, setExpOpen] = useState(true);
  const [tutorOpen, setTutorOpen] = useState(false);

  const submit = () => { if (picked) setSubmitted(true); };

  return (
    <>
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
        {/* top bar */}
        <div style={{ padding: '60px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/')} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Close size={18} color={t.text}/>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: t.textMuted, marginBottom: 6 }}>
              <span>Frage 4 von 20</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>12:04</span>
            </div>
            <ProgressBar pct={(4 / 20) * 100} t={t}/>
          </div>
        </div>

        {/* content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '22px 20px 200px' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <Chip color={t.accent} bg={t.accentSoft}>Domain 4 · Billing</Chip>
            <Chip color={t.textMuted} bg={dark ? 'rgba(255,255,255,0.04)' : '#F1F5F9'} border={t.border}>Medium</Chip>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.3, margin: 0, color: t.text }}>
            Ein Unternehmen hat einen verteilten Batch-Workload, der Unterbrechungen toleriert. Was ist die{' '}
            <span style={{ color: t.accent }}>kostengünstigste</span> Option?
          </h2>

          {/* options */}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {options.map(opt => {
              const isPicked = picked === opt.k;
              const isCorrect = submitted && opt.k === correct;
              const isWrongPick = submitted && isPicked && opt.k !== correct;
              let border = t.border, bg = t.surface, badgeBg = t.bg2, badgeColor = t.text;
              if (!submitted && isPicked) { border = t.accent; bg = t.accentSoft; badgeBg = t.accent; badgeColor = '#fff'; }
              if (isCorrect) { border = t.green; bg = dark ? 'rgba(74,222,128,0.1)' : '#F0FDF4'; badgeBg = t.green; badgeColor = '#fff'; }
              if (isWrongPick) { border = t.red; bg = dark ? 'rgba(248,113,113,0.1)' : '#FEF2F2'; badgeBg = t.red; badgeColor = '#fff'; }

              return (
                <button key={opt.k}
                  disabled={submitted}
                  onClick={() => setPicked(opt.k)}
                  style={{
                    textAlign: 'left', padding: 14, borderRadius: 14,
                    border: `1.5px solid ${border}`, background: bg, color: t.text,
                    cursor: submitted ? 'default' : 'pointer', fontFamily: baseFont,
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    transition: 'all .15s ease',
                    transform: isPicked && !submitted ? 'scale(0.995)' : 'scale(1)',
                  }}>
                  <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 10, background: badgeBg, color: badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, letterSpacing: -0.2 }}>
                    {isCorrect ? <Check size={18} color="#fff"/> : isWrongPick ? <X size={18} color="#fff"/> : opt.k}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35 }}>{opt.text}</div>
                    <div style={{ fontSize: 12, color: t.textMuted, marginTop: 3, lineHeight: 1.4 }}>{opt.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* explanation panel */}
          {submitted && (
            <div style={{ marginTop: 16, borderRadius: 16, background: t.surface, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
              <button onClick={() => setExpOpen(!expOpen)} style={{ width: '100%', padding: 14, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: t.text, fontFamily: baseFont }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkle size={16} color={t.accent}/>
                </div>
                <div style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 700 }}>Erklärung</div>
                <div style={{ transform: expOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform .2s' }}>
                  <ChevronDown size={18} color={t.textMuted}/>
                </div>
              </button>
              {expOpen && (
                <div style={{ padding: '0 14px 16px', fontSize: 13, color: t.textMuted, lineHeight: 1.55 }}>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: t.text }}>Spot Instances</strong> sind ideal für unterbrechbare Workloads: AWS vergibt ungenutzte EC2-Kapazität mit bis zu{' '}
                    <strong style={{ color: t.accent }}>90% Rabatt</strong>. Können mit 2-Minuten-Warnung zurückgezogen werden — kein Problem für Batch.
                  </p>
                  <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 8, background: t.bg2, border: `1px solid ${t.border}`, fontFamily: mono, fontSize: 12, color: t.text }}>
                    <div style={{ color: t.accent, fontWeight: 700 }}>// merke</div>
                    <div>Spot = günstig + unterbrechbar</div>
                    <div>Reserved = Commit (1–3 J.)</div>
                    <div>Savings Plan = flexibel, fix $</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* floating AI button */}
        <button onClick={() => setTutorOpen(true)} style={{
          position: 'absolute', left: 20, right: 20, bottom: submitted ? 88 : 92,
          height: 52, borderRadius: 16,
          border: `1px solid ${t.border}`,
          background: dark ? 'rgba(30,41,59,0.75)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          color: t.text, fontFamily: baseFont, fontSize: 14, fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)', zIndex: 30,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)` }}>
            <Sparkle size={16} color="#fff"/>
          </span>
          Ask AI about this question
        </button>

        {/* primary action */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 20px 24px', background: t.navBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: `1px solid ${t.border}`, zIndex: 35 }}>
          {!submitted ? (
            <button onClick={submit} disabled={!picked} style={{
              width: '100%', height: 52, borderRadius: 14, border: 'none',
              background: picked ? t.accent : (dark ? slate700 : slate200),
              color: picked ? '#fff' : t.textMuted, fontSize: 15, fontWeight: 700,
              fontFamily: baseFont, cursor: picked ? 'pointer' : 'not-allowed',
              letterSpacing: 0.1, transition: 'all .2s',
            }}>Antwort prüfen</button>
          ) : (
            <button style={{ width: '100%', height: 52, borderRadius: 14, border: 'none', background: t.text, color: t.bg, fontSize: 15, fontWeight: 700, fontFamily: baseFont, cursor: 'pointer', letterSpacing: 0.1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              Nächste Frage <Chevron size={18} color={t.bg}/>
            </button>
          )}
        </div>
      </div>
      <TutorSheet dark={dark} open={tutorOpen} onClose={() => setTutorOpen(false)}/>
    </>
  );
}
