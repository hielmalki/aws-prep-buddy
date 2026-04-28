'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MINDMAP } from '@aws-prep/content';
import type { MindmapCluster, MindmapService } from '@aws-prep/content';
import { theme, baseFont, mono } from '@/lib/theme';
import { BottomNav } from '@/components/ui/BottomNav';
import { Back, Search, Plus, Minus, Target, Chevron } from '@/components/icons';

// ── Layout math ────────────────────────────────────────────────────────────
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
const TOPIC_COUNT = MINDMAP.length;

interface ServiceSheetData {
  service: MindmapService;
  cluster: ClusterWithPos;
}

export function MindmapScreen({ dark = false }: { dark?: boolean }) {
  const t = theme(dark);
  const router = useRouter();

  const [focusedClusterId, setFocusedClusterId] = useState<string | null>(null);
  const [serviceSheet, setServiceSheet] = useState<ServiceSheetData | null>(null);
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(1.0);

  const filteredCount = useMemo(() => {
    if (!query.trim()) return TOTAL_SERVICES;
    const q = query.toLowerCase();
    return MINDMAP.reduce((acc, c) =>
      acc + c.services.filter(s =>
        s.abbr.toLowerCase().includes(q) ||
        (s.fullName ?? '').toLowerCase().includes(q)
      ).length, 0);
  }, [query]);

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
  const zoomTransform = `translate(${cx},${cy}) scale(${zoom}) translate(${-cx},${-cy})`;

  // V4 cluster styling — monochrome with accent for focused
  const clusterFill = (active: boolean) => active ? t.accent : (dark ? t.surface : '#FFFFFF');
  const clusterStroke = (active: boolean) => active ? t.accent : t.borderStrong;
  const clusterText = (active: boolean) => active ? t.accentText : t.text;
  const clusterMeta = (active: boolean) => active ? 'rgba(255,255,255,0.7)' : t.textMuted;

  const overlayPanelBg = dark ? 'rgba(28,28,30,0.78)' : 'rgba(255,255,255,0.82)';

  return (
    <div style={{
      background: t.bg,
      height: '100dvh', display: 'flex', flexDirection: 'column',
      fontFamily: baseFont, color: t.text, position: 'relative', overflow: 'hidden',
    }}>

      {/* Sticky search bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
        padding: '52px 16px 12px',
        background: dark
          ? 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0) 100%)'
          : 'linear-gradient(180deg, rgba(251,251,253,0.85) 0%, rgba(251,251,253,0.6) 70%, rgba(251,251,253,0) 100%)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => router.push('/settings')}
            style={{
              width: 36, height: 36, borderRadius: 18,
              border: 'none', background: t.surface2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <Back size={17} color={t.text}/>
          </button>

          <div style={{
            flex: 1, height: 36, borderRadius: 10,
            background: t.surface2,
            display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
          }}>
            <Search size={15} color={t.textMuted}/>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search service or topic"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: 14, color: t.text, fontFamily: baseFont, fontWeight: 400,
              }}
            />
            {query.trim() && (
              <span style={{
                fontSize: 10, padding: '2px 6px', borderRadius: 4,
                background: t.surface3, color: t.textMuted, fontFamily: mono, fontWeight: 600,
                flexShrink: 0,
              }}>
                {filteredCount} / {TOTAL_SERVICES}
              </span>
            )}
          </div>
        </div>
        <div style={{
          marginTop: 10, fontSize: 11, color: t.textMuted, fontWeight: 600,
          letterSpacing: 0.3, paddingLeft: 4, textTransform: 'uppercase',
        }}>
          Cloud Practitioner · {TOPIC_COUNT} Topics · {TOTAL_SERVICES} Services
        </div>
      </div>

      {/* CANVAS */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: -80,
          backgroundImage: `radial-gradient(${dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          opacity: 0.7,
        }}/>

        <svg
          viewBox="0 0 376 720"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <g transform={zoomTransform}>
            {/* Edges */}
            {clusters.map((c, i) => (
              <line key={`e-${i}`} x1={cx} y1={cy} x2={c.x} y2={c.y}
                stroke={dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}
                strokeWidth="1" strokeDasharray="3 3"/>
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
                      stroke={t.accent} strokeOpacity="0.4" strokeWidth="1"/>
                    <rect x={lx - 22} y={ly - 9} width="44" height="18" rx="9"
                      fill={dark ? t.surface : '#FFFFFF'}
                      stroke={t.accent} strokeOpacity="0.6" strokeWidth="0.75"/>
                    <text x={lx} y={ly + 3.5} fontSize="9" fontWeight="600"
                      textAnchor="middle"
                      fill={t.text}
                      fontFamily={baseFont}>{s.abbr}</text>
                  </g>
                );
              });
            })}

            {/* Cluster bubbles — V4 monochrome */}
            {clusters.map((c) => {
              const r = 38;
              const isFocused = effectiveFocusId === c.id;
              return (
                <g key={c.id} style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (serviceSheet) { setServiceSheet(null); return; }
                    setFocusedClusterId(prev => prev === c.id ? null : c.id);
                  }}>
                  {isFocused && (
                    <circle cx={c.x} cy={c.y} r={r + 6} fill="none"
                      stroke={t.accent} strokeOpacity="0.25" strokeWidth="1.5"/>
                  )}
                  <circle cx={c.x} cy={c.y} r={r}
                    fill={clusterFill(isFocused)}
                    stroke={clusterStroke(isFocused)}
                    strokeWidth={isFocused ? 1.5 : 0.75}/>
                  <text x={c.x} y={c.y - 2} fontSize="11" fontWeight="600"
                    textAnchor="middle"
                    fill={clusterText(isFocused)}
                    fontFamily={baseFont} letterSpacing="-0.1">{c.label}</text>
                  <text x={c.x} y={c.y + 11} fontSize="9" fontWeight="500"
                    textAnchor="middle"
                    fill={clusterMeta(isFocused)}
                    fontFamily={baseFont}>
                    {c.services.length} Services
                  </text>
                </g>
              );
            })}

            {/* Root node — flat */}
            <g style={{ cursor: 'pointer' }}
              onClick={() => { setFocusedClusterId(null); setServiceSheet(null); }}>
              <circle cx={cx} cy={cy} r="50" fill={t.text}/>
              <text x={cx} y={cy - 6} fontSize="11" fontWeight="600"
                textAnchor="middle" fill={t.bg} fontFamily={baseFont} letterSpacing="-0.1">AWS Cloud</text>
              <text x={cx} y={cy + 8} fontSize="11" fontWeight="600"
                textAnchor="middle" fill={t.bg} fontFamily={baseFont} letterSpacing="-0.1">Practitioner</text>
              <text x={cx} y={cy + 22} fontSize="8" fontWeight="500"
                textAnchor="middle" fill={t.bg} fillOpacity="0.6"
                fontFamily={baseFont}>CLF-C02</text>
            </g>
          </g>
        </svg>

        {/* Mini-map */}
        <div style={{
          position: 'absolute', bottom: 16, right: 16,
          width: 86, height: 100, borderRadius: 10,
          background: overlayPanelBg,
          border: `0.5px solid ${t.border}`,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          padding: 6,
        }}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {clusters.map((c, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${(c.x / 376) * 100}%`,
                top: `${(c.y / 720) * 100}%`,
                width: 5, height: 5, borderRadius: 3,
                background: t.textMuted,
                transform: 'translate(-50%, -50%)',
              }}/>
            ))}
            <div style={{
              position: 'absolute',
              left: `${(cx / 376) * 100}%`,
              top: `${(cy / 720) * 100}%`,
              width: 8, height: 8, borderRadius: 4,
              background: t.accent,
              transform: 'translate(-50%, -50%)',
            }}/>
            <div style={{
              position: 'absolute', left: '20%', top: '24%', width: '56%', height: '52%',
              border: `1px solid ${t.accent}`, borderRadius: 3,
            }}/>
          </div>
        </div>

        {/* Zoom controls */}
        <div style={{
          position: 'absolute', bottom: 122, right: 16,
          background: overlayPanelBg,
          border: `0.5px solid ${t.border}`,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 10, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <button
            onClick={() => setZoom(z => Math.min(2.0, z + 0.2))}
            style={{
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none',
              borderBottom: `0.5px solid ${t.border}`, cursor: 'pointer',
            }}>
            <Plus size={16} color={t.text}/>
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.7, z - 0.2))}
            style={{
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none',
              borderBottom: `0.5px solid ${t.border}`, cursor: 'pointer',
            }}>
            <Minus size={16} color={t.text}/>
          </button>
          <button
            onClick={() => { setZoom(1.0); setFocusedClusterId(null); setServiceSheet(null); }}
            style={{
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', cursor: 'pointer',
            }}>
            <Target size={15} color={t.accent}/>
          </button>
        </div>
      </div>

      {/* Service detail bottom-sheet */}
      {serviceSheet && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 50,
          background: t.surface,
          borderTopLeftRadius: 14, borderTopRightRadius: 14,
          boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
          padding: '8px 18px 24px',
          borderTop: `0.5px solid ${t.border}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 6 }}>
            <div style={{ width: 36, height: 5, borderRadius: 3, background: t.borderStrong }}/>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 11,
              background: t.accentSoft,
              color: t.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, fontFamily: mono,
            }}>
              {serviceSheet.service.abbr}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {serviceSheet.service.fullName ?? serviceSheet.service.abbr}
              </div>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase', marginTop: 2 }}>
                {serviceSheet.cluster.label}{serviceSheet.cluster.domain != null ? ` · Domain ${serviceSheet.cluster.domain}` : ''}
              </div>
            </div>
          </div>

          {serviceSheet.service.description && (
            <div style={{ marginTop: 10, fontSize: 14, color: t.text2, lineHeight: 1.5 }}>
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
              background: t.accent, color: t.accentText, fontSize: 15, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: baseFont, letterSpacing: -0.2,
            }}>
            Open module
            <Chevron size={15} color={t.accentText}/>
          </button>
        </div>
      )}

      <BottomNav active="learn" t={t}/>
    </div>
  );
}
