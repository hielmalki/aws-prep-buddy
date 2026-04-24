'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { LearnModule, Section } from '@aws-prep/content';
import { theme, baseFont, mono } from '@/lib/theme';
import { BottomNav } from '@/components/ui/BottomNav';
import { SectionRenderer } from '@/components/ui/SectionRenderer';
import { Chevron, ChevronDown, Server, Target } from '@/components/icons';
import { getSectionsForModule } from '@/lib/data';

interface LearnModuleScreenProps {
  module: LearnModule;
  dark?: boolean;
}

export function LearnModuleScreen({ module: mod, dark = true }: LearnModuleScreenProps) {
  const t = theme(dark);
  const router = useRouter();
  const [tocOpen, setTocOpen] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const sections: Section[] = getSectionsForModule(mod);
  const hasSections = sections.length > 0;

  function scrollToSection(idx: number) {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTocOpen(false);
  }

  return (
    <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
      {/* top bar */}
      <div style={{ padding: '60px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => router.push('/learn')}
          style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scaleX(-1)' }}
        >
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

        <div style={{ marginTop: 10, fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>{mod.summary}</div>

        {hasSections ? (
          <>
            {/* TOC accordion */}
            <div style={{ marginTop: 18, borderRadius: 14, background: t.surface, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
              <button
                onClick={() => setTocOpen(!tocOpen)}
                style={{ width: '100%', padding: '12px 14px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: t.text, fontFamily: baseFont }}
              >
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>Contents</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{sections[0].title}</div>
                </div>
                <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600 }}>1/{sections.length}</div>
                <div style={{ transform: tocOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>
                  <ChevronDown size={18} color={t.textMuted}/>
                </div>
              </button>
              {tocOpen && (
                <div style={{ padding: '4px 8px 10px', borderTop: `1px solid ${t.border}` }}>
                  {sections.map((sec, idx) => (
                    <div
                      key={sec.slug}
                      onClick={() => scrollToSection(idx)}
                      style={{ padding: '10px 10px', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center', color: t.text, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                    >
                      <span style={{ width: 22, height: 22, borderRadius: 6, background: t.bg2, color: t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, fontFamily: mono, flexShrink: 0 }}>
                        {idx + 1}
                      </span>
                      {sec.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section content */}
            {sections.map((sec, idx) => (
              <div
                key={sec.slug}
                ref={el => { sectionRefs.current[idx] = el; }}
                style={{ marginTop: 32 }}
              >
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 14px', letterSpacing: -0.4, color: t.text, fontFamily: baseFont }}>
                  {idx + 1} · {sec.title}
                </h3>
                <SectionRenderer blocks={sec.blocks} dark={dark} />
              </div>
            ))}
          </>
        ) : (
          /* Fallback for modules with no sections */
          <>
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
          </>
        )}

        {/* Quiz CTA */}
        <div style={{ marginTop: 28, padding: 16, borderRadius: 18, background: dark ? `linear-gradient(135deg, #1E293B 0%, #1B2A44 100%)` : '#FFF', border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={22} color={t.accent}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Quiz yourself</div>
            <div style={{ fontSize: 12, color: t.textMuted }}>Practice with exam questions</div>
          </div>
          <button
            onClick={() => router.push('/quiz')}
            style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: t.accent, color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: baseFont, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            Start <Chevron size={14} color="#fff"/>
          </button>
        </div>
      </div>

      <BottomNav active="learn" t={t}/>
    </div>
  );
}
