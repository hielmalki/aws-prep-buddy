import { Theme } from '@/lib/theme';

interface ProgressBarProps { pct: number; t: Theme; h?: number; }

export function ProgressBar({ pct, t, h = 6 }: ProgressBarProps) {
  return (
    <div style={{ height: h, width: '100%', borderRadius: 999, background: t.bg2, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${pct}%`,
        background: `linear-gradient(90deg, ${t.accent} 0%, #FFB545 100%)`,
        borderRadius: 999, transition: 'width .6s cubic-bezier(.2,.8,.2,1)',
      }} />
    </div>
  );
}
