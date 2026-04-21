'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { theme, baseFont, slate700, slate200 } from '@/lib/theme';
import { AnimatedProgressRing } from '@/components/ui/ProgressRing';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Chip } from '@/components/ui/Chip';
import { BottomNav } from '@/components/ui/BottomNav';
import { TutorSheet } from './TutorSheet';
import { Flame, Target, Bolt, Sparkle, Chevron, Sun, Moon, Clock, Trophy, Quiz } from '@/components/icons';

interface HomeScreenProps { dark: boolean; onToggleDark: () => void; }

export function HomeScreen({ dark, onToggleDark }: HomeScreenProps) {
  const t = theme(dark);
  const router = useRouter();
  const [tutorOpen, setTutorOpen] = useState(false);

  return (
    <>
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
        {/* Header */}
        <div style={{ padding: '64px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>Moin, Jan 👋</div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, marginTop: 2 }}>AWS Prep Buddy</div>
          </div>
          <button onClick={onToggleDark} style={{ width: 38, height: 38, borderRadius: 12, border: `1px solid ${t.border}`, background: t.surface, color: t.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {dark ? <Sun size={18} color={t.text}/> : <Moon size={18} color={t.text}/>}
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 20px 120px' }}>

          {/* Streak + Goal card */}
          <div style={{
            background: dark ? `linear-gradient(135deg, ${slate700.replace('334155','1E293B')} 0%, #1B2A44 100%)` : '#FFFFFF',
            border: `1px solid ${t.border}`, borderRadius: 20,
            padding: 18, display: 'flex', alignItems: 'center', gap: 16,
            boxShadow: dark ? 'none' : '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.04)',
          }}>
            <AnimatedProgressRing targetPct={60} t={t}/>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 9px', borderRadius: 999, background: 'rgba(255,153,0,0.14)', color: t.accent, fontSize: 11, fontWeight: 700, letterSpacing: 0.3 }}>
                <Flame size={12} color={t.accent}/> 12 TAGE STREAK
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 8, lineHeight: 1.3 }}>Heutiges Ziel</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>Noch 4 Fragen bis zur Flamme 🔥</div>
            </div>
          </div>

          {/* Section: Weiter lernen */}
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>Weiter lernen</div>
            <div style={{ fontSize: 12, color: t.accent, fontWeight: 600 }}>Alle</div>
          </div>

          {/* Continue Exam card */}
          <button onClick={() => router.push('/quiz')} style={{ width: '100%', textAlign: 'left', border: 'none', padding: 0, background: 'transparent', cursor: 'pointer' }}>
            <div style={{ marginTop: 10, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={22} color={t.accent}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Continue — Practice Exam 3</div>
                  <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>Frage 14 von 65 · ~25 min übrig</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: t.accent, letterSpacing: -0.5 }}>21%</div>
              </div>
              <div style={{ marginTop: 12 }}><ProgressBar pct={21} t={t}/></div>
            </div>
          </button>

          {/* Weak Topic card */}
          <div style={{ marginTop: 12, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: dark ? 'rgba(248,113,113,0.12)' : '#FEE2E2', color: t.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bolt size={22} color={t.red}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>Schwaches Topic: VPC</span>
                <Chip color={t.red} bg={dark ? 'rgba(248,113,113,0.12)' : '#FEE2E2'}>47%</Chip>
              </div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>Subnetting & Route Tables</div>
            </div>
            <button style={{ padding: '8px 12px', borderRadius: 10, border: `1px solid ${t.borderStrong}`, background: t.surface2, color: t.text, fontSize: 12, fontWeight: 600, fontFamily: baseFont, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              Quiz <Chevron size={14} color={t.text}/>
            </button>
          </div>

          {/* AI Tutor card */}
          <div style={{ marginTop: 24, fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>Hilfe holen</div>
          <button onClick={() => setTutorOpen(true)} style={{ width: '100%', textAlign: 'left', border: 'none', padding: 0, background: 'transparent', cursor: 'pointer', marginTop: 10 }}>
            <div style={{
              position: 'relative', overflow: 'hidden',
              borderRadius: 20, padding: 18,
              background: dark
                ? `radial-gradient(120% 90% at 0% 0%, rgba(255,153,0,0.35) 0%, transparent 55%), linear-gradient(135deg, #1B2541 0%, #0F172A 100%)`
                : `radial-gradient(120% 90% at 0% 0%, rgba(255,153,0,0.3) 0%, transparent 55%), linear-gradient(135deg, #FFFFFF 0%, #FFF5E6 100%)`,
              border: `1px solid ${t.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(255,153,0,0.35)' }}>
                  <Sparkle size={24} color="#fff"/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>AI Tutor</div>
                  <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>Claude & GPT · erklärt, was nicht klickt</div>
                </div>
                <Chevron size={18} color={t.textMuted}/>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                {['Was ist ein NAT Gateway?', 'S3 vs EFS?', 'IAM erklärt'].map(p => (
                  <span key={p} style={{ fontSize: 11, padding: '6px 10px', borderRadius: 999, background: dark ? 'rgba(255,255,255,0.06)' : '#fff', border: `1px solid ${t.border}`, color: t.textMuted, fontWeight: 500 }}>{p}</span>
                ))}
              </div>
            </div>
          </button>

          {/* Stats row */}
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { l: 'Ø Score', v: '78%',    Icon: Trophy, c: t.accent },
              { l: 'Fragen', v: '412',     Icon: Quiz,   c: t.text },
              { l: 'Zeit',   v: '8h 22m',  Icon: Clock,  c: t.text },
            ].map(s => (
              <div key={s.l} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: '12px 12px' }}>
                <div style={{ color: s.c, opacity: 0.9 }}><s.Icon size={16} color={s.c}/></div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4, letterSpacing: -0.4 }}>{s.v}</div>
                <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <BottomNav active="home" t={t}/>
      </div>
      <TutorSheet dark={dark} open={tutorOpen} onClose={() => setTutorOpen(false)}/>
    </>
  );
}
