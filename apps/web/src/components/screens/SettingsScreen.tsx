'use client';
import { theme, baseFont } from '@/lib/theme';
import { useSettingsStore } from '@aws-prep/core';
import { BottomNav } from '@/components/ui/BottomNav';
import { Sun, Moon } from '@/components/icons';

interface SettingsScreenProps { dark: boolean; onToggleDark: () => void; }

const GOAL_PRESETS = [5, 10, 15, 20];

export function SettingsScreen({ dark, onToggleDark }: SettingsScreenProps) {
  const t = theme(dark);
  const dailyGoal = useSettingsStore(s => s.dailyGoal);
  const setDailyGoal = useSettingsStore(s => s.setDailyGoal);

  return (
    <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text }}>
      {/* Header */}
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
