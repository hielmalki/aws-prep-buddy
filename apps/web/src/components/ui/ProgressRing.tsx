'use client';
import { Theme } from '@/lib/theme';
import { useState, useEffect } from 'react';

interface ProgressRingProps { pct: number; size?: number; stroke?: number; t: Theme; }

export function ProgressRing({ pct, size = 96, stroke = 9, t }: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={t.bg2} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={t.accent} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)' }}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', color: t.text,
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1 }}>
          6<span style={{ color: t.textMuted, fontSize: 14, fontWeight: 500 }}>/10</span>
        </div>
        <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 600 }}>Questions</div>
      </div>
    </div>
  );
}

export function AnimatedProgressRing(props: Omit<ProgressRingProps, 'pct'> & { targetPct: number }) {
  const [pct, setPct] = useState(0);
  useEffect(() => { const id = setTimeout(() => setPct(props.targetPct), 200); return () => clearTimeout(id); }, [props.targetPct]);
  return <ProgressRing {...props} pct={pct} />;
}
