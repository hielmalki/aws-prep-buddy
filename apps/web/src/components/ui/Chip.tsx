import { baseFont } from '@/lib/theme';

interface ChipProps {
  children: React.ReactNode;
  color: string;
  bg: string;
  border?: string;
}

export function Chip({ children, color, bg, border }: ChipProps) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 9px', borderRadius: 999,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.2,
      color, background: bg, border: `1px solid ${border ?? 'transparent'}`,
      fontFamily: baseFont,
    }}>{children}</span>
  );
}
