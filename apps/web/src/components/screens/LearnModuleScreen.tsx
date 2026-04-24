'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LearnModule } from '@aws-prep/content';
import { theme, baseFont, mono, slate900 } from '@/lib/theme';
import { BottomNav } from '@/components/ui/BottomNav';
import { Chevron, ChevronDown, Server, Clock, Bolt, Target } from '@/components/icons';

interface LearnModuleScreenProps {
  module: LearnModule;
  dark?: boolean;
}

// Static EC2 / Compute content — only shown for slug "compute"
function ComputeContent({ dark }: { dark: boolean }) {
  const t = theme(dark);
  const router = useRouter();
  const [tocOpen, setTocOpen] = useState(false);

  const toc = [
    { n: '1', label: 'What is EC2?', active: true },
    { n: '2', label: 'Instance Types & Families' },
    { n: '3', label: 'Pricing Models' },
    { n: '4', label: 'Placement Groups' },
    { n: '5', label: 'AMIs & Storage' },
  ];

  return (
    <>
      <div style={{ marginTop: 10, display: 'flex', gap: 14, fontSize: 12, color: t.textMuted, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={13} color={t.textMuted}/> 12 min</span>
        <span>·</span>
        <span>8 questions in exam</span>
        <span>·</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: t.green }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: t.green, display: 'inline-block' }}/> Fundamentals
        </span>
      </div>

      {/* TOC accordion */}
      <div style={{ marginTop: 18, borderRadius: 14, background: t.surface, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
        <button onClick={() => setTocOpen(!tocOpen)} style={{ width: '100%', padding: '12px 14px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: t.text, fontFamily: baseFont }}>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>Contents</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{toc.find(i => i.active)?.label}</div>
          </div>
          <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600 }}>1/{toc.length}</div>
          <div style={{ transform: tocOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>
            <ChevronDown size={18} color={t.textMuted}/>
          </div>
        </button>
        {tocOpen && (
          <div style={{ padding: '4px 8px 10px', borderTop: `1px solid ${t.border}` }}>
            {toc.map(it => (
              <div key={it.n} style={{ padding: '10px 10px', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center', background: it.active ? t.accentSoft : 'transparent', color: it.active ? t.accent : t.text, fontSize: 13, fontWeight: it.active ? 600 : 500, cursor: 'pointer' }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: it.active ? t.accent : t.bg2, color: it.active ? '#fff' : t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, fontFamily: mono }}>
                  {it.n}
                </span>
                {it.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, margin: '28px 0 8px', letterSpacing: -0.3 }}>1 · What is EC2?</h3>
      <p style={{ fontSize: 14, lineHeight: 1.65, color: t.textMuted, margin: '0 0 14px' }}>
        <strong style={{ color: t.text }}>Elastic Compute Cloud</strong> is AWS&apos;s service for virtual servers in the cloud.
        You rent compute capacity by the minute — start, stop, and scale via API.
      </p>

      <div style={{ borderRadius: 14, padding: '14px 14px 14px 16px', background: t.accentSoft, border: `1px solid ${t.accent}40`, borderLeft: `4px solid ${t.accent}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: t.accent, letterSpacing: 1, textTransform: 'uppercase' }}>
          <Bolt size={13} color={t.accent}/> Key Facts
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.65, color: t.text }}>
          <li>IaaS — you manage the OS &amp; apps</li>
          <li>Pay-per-second (Linux) / per-hour (Windows)</li>
          <li>Regions → AZs → Instances</li>
        </ul>
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, margin: '24px 0 8px', letterSpacing: -0.3 }}>CLI Example</h3>
      <pre style={{ margin: 0, padding: '14px 16px', borderRadius: 12, background: dark ? '#0B1120' : slate900, color: '#E2E8F0', fontFamily: mono, fontSize: 12, lineHeight: 1.6, overflow: 'auto', border: `1px solid ${t.border}` }}>
        <div><span style={{ color: '#64748B' }}># Start a t3.micro instance</span></div>
        <div><span style={{ color: '#FFB545' }}>aws</span> ec2 run-instances <span style={{ color: '#94A3B8' }}>\</span></div>
        <div>{'  '}<span style={{ color: '#4ADE80' }}>--image-id</span> ami-0abc123 <span style={{ color: '#94A3B8' }}>\</span></div>
        <div>{'  '}<span style={{ color: '#4ADE80' }}>--instance-type</span> t3.micro <span style={{ color: '#94A3B8' }}>\</span></div>
        <div>{'  '}<span style={{ color: '#4ADE80' }}>--key-name</span> my-key</div>
      </pre>

      <p style={{ fontSize: 14, lineHeight: 1.65, color: t.textMuted, margin: '16px 0 0' }}>
        Instance families cover different workloads —{' '}
        <strong style={{ color: t.text }}>T</strong> (burstable),{' '}
        <strong style={{ color: t.text }}>M</strong> (general),{' '}
        <strong style={{ color: t.text }}>C</strong> (compute),{' '}
        <strong style={{ color: t.text }}>R</strong> (memory),{' '}
        <strong style={{ color: t.text }}>I</strong> (storage).
      </p>

      <div style={{ marginTop: 22, padding: 16, borderRadius: 18, background: dark ? `linear-gradient(135deg, #1E293B 0%, #1B2A44 100%)` : '#FFF', border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Target size={22} color={t.accent}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Quiz yourself on EC2</div>
          <div style={{ fontSize: 12, color: t.textMuted }}>10 questions · ~6 min</div>
        </div>
        <button onClick={() => router.push('/quiz')} style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: t.accent, color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: baseFont, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          Start <Chevron size={14} color="#fff"/>
        </button>
      </div>
    </>
  );
}

export function LearnModuleScreen({ module: mod, dark = true }: LearnModuleScreenProps) {
  const t = theme(dark);
  const router = useRouter();

  return (
    <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
      {/* top bar */}
      <div style={{ padding: '60px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => router.push('/learn')} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scaleX(-1)' }}>
          <Chevron size={18} color={t.text}/>
        </button>
        <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 600 }}>{mod.title}</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '18px 20px 120px' }}>
        {/* Topic header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(255,153,0,0.3)' }}>
            <Server size={26} color="#fff"/>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.accent, letterSpacing: 1, textTransform: 'uppercase' }}>AWS</div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1 }}>{mod.title.split(' ')[0]}</div>
          </div>
        </div>

        {mod.slug === 'compute' ? (
          <ComputeContent dark={dark} />
        ) : (
          // Stub for all other modules
          <div>
            <div style={{ marginTop: 10, fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>{mod.summary}</div>
            <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {mod.subTopics.map(s => (
                <span key={s} style={{ padding: '6px 12px', borderRadius: 20, background: t.surface, border: `1px solid ${t.border}`, fontSize: 12, fontWeight: 600, color: t.text }}>
                  {s}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 28, padding: '24px 20px', borderRadius: 18, background: t.surface, border: `1px solid ${t.border}`, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🚧</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Content coming soon</div>
              <div style={{ fontSize: 13, color: t.textMuted, marginTop: 6, lineHeight: 1.5 }}>
                Full study notes for <strong style={{ color: t.text }}>{mod.title}</strong> are being prepared.
              </div>
            </div>
            <div style={{ marginTop: 20, padding: 16, borderRadius: 18, background: dark ? `linear-gradient(135deg, #1E293B 0%, #1B2A44 100%)` : '#FFF', border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={22} color={t.accent}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Quiz yourself</div>
                <div style={{ fontSize: 12, color: t.textMuted }}>Practice with exam questions</div>
              </div>
              <button onClick={() => router.push('/quiz')} style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: t.accent, color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: baseFont, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                Start <Chevron size={14} color="#fff"/>
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav active="learn" t={t}/>
    </div>
  );
}
