'use client';
import { Theme, baseFont } from '@/lib/theme';
import { Home, Book, Quiz, Settings } from '@/components/icons';
import Link from 'next/link';

type NavId = 'home' | 'learn' | 'quiz' | 'settings';

const items: { id: NavId; label: string; href: string; Icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { id: 'home',     label: 'Home',     href: '/',         Icon: Home },
  { id: 'learn',    label: 'Learn',    href: '/learn',    Icon: Book },
  { id: 'quiz',     label: 'Quiz',     href: '/quiz',     Icon: Quiz },
  { id: 'settings', label: 'Du',       href: '/settings', Icon: Settings },
];

interface BottomNavProps { active: NavId; t: Theme; }

export function BottomNav({ active, t }: BottomNavProps) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 'env(safe-area-inset-bottom, 20px)', paddingTop: 8,
      background: t.navBg,
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: `1px solid ${t.border}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
      zIndex: 40,
    }}>
      {items.map(({ id, label, href, Icon }) => {
        const on = id === active;
        const col = on ? t.accent : t.textMuted;
        return (
          <Link key={id} href={href} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            minWidth: 56, padding: '6px 4px', color: col,
            fontFamily: baseFont, position: 'relative', textDecoration: 'none',
          }}>
            {on && <div style={{ position: 'absolute', top: -9, width: 24, height: 3, borderRadius: 2, background: t.accent }}/>}
            <Icon size={22} color={col} />
            <span style={{ fontSize: 10, fontWeight: on ? 700 : 500, letterSpacing: 0.2 }}>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
