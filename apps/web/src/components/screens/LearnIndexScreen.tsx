'use client';
import { useRouter } from 'next/navigation';
import { LEARN_MODULES } from '@aws-prep/content';
import type { LearnModule } from '@aws-prep/content';
import { theme, baseFont } from '@/lib/theme';
import { BottomNav } from '@/components/ui/BottomNav';
import { Chevron, Server, Shield, Database, DollarSign, Globe, Cloud, Layers, Bolt, Book, Settings, Target } from '@/components/icons';

interface LearnIndexScreenProps { dark?: boolean; }

function ModuleIcon({ icon, size, color }: { icon: LearnModule['icon']; size: number; color: string }) {
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

const VISIBLE_MODULES = LEARN_MODULES.filter(m => m.slug !== 'other');

export function LearnIndexScreen({ dark = true }: LearnIndexScreenProps) {
  const t = theme(dark);
  const router = useRouter();

  return (
    <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
      <div style={{ padding: '64px 20px 12px' }}>
        <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>AWS Cloud Practitioner</div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, marginTop: 2 }}>Study Modules</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 120px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {VISIBLE_MODULES.map((mod, idx) => (
          <button
            key={mod.slug}
            onClick={() => router.push(`/learn/${mod.slug}`)}
            style={{
              textAlign: 'left', padding: '14px 16px', borderRadius: 16,
              background: t.surface, border: `1px solid ${t.border}`,
              cursor: 'pointer', fontFamily: baseFont, color: t.text,
              display: 'flex', alignItems: 'center', gap: 14,
            }}
          >
            <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 12, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ModuleIcon icon={mod.icon} size={22} color={t.accent} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2 }}>
                Module {idx + 1}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{mod.title}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 3, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {mod.subTopics.slice(0, 2).join(' · ')}
              </div>
            </div>
            <div style={{ flexShrink: 0, opacity: 0.4 }}>
              <Chevron size={16} color={t.text} />
            </div>
          </button>
        ))}
      </div>

      <BottomNav active="learn" t={t} />
    </div>
  );
}
