import { Theme } from '@/lib/theme';

interface ProgressBarProps { pct: number; t: Theme; h?: number; }

export function ProgressBar({ pct, t, h = 4 }: ProgressBarProps) {
  return (
    <div style={{ height: h, width: '100%', borderRadius: 999, background: t.surface3, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${pct}%`,
        background: t.accent,
        borderRadius: 999, transition: 'width .6s cubic-bezier(.2,.8,.2,1)',
      }} />
    </div>
  );
}
