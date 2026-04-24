'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore, examProgress, wrongQuestionNumbersInExam } from '@aws-prep/core';
import { groupQuestionsByModule, LEARN_MODULES } from '@aws-prep/content';
import type { LearnModule } from '@aws-prep/content';
import type { Question } from '@aws-prep/content';
import { getQuestion } from '@/lib/data';
import { theme, baseFont } from '@/lib/theme';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BottomNav } from '@/components/ui/BottomNav';
import { Trophy, Check, Chevron, ChevronDown, Server, Shield, Database, DollarSign, Globe, Cloud, Layers, Bolt, Book, Settings, Target } from '@/components/icons';

interface ResultScreenProps {
  examId: number;
  total: number;
  dark?: boolean;
}

function moduleIcon(icon: LearnModule['icon'], size: number, color: string) {
  switch (icon) {
    case 'compute':   return <Server size={size} color={color} />;
    case 'security':  return <Shield size={size} color={color} />;
    case 'storage':   return <Database size={size} color={color} />;
    case 'billing':   return <DollarSign size={size} color={color} />;
    case 'globe':     return <Globe size={size} color={color} />;
    case 'cloud':     return <Cloud size={size} color={color} />;
    case 'pillars':   return <Layers size={size} color={color} />;
    case 'monitor':   return <Bolt size={size} color={color} />;
    case 'migration': return <Target size={size} color={color} />;
    case 'network':   return <Settings size={size} color={color} />;
    case 'value':     return <Book size={size} color={color} />;
    default:          return <Bolt size={size} color={color} />;
  }
}

function ModuleCard({ mod, questions, dark, onLearn }: { mod: LearnModule; questions: Question[]; dark: boolean; onLearn: () => void }) {
  const t = theme(dark);
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius: 16, background: t.surface, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
      <div style={{ padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 12, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {moduleIcon(mod.icon, 20, t.accent)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{mod.title}</div>
          <div style={{ fontSize: 11, color: t.red, fontWeight: 600, marginTop: 2 }}>{questions.length} wrong</div>
        </div>
        <button
          onClick={onLearn}
          style={{ flexShrink: 0, padding: '7px 12px', borderRadius: 10, border: 'none', background: t.accent, color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: baseFont, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          Learn <Chevron size={12} color="#fff" />
        </button>
        <button
          onClick={() => setOpen(o => !o)}
          style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, border: `1px solid ${t.border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s', display: 'flex' }}>
            <ChevronDown size={16} color={t.textMuted} />
          </div>
        </button>
      </div>
      {open && (
        <div style={{ borderTop: `1px solid ${t.border}`, padding: '8px 14px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {questions.map(q => (
            <div key={q.number} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: `1px solid ${t.border}` }} >
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, flexShrink: 0, paddingTop: 2 }}>Q{q.number}</div>
              <div style={{ fontSize: 12, lineHeight: 1.45, color: t.text, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                {q.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ResultScreen({ examId, total, dark = true }: ResultScreenProps) {
  const t = theme(dark);
  const router = useRouter();
  const answers = useProgressStore(s => s.answers);
  const hydrated = useProgressStore(s => s.hydrated);
  const hydrate = useProgressStore(s => s.hydrate);

  useEffect(() => { if (!hydrated) hydrate(); }, [hydrated, hydrate]);

  if (!hydrated) {
    return (
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: baseFont, color: t.textMuted }}>
        Loading…
      </div>
    );
  }

  const progress = examProgress(answers, examId, total);
  const wrongNums = wrongQuestionNumbersInExam(answers, examId, total);
  const wrongQuestions = wrongNums.map(n => getQuestion(examId, n)).filter((q): q is Question => !!q);
  const grouped = groupQuestionsByModule(wrongQuestions);

  const scorePct = total > 0 ? Math.round((progress.correct / total) * 100) : 0;
  const passed = scorePct >= 70;

  return (
    <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
      {/* scrollable content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '60px 20px 160px' }}>

        {/* score hero */}
        <div style={{ textAlign: 'center', padding: '24px 0 32px' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: passed ? 'rgba(74,222,128,0.14)' : 'rgba(248,113,113,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Trophy size={36} color={passed ? t.green : t.red} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Exam {examId} · Result
          </div>
          <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>
            {scorePct}<span style={{ fontSize: 24, fontWeight: 600, color: t.textMuted }}>%</span>
          </div>
          <div style={{ fontSize: 14, color: t.textMuted, marginTop: 6 }}>
            {progress.correct} of {total} correct
          </div>
          <div style={{ marginTop: 16, maxWidth: 280, margin: '16px auto 0' }}>
            <ProgressBar pct={scorePct} t={t} />
          </div>
        </div>

        {/* stat chips */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
          {[
            { label: 'Correct', value: progress.correct, color: t.green, bg: dark ? 'rgba(74,222,128,0.12)' : '#F0FDF4' },
            { label: 'Wrong', value: progress.wrong, color: t.red, bg: dark ? 'rgba(248,113,113,0.12)' : '#FEF2F2' },
            { label: 'Skipped', value: total - progress.answered, color: t.textMuted, bg: t.surface },
          ].map(({ label, value, color, bg }) => (
            <div key={label} style={{ flex: 1, borderRadius: 14, background: bg, border: `1px solid ${t.border}`, padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* wrong answers grouped by module */}
        {grouped.size > 0 && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
              Study these topics
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[...grouped.values()].map(({ module: mod, questions: qs }) => (
                <ModuleCard
                  key={mod.slug}
                  mod={mod}
                  questions={qs}
                  dark={dark}
                  onLearn={() => router.push(`/learn/${mod.slug}`)}
                />
              ))}
            </div>
          </div>
        )}

        {wrongNums.length === 0 && progress.answered === total && (
          <div style={{ textAlign: 'center', padding: '16px 0', color: t.textMuted, fontSize: 14 }}>
            <Check size={28} color={t.green} />
            <div style={{ marginTop: 8, fontWeight: 600 }}>Perfect score!</div>
          </div>
        )}
      </div>

      {/* action buttons */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 20px 24px', background: t.navBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: `1px solid ${t.border}`, zIndex: 35, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={() => router.push(`/quiz/review?exam=${examId}&i=0`)}
          disabled={wrongNums.length === 0}
          style={{
            width: '100%', height: 52, borderRadius: 14, border: 'none',
            background: wrongNums.length > 0 ? t.accent : (dark ? 'rgba(255,255,255,0.06)' : '#E2E8F0'),
            color: wrongNums.length > 0 ? '#fff' : t.textMuted,
            fontSize: 15, fontWeight: 700, fontFamily: baseFont,
            cursor: wrongNums.length > 0 ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          Review wrong answers ({wrongNums.length}) <Chevron size={18} color={wrongNums.length > 0 ? '#fff' : t.textMuted} />
        </button>
        <button
          onClick={() => router.push('/')}
          style={{
            width: '100%', height: 46, borderRadius: 14,
            border: `1px solid ${t.border}`, background: t.surface,
            color: t.text, fontSize: 14, fontWeight: 600, fontFamily: baseFont, cursor: 'pointer',
          }}
        >
          Back to home
        </button>
      </div>

      <BottomNav active="quiz" t={t} />
    </div>
  );
}
