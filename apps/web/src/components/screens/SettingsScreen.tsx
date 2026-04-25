'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { theme, baseFont } from '@/lib/theme';
import { useSettingsStore, useProgressStore, examProgress } from '@aws-prep/core';
import { useStreakStore } from '@aws-prep/core';
import { getExamLength, EXAM_COUNT } from '@/lib/data';
import { BottomNav } from '@/components/ui/BottomNav';
import { Sun, Moon, Trophy, Quiz, Flame, Chevron } from '@/components/icons';

interface SettingsScreenProps { dark: boolean; onToggleDark: () => void; }

const GOAL_PRESETS = [5, 10, 15, 20];

export function SettingsScreen({ dark, onToggleDark }: SettingsScreenProps) {
  const t = theme(dark);
  const router = useRouter();

  const dailyGoal = useSettingsStore(s => s.dailyGoal);
  const setDailyGoal = useSettingsStore(s => s.setDailyGoal);

  const answers = useProgressStore(s => s.answers);
  const stats = useProgressStore(s => s.stats);
  const hydrated = useProgressStore(s => s.hydrated);
  const hydrate = useProgressStore(s => s.hydrate);

  const currentStreak = useStreakStore(s => s.currentStreak);
  const streakHydrated = useStreakStore(s => s.hydrated);
  const hydrateStreak = useStreakStore(s => s.hydrate);

  useEffect(() => {
    if (!hydrated) hydrate();
    if (!streakHydrated) hydrateStreak();
  }, [hydrated, hydrate, streakHydrated, hydrateStreak]);

  // Build exam history list (only exams with answered > 0)
  const examHistoryItems = [];
  if (hydrated) {
    for (let i = 1; i <= EXAM_COUNT; i++) {
      const total = getExamLength(i);
      if (total === 0) continue;
      const progress = examProgress(answers, i, total);
      if (progress.answered === 0) continue;
      const score = Math.round((progress.correct / total) * 100);
      const examAnswers = Object.values(answers).filter(r => r.examId === i);
      const lastDate = examAnswers.length > 0
        ? new Date(Math.max(...examAnswers.map(r => r.updatedAt))).toLocaleDateString('de-DE')
        : '';
      examHistoryItems.push({ i, total, progress, score, lastDate });
    }
  }

  const isLoading = !hydrated || !streakHydrated;

  return (
    <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text }}>
      {/* Header — unchanged */}
      <div style={{ padding: '64px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>Einstellungen</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, marginTop: 2 }}>Du</div>
        </div>
        <button onClick={onToggleDark} style={{ width: 38, height: 38, borderRadius: 12, border: `1px solid ${t.border}`, background: t.surface, color: t.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {dark ? <Sun size={18} color={t.text}/> : <Moon size={18} color={t.text}/>}
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 20px 120px' }}>

        {/* Stats Row */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '16px 0', color: t.textMuted, fontSize: 13 }}>
            Lade Statistiken…
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
            {/* Avg Score */}
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 14, textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                <Trophy size={18} color={t.accent} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>
                {stats.totalAnswered === 0 ? '—' : stats.avgScore + '%'}
              </div>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4 }}>
                Avg Score
              </div>
            </div>

            {/* Answered */}
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 14, textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                <Quiz size={18} color={t.accent} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>
                {stats.totalAnswered}
              </div>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4 }}>
                Answered
              </div>
            </div>

            {/* Streak */}
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 14, textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                <Flame size={18} color={t.accent} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>
                {currentStreak}d
              </div>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4 }}>
                Streak
              </div>
            </div>
          </div>
        )}

        {/* Exam History Section */}
        <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
          Exam History
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '16px 0', color: t.textMuted, fontSize: 13 }}>
            Lade Verlauf…
          </div>
        ) : examHistoryItems.length === 0 ? (
          <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: 20, textAlign: 'center', color: t.textMuted, fontSize: 13, marginBottom: 24 }}>
            Noch keine Exams gestartet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {examHistoryItems.map(({ i, total, progress, score, lastDate }) => (
              <button
                key={i}
                onClick={() => router.push(`/quiz/result?exam=${i}`)}
                style={{
                  textAlign: 'left', padding: '14px 16px', borderRadius: 16,
                  background: t.surface, border: `1px solid ${t.border}`,
                  cursor: 'pointer', fontFamily: baseFont, color: t.text,
                  display: 'flex', alignItems: 'center', gap: 14,
                }}
              >
                <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 12, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trophy size={20} color={t.accent} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>Practice Exam {i}</div>
                  <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
                    {progress.correct}/{total} correct · {score}%
                  </div>
                  {lastDate ? (
                    <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1 }}>
                      Last: {lastDate}
                    </div>
                  ) : null}
                </div>
                <div style={{ flexShrink: 0, fontWeight: 700, fontSize: 15, color: score >= 70 ? '#22c55e' : '#ef4444' }}>
                  {score}%
                </div>
                <div style={{ flexShrink: 0, opacity: 0.4 }}>
                  <Chevron size={16} color={t.text} />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Tagesziel — unchanged */}
        <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
          Tagesziel
        </div>
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: 16 }}>
          <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 14 }}>
            Wie viele Fragen möchtest du täglich beantworten?
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {GOAL_PRESETS.map(n => {
              const active = dailyGoal === n;
              return (
                <button
                  key={n}
                  onClick={() => setDailyGoal(n)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 12, border: `1.5px solid ${active ? t.accent : t.border}`,
                    background: active ? t.accentSoft : t.surface,
                    color: active ? t.accent : t.text,
                    fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: baseFont,
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: t.textMuted }}>
            Aktuell: <span style={{ color: t.accent, fontWeight: 700 }}>{dailyGoal} Fragen</span> pro Tag
          </div>
        </div>
      </div>

      <BottomNav active="settings" t={t}/>
    </div>
  );
}
