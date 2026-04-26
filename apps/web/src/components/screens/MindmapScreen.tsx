'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MINDMAP } from '@aws-prep/content';
import type { MindmapCluster, MindmapService } from '@aws-prep/content';
import { theme, baseFont, mono } from '@/lib/theme';
import { BottomNav } from '@/components/ui/BottomNav';
import { Back, Search, Plus, Minus, Target, Chevron } from '@/components/icons';

// ── Layout math (exact from design lines 793–805) ──────────────────────────
const cx = 188, cy = 360;
const ring1 = { r: 130, count: 5, start: -Math.PI / 2 };
const ring2 = { r: 230, count: 6, start: -Math.PI / 2 + Math.PI / 6 };
const positions: { x: number; y: number }[] = [];
for (let i = 0; i < ring1.count; i++) {
  const a = ring1.start + (i * 2 * Math.PI) / ring1.count;
  positions.push({ x: cx + ring1.r * Math.cos(a), y: cy + ring1.r * Math.sin(a) });
}
for (let i = 0; i < ring2.count; i++) {
  const a = ring2.start + (i * 2 * Math.PI) / ring2.count;
  positions.push({ x: cx + ring2.r * Math.cos(a), y: cy + ring2.r * Math.sin(a) });
}

type ClusterWithPos = MindmapCluster & { x: number; y: number };
const clusters: ClusterWithPos[] = MINDMAP.map((c, i) => ({ ...c, ...positions[i] }));

const TOTAL_SERVICES = MINDMAP.reduce((s, c) => s + c.services.length, 0);

// ── Color helpers (exact from design) ──────────────────────────────────────
function clusterColor(hue: number, dark: boolean) {
  return dark ? `oklch(0.62 0.14 ${hue})` : `oklch(0.6 0.15 ${hue})`;
}
function clusterBg(hue: number, dark: boolean) {
  return dark ? `oklch(0.32 0.08 ${hue})` : `oklch(0.96 0.04 ${hue})`;
}

// ── Service sheet state ─────────────────────────────────────────────────────
interface ServiceSheetData {
  service: MindmapService;
  cluster: ClusterWithPos;
}

export function MindmapScreen({ dark = true }: { dark?: boolean }) {
  const t = theme(dark);
  const router = useRouter();

  const [focusedClusterId, setFocusedClusterId] = useState<string | null>(null);
  const [serviceSheet, setServiceSheet] = useState<ServiceSheetData | null>(null);
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(1.0);

  // Search: compute filtered count
  const filteredCount = useMemo(() => {
    if (!query.trim()) return TOTAL_SERVICES;
    const q = query.toLowerCase();
    return MINDMAP.reduce((acc, c) =>
      acc + c.services.filter(s =>
        s.abbr.toLowerCase().includes(q) ||
        (s.fullName ?? '').toLowerCase().includes(q)
      ).length, 0);
  }, [query]);

  // Auto-focus cluster when search matches exactly one
  const autoFocusId = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    const matching = MINDMAP.filter(c =>
      c.services.some(s =>
        s.abbr.toLowerCase().includes(q) ||
        (s.fullName ?? '').toLowerCase().includes(q)
      )
    );
    return matching.length === 1 ? matching[0].id : null;
  }, [query]);

  const effectiveFocusId = autoFocusId ?? focusedClusterId;

  const dark_ = dark; // capture for closures

  // Zoom transform: scale around (cx, cy)
  const zoomTransform = `translate(${cx},${cy}) scale(${zoom}) translate(${-cx},${-cy})`;

  return (
    <div style={{
      background: t.bgGrad,
      height: '100dvh', display: 'flex', flexDirection: 'column',
      fontFamily: baseFont, color: t.text, position: 'relative', overflow: 'hidden',
    }}>

      {/* Sticky search bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
        padding: '52px 16px 12px',
        background: dark
          ? 'linear-gradient(180deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.6) 70%, rgba(15,23,42,0) 100%)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.6) 70%, rgba(255,255,255,0) 100%)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Back button */}
          <button
            onClick={() => router.push('/learn')}
            style={{
              width: 36, height: 36, borderRadius: 10,
              border: `1px solid ${t.border}`, background: t.surface,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <Back size={18} color={t.text}/>
          </button>

          {/* Search box */}
          <div style={{
            flex: 1, height: 40, borderRadius: 12,
            background: t.surface, border: `1px solid ${t.border}`,
            display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
            boxShadow: dark ? 'none' : '0 1px 2px rgba(15,23,42,0.04)',
          }}>
            <Search size={16} color={t.textMuted}/>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Service oder Topic suchen…"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: 13, color: t.text, fontFamily: baseFont, fontWeight: 500,
              }}
            />
            <span style={{
              fontSize: 10, padding: '2px 6px', borderRadius: 4,
              background: t.bg2, color: t.textMuted, fontFamily: mono, fontWeight: 600,
              flexShrink: 0,
            }}>
              {filteredCount} / {TOTAL_SERVICES}
            </span>
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 0.4, paddingLeft: 4 }}>
          AWS CLOUD PRACTITIONER · 11 Themen · {TOTAL_SERVICES} Services
        </div>
      </div>

      {/* CANVAS */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Dotted radial-gradient background */}
        <div style={{
          position: 'absolute', inset: -80,
          backgroundImage: `radial-gradient(${dark ? 'rgba(148,163,184,0.08)' : 'rgba(15,23,42,0.06)'} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          opacity: 0.7,
        }}/>

        {/* SVG canvas */}
        <svg
          viewBox="0 0 376 720"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <defs>
            <radialGradient id="rootGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={t.accent} stopOpacity="1"/>
              <stop offset="100%" stopColor="#FFB545" stopOpacity="1"/>
            </radialGradient>
            <filter id="rootGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <g transform={zoomTransform}>
            {/* Edges: root → each cluster */}
            {clusters.map((c, i) => (
              <line key={`e-${i}`} x1={cx} y1={cy} x2={c.x} y2={c.y}
                stroke={dark ? 'rgba(148,163,184,0.18)' : 'rgba(15,23,42,0.12)'}
                strokeWidth="1.5" strokeDasharray="3 3"/>
            ))}

            {/* Leaf nodes (only when cluster is focused) */}
            {clusters.map((c, ci) => {
              const isFocused = effectiveFocusId === c.id;
              return c.services.slice(0, isFocused ? 6 : 0).map((s, si) => {
                const angle = (si / Math.max(c.services.length, 1)) * 2 * Math.PI - Math.PI / 2;
                const lr = 52;
                const lx = c.x + lr * Math.cos(angle);
                const ly = c.y + lr * Math.sin(angle);
                return (
                  <g key={`l-${ci}-${si}`} style={{ cursor: 'pointer' }}
                    onClick={() => setServiceSheet({ service: s, cluster: c })}>
                    <line x1={c.x} y1={c.y} x2={lx} y2={ly}
                      stroke={clusterColor(c.hue, dark_)} strokeWidth="1" strokeOpacity="0.5"/>
                    <rect x={lx - 22} y={ly - 9} width="44" height="18" rx="9"
                      fill={t.cardBg}
                      stroke={clusterColor(c.hue, dark_)} strokeWidth="1"/>
                    <text x={lx} y={ly + 3.5} fontSize="9" fontWeight="600"
                      textAnchor="middle"
                      fill={dark ? '#F8FAFC' : '#334155'}
                      fontFamily="'Inter',sans-serif">{s.abbr}</text>
                  </g>
                );
              });
            })}

            {/* Cluster bubbles */}
            {clusters.map((c) => {
              const r = 38;
              const isFocused = effectiveFocusId === c.id;
              return (
                <g key={c.id} style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (serviceSheet) { setServiceSheet(null); return; }
                    setFocusedClusterId(prev => prev === c.id ? null : c.id);
                  }}>
                  <circle cx={c.x} cy={c.y} r={r + 4}
                    fill={clusterColor(c.hue, dark_)}
                    fillOpacity={isFocused ? 0.25 : 0.12}/>
                  <circle cx={c.x} cy={c.y} r={r}
                    fill={clusterBg(c.hue, dark_)}
                    stroke={clusterColor(c.hue, dark_)}
                    strokeWidth={isFocused ? 2 : 1.5}/>
                  <text x={c.x} y={c.y - 2} fontSize="11" fontWeight="700"
                    textAnchor="middle"
                    fill={clusterColor(c.hue, dark_)}
                    fontFamily="'Inter',sans-serif">{c.label}</text>
                  <text x={c.x} y={c.y + 11} fontSize="9" fontWeight="600"
                    textAnchor="middle"
                    fill={clusterColor(c.hue, dark_)} fillOpacity="0.7"
                    fontFamily="'Inter',sans-serif">
                    {c.services.length} Services
                  </text>
                </g>
              );
            })}

            {/* Root node */}
            <g style={{ cursor: 'pointer' }}
              onClick={() => { setFocusedClusterId(null); setServiceSheet(null); }}>
              <circle cx={cx} cy={cy} r="50" fill="url(#rootGrad)" filter="url(#rootGlow)"/>
              <circle cx={cx} cy={cy} r="50" fill="url(#rootGrad)"/>
              <text x={cx} y={cy - 6} fontSize="11" fontWeight="700"
                textAnchor="middle" fill="#fff" fontFamily="'Inter',sans-serif">AWS Cloud</text>
              <text x={cx} y={cy + 8} fontSize="11" fontWeight="700"
                textAnchor="middle" fill="#fff" fontFamily="'Inter',sans-serif">Practitioner</text>
              <text x={cx} y={cy + 22} fontSize="8" fontWeight="600"
                textAnchor="middle" fill="#fff" fillOpacity="0.7"
                fontFamily="'Inter',sans-serif">CLF-C02</text>
            </g>
          </g>
        </svg>

        {/* Mini-map */}
        <div style={{
          position: 'absolute', bottom: 16, right: 16,
          width: 86, height: 100, borderRadius: 10,
          background: dark ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.85)',
          border: `1px solid ${t.border}`,
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          padding: 6,
        }}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {clusters.map((c, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${(c.x / 376) * 100}%`,
                top: `${(c.y / 720) * 100}%`,
                width: 6, height: 6, borderRadius: 3,
                background: clusterColor(c.hue, dark),
                transform: 'translate(-50%, -50%)',
              }}/>
            ))}
            <div style={{
              position: 'absolute',
              left: `${(cx / 376) * 100}%`,
              top: `${(cy / 720) * 100}%`,
              width: 9, height: 9, borderRadius: 5,
              background: t.accent,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 6px ${t.accent}`,
            }}/>
            <div style={{
              position: 'absolute', left: '20%', top: '24%', width: '56%', height: '52%',
              border: `1.5px solid ${t.accent}`, borderRadius: 3,
            }}/>
          </div>
        </div>

        {/* Zoom controls */}
        <div style={{
          position: 'absolute', bottom: 122, right: 16,
          background: dark ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.85)',
          border: `1px solid ${t.border}`,
          backdropFilter: 'blur(12px)',
          borderRadius: 10, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        }}>
          <button
            onClick={() => setZoom(z => Math.min(2.0, z + 0.2))}
            style={{
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none',
              borderBottom: `1px solid ${t.border}`, cursor: 'pointer',
            }}>
            <Plus size={16} color={t.text}/>
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.7, z - 0.2))}
            style={{
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none',
              borderBottom: `1px solid ${t.border}`, cursor: 'pointer',
            }}>
            <Minus size={16} color={t.text}/>
          </button>
          <button
            onClick={() => { setZoom(1.0); setFocusedClusterId(null); setServiceSheet(null); }}
            style={{
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', cursor: 'pointer',
            }}>
            <Target size={15} color={t.text}/>
          </button>
        </div>
      </div>

      {/* Service detail bottom-sheet */}
      {serviceSheet && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 50,
          background: t.bg,
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
          padding: '8px 18px 24px',
          borderTop: `1px solid ${t.border}`,
        }}>
          {/* Drag handle */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 6 }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: t.borderStrong }}/>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            {/* Service abbreviation badge */}
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: clusterBg(serviceSheet.cluster.hue, dark),
              border: `1.5px solid ${clusterColor(serviceSheet.cluster.hue, dark)}`,
              color: clusterColor(serviceSheet.cluster.hue, dark),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, fontFamily: mono,
            }}>
              {serviceSheet.service.abbr}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.2 }}>
                {serviceSheet.service.fullName ?? serviceSheet.service.abbr}
              </div>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginTop: 2 }}>
                {serviceSheet.cluster.label}{serviceSheet.cluster.domain != null ? ` · Domain ${serviceSheet.cluster.domain}` : ''}
              </div>
            </div>
          </div>

          {serviceSheet.service.description && (
            <div style={{ marginTop: 10, fontSize: 13, color: t.textMuted, lineHeight: 1.5 }}>
              {serviceSheet.service.description}
            </div>
          )}

          <button
            onClick={() => {
              if (serviceSheet.cluster.moduleSlug) {
                router.push(`/learn/${serviceSheet.cluster.moduleSlug}`);
              } else {
                setServiceSheet(null);
              }
            }}
            style={{
              marginTop: 14, width: '100%', height: 46, borderRadius: 12, border: 'none',
              background: t.accent, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: baseFont,
            }}>
            Im Modul lernen
            <Chevron size={15} color="#fff"/>
          </button>
        </div>
      )}

      <BottomNav active="learn" t={t}/>
    </div>
  );
}
