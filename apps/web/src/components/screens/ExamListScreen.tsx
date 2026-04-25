'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore, examProgress, nextUnansweredInExam } from '@aws-prep/core';
import { getExamLength, EXAM_COUNT } from '@/lib/data';
import { theme, baseFont } from '@/lib/theme';
import { BottomNav } from '@/components/ui/BottomNav';
import { Quiz, Check } from '@/components/icons';

interface ExamListScreenProps { dark?: boolean; }

export function ExamListScreen({ dark = true }: ExamListScreenProps) {
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

  return (
    <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
      <div style={{ padding: '64px 20px 12px' }}>
        <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>Practice Exams</div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, marginTop: 2 }}>Quiz</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 120px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: EXAM_COUNT }, (_, i) => i + 1).map(examId => {
          const total = getExamLength(examId);
          const progress = examProgress(answers, examId, total);
          const next = nextUnansweredInExam(answers, examId, total) ?? 1;
          const scorePct = total > 0 ? Math.round((progress.correct / total) * 100) : 0;

          let rightEl: React.ReactNode;
          if (progress.answered === 0) {
            rightEl = <span style={{ fontSize: 14, color: t.textMuted }}>—</span>;
          } else if (progress.complete) {
            rightEl = (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Check size={14} color={t.accent} />
                <span style={{ fontSize: 14, fontWeight: 700, color: t.accent }}>{scorePct}%</span>
              </div>
            );
          } else {
            rightEl = <span style={{ fontSize: 12, color: t.textMuted }}>{progress.answered}/{total}</span>;
          }

          return (
            <button
              key={examId}
              onClick={() => router.push(`/quiz?exam=${examId}&q=${next}`)}
              style={{
                textAlign: 'left', padding: '14px 16px', borderRadius: 16,
                background: t.surface, border: `1px solid ${t.border}`,
                cursor: 'pointer', fontFamily: baseFont, color: t.text,
                display: 'flex', alignItems: 'center', gap: 14,
              }}
            >
              <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 12, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Quiz size={22} color={t.accent} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2 }}>
                  EXAM {examId}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>Practice Exam {examId}</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginTop: 3 }}>{total} questions</div>
              </div>
              <div style={{ flexShrink: 0 }}>
                {rightEl}
              </div>
            </button>
          );
        })}
      </div>

      <BottomNav active="quiz" t={t} />
    </div>
  );
}
