// flashcards-screens.jsx — AWS Prep Buddy · Feature 1 (Flashcards) + Feature 2 (Service Mindmap)
// Reuses the v1 design language: slate + AWS-orange, Inter, soft shadows in light, glass-no-glow in dark.

const FCawsOrange = '#FF9900';
const FCslate900 = '#0F172A';
const FCslate800 = '#1E293B';
const FCslate700 = '#334155';
const FCslate600 = '#475569';
const FCslate500 = '#64748B';
const FCslate400 = '#94A3B8';
const FCslate300 = '#CBD5E1';
const FCslate200 = '#E2E8F0';
const FCslate100 = '#F1F5F9';
const FCslate50  = '#F8FAFC';

const FCfont = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
const FCmono = `'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace`;

function fcTheme(dark) {
  return dark ? {
    bg: FCslate900,
    bg2: '#0B1120',
    bgGrad: `linear-gradient(180deg, ${FCslate900} 0%, ${FCslate800} 100%)`,
    surface: FCslate800,
    surface2: '#253349',
    border: 'rgba(148,163,184,0.14)',
    borderStrong: 'rgba(148,163,184,0.24)',
    text: '#F8FAFC',
    textMuted: FCslate400,
    textSubtle: FCslate600,
    accent: FCawsOrange,
    accentSoft: 'rgba(255,153,0,0.14)',
    green: '#4ADE80',
    greenSoft: 'rgba(74,222,128,0.14)',
    red: '#F87171',
    redSoft: 'rgba(248,113,113,0.14)',
    blue: '#60A5FA',
    blueSoft: 'rgba(96,165,250,0.14)',
    navBg: 'rgba(15,23,42,0.85)',
    cardBg: '#1E293B',
  } : {
    bg: '#F8FAFC',
    bg2: '#EEF2F7',
    bgGrad: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2F7 100%)',
    surface: '#FFFFFF',
    surface2: '#F8FAFC',
    border: 'rgba(15,23,42,0.08)',
    borderStrong: 'rgba(15,23,42,0.14)',
    text: FCslate900,
    textMuted: FCslate600,
    textSubtle: FCslate400,
    accent: '#E88800',
    accentSoft: 'rgba(255,153,0,0.12)',
    green: '#16A34A',
    greenSoft: '#DCFCE7',
    red: '#DC2626',
    redSoft: '#FEE2E2',
    blue: '#2563EB',
    blueSoft: '#DBEAFE',
    navBg: 'rgba(255,255,255,0.9)',
    cardBg: '#FFFFFF',
  };
}

// ── icon set ────────────────────────────────────────────
const FCIco = {
  home:    (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  book:    (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  cards:   (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="14" height="12" rx="2" transform="rotate(-6 10 12)"/><rect x="6" y="4" width="14" height="12" rx="2"/></svg>,
  quiz:    (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>,
  sett:    (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  plus:    (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  sparkle: (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9.9 2.1 8.7 5.2 5.6 6.4l3.1 1.2 1.2 3.1 1.2-3.1 3.1-1.2-3.1-1.2z"/><path d="M18 8v4M20 10h-4M16 18v3M17.5 19.5h-3"/></svg>,
  chev:    (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  chevDn:  (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  back:    (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  close:   (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  check:   (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:       (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  edit:    (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>,
  flame:   (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z"/></svg>,
  search:  (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>,
  plus2:   (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  minus:   (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  flip:    (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>,
  tag:     (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  target:  (s,c)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
};

// ── shared bottom nav (Flashcards-active variant) ──────
function FCBottomNav({ active = 'learn', t }) {
  const items = [
    { id: 'home', label: 'Home', icon: FCIco.home },
    { id: 'learn', label: 'Learn', icon: FCIco.book },
    { id: 'quiz', label: 'Quiz', icon: FCIco.quiz },
    { id: 'settings', label: 'Du', icon: FCIco.sett },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 34, paddingTop: 8,
      background: t.navBg,
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: `1px solid ${t.border}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
      zIndex: 40,
    }}>
      {items.map(it => {
        const on = it.id === active;
        const col = on ? t.accent : t.textMuted;
        return (
          <div key={it.id} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            minWidth: 56, padding: '6px 4px', color: col, position: 'relative',
          }}>
            {on && <div style={{ position: 'absolute', top: -9, width: 24, height: 3, borderRadius: 2, background: t.accent }}/>}
            {it.icon(22, col)}
            <span style={{ fontSize: 10, fontWeight: on ? 700 : 500, letterSpacing: 0.2 }}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 1A — Decks Übersicht (/flashcards)
// ─────────────────────────────────────────────────────────
function DecksOverview({ dark }) {
  const t = fcTheme(dark);
  const userDecks = [
    { name: 'EC2 & Compute',         total: 84, due: 12, color: t.accent },
    { name: 'IAM & Security',         total: 56, due: 8,  color: t.blue },
    { name: 'Storage (S3, EBS, EFS)', total: 47, due: 0,  color: t.green },
    { name: 'Networking & VPC',       total: 38, due: 5,  color: '#A78BFA' },
    { name: 'Billing & Pricing',      total: 29, due: 3,  color: '#F472B6' },
  ];

  return (
    <div style={{ background: t.bgGrad, height: '100%', display: 'flex', flexDirection: 'column', fontFamily: FCfont, color: t.text, position: 'relative' }}>
      {/* header */}
      <div style={{ padding: '60px 20px 14px' }}>
        <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>Wiederholen</div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6, marginTop: 2 }}>Flashcards</div>
        <div style={{ fontSize: 13, color: t.textMuted, marginTop: 4 }}>
          <span style={{ color: t.accent, fontWeight: 600 }}>28</span> Karten heute fällig · 5 Decks
        </div>
      </div>

      {/* body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 110px' }}>
        {/* Auto-Deck "Meine Fehler" — accent highlight */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          borderRadius: 18, padding: 16,
          background: dark
            ? `radial-gradient(140% 100% at 0% 0%, rgba(255,153,0,0.32) 0%, transparent 60%), linear-gradient(135deg, #1F2A44 0%, ${FCslate800} 100%)`
            : `radial-gradient(140% 100% at 0% 0%, rgba(255,153,0,0.28) 0%, transparent 60%), linear-gradient(135deg, #FFFFFF 0%, #FFF4E0 100%)`,
          border: `1px solid ${dark ? 'rgba(255,153,0,0.35)' : 'rgba(255,153,0,0.4)'}`,
          boxShadow: dark ? 'none' : '0 1px 2px rgba(15,23,42,0.04), 0 12px 32px rgba(255,153,0,0.18)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)`,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(255,153,0,0.4)',
            }}>{FCIco.flame(22, '#fff')}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 999, background: 'rgba(255,153,0,0.18)', color: t.accent, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>
                Auto-Deck
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 5, letterSpacing: -0.2 }}>Meine Fehler</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>23 Karten · automatisch aus falsch beantworteten Fragen</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
            <div style={{
              padding: '5px 10px', borderRadius: 999, background: t.accent, color: '#fff',
              fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
            }}>14 fällig</div>
            <div style={{ flex: 1 }}/>
            <button style={{
              padding: '10px 16px', borderRadius: 12, border: 'none',
              background: t.text, color: t.bg, fontSize: 13, fontWeight: 700,
              fontFamily: FCfont, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}>Review {FCIco.chev(14, t.bg)}</button>
          </div>
        </div>

        {/* AI generation CTA */}
        <button style={{
          marginTop: 12, width: '100%',
          padding: '12px 14px', borderRadius: 14,
          background: t.surface, border: `1.5px dashed ${dark ? 'rgba(255,153,0,0.35)' : 'rgba(232,136,0,0.35)'}`,
          color: t.text, fontFamily: FCfont, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, background: t.accentSoft, color: t.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{FCIco.sparkle(18, t.accent)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Aus deinen 5 letzten Fehlern generieren</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1 }}>KI erstellt Karten · ~10 sek</div>
          </div>
          {FCIco.chev(16, t.textMuted)}
        </button>

        {/* Section: User Decks */}
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>Deine Decks</div>
          <div style={{ fontSize: 12, color: t.accent, fontWeight: 600 }}>Sortieren</div>
        </div>

        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {userDecks.map(d => (
            <div key={d.name} style={{
              background: t.surface, border: `1px solid ${t.border}`,
              borderRadius: 16, padding: 14,
              display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: dark ? 'none' : '0 1px 2px rgba(15,23,42,0.04)',
            }}>
              {/* Stack-of-cards mini icon */}
              <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 4, left: -2, width: 30, height: 36, borderRadius: 7, background: dark ? 'rgba(148,163,184,0.18)' : '#F1F5F9', transform: 'rotate(-8deg)' }}/>
                <div style={{ position: 'absolute', top: 2, left: 6, width: 32, height: 38, borderRadius: 8, background: d.color, opacity: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  {FCIco.cards(18, '#fff')}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 3 }}>{d.total} Karten</div>
              </div>
              {d.due > 0 ? (
                <div style={{
                  padding: '4px 9px', borderRadius: 999, background: t.accentSoft, color: t.accent,
                  fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                }}>{d.due} fällig</div>
              ) : (
                <div style={{
                  padding: '4px 9px', borderRadius: 999, background: t.greenSoft, color: t.green,
                  fontSize: 11, fontWeight: 700,
                }}>✓ aktuell</div>
              )}
              <button style={{
                width: 32, height: 32, borderRadius: 10, border: `1px solid ${t.border}`,
                background: 'transparent', color: t.textMuted, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{FCIco.chev(15, t.textMuted)}</button>
            </div>
          ))}
        </div>

        <div style={{ height: 16 }}/>
      </div>

      {/* FAB */}
      <button style={{
        position: 'absolute', right: 20, bottom: 100,
        width: 56, height: 56, borderRadius: 18, border: 'none',
        background: `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)`,
        color: '#fff', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 10px 28px rgba(255,153,0,0.45), 0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 35,
      }}>{FCIco.plus(26, '#fff')}</button>

      <FCBottomNav active="learn" t={t}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 1B — Review Screen (Flip card + 4 SRS buttons)
// ─────────────────────────────────────────────────────────
function ReviewScreen({ dark, flipped = false, empty = false }) {
  const t = fcTheme(dark);

  if (empty) {
    return (
      <div style={{ background: t.bgGrad, height: '100%', display: 'flex', flexDirection: 'column', fontFamily: FCfont, color: t.text, position: 'relative' }}>
        <div style={{ padding: '60px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{FCIco.back(18, t.text)}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.textMuted }}>EC2 & Compute</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
          {/* celebratory illustration */}
          <div style={{ position: 'relative', width: 140, height: 140, marginBottom: 8 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 70, background: dark ? 'rgba(74,222,128,0.12)' : '#DCFCE7' }}/>
            <div style={{ position: 'absolute', inset: 18, borderRadius: 52, background: dark ? 'rgba(74,222,128,0.18)' : '#BBF7D0' }}/>
            <div style={{ position: 'absolute', inset: 36, borderRadius: 36, background: t.green, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 32px rgba(22,163,74,0.4)' }}>
              {FCIco.check(40, '#fff')}
            </div>
            {/* sparkles */}
            <div style={{ position: 'absolute', top: 8, right: 18, fontSize: 22 }}>✨</div>
            <div style={{ position: 'absolute', bottom: 14, left: 12, fontSize: 18 }}>🎉</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 18, letterSpacing: -0.4 }}>Du bist auf dem aktuellen Stand</div>
          <div style={{ fontSize: 14, color: t.textMuted, marginTop: 8, lineHeight: 1.55, maxWidth: 280 }}>
            Keine Karten mehr fällig. Nächste Wiederholung: <strong style={{ color: t.text }}>morgen, 8 Karten</strong>.
          </div>
          <button style={{
            marginTop: 24, padding: '12px 20px', borderRadius: 12, border: 'none',
            background: t.text, color: t.bg, fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>Neue Karte hinzufügen</button>
          <button style={{
            marginTop: 8, padding: '10px 18px', borderRadius: 10, border: 'none',
            background: 'transparent', color: t.textMuted, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>Zurück zu Decks</button>
        </div>
      </div>
    );
  }

  // SRS buttons spec
  const srsBtns = [
    { label: 'Again', interval: '10 min', color: t.red,    bg: dark ? 'rgba(248,113,113,0.18)' : '#FEE2E2', shadow: 'rgba(220,38,38,0.35)' },
    { label: 'Hard',  interval: '1 Tag',  color: t.accent, bg: dark ? 'rgba(255,153,0,0.18)'  : '#FFEDD5', shadow: 'rgba(255,153,0,0.35)' },
    { label: 'Good',  interval: '4 Tage', color: t.green,  bg: dark ? 'rgba(74,222,128,0.18)' : '#DCFCE7', shadow: 'rgba(22,163,74,0.35)' },
    { label: 'Easy',  interval: '10 Tage',color: t.blue,   bg: dark ? 'rgba(96,165,250,0.18)' : '#DBEAFE', shadow: 'rgba(37,99,235,0.35)' },
  ];

  return (
    <div style={{ background: t.bgGrad, height: '100%', display: 'flex', flexDirection: 'column', fontFamily: FCfont, color: t.text, position: 'relative' }}>
      {/* top bar with progress */}
      <div style={{ padding: '60px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {FCIco.close(18, t.text)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: t.textMuted, marginBottom: 5 }}>
            <span style={{ fontSize: 12 }}>EC2 & Compute</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>7 / 12</span>
          </div>
          <div style={{ height: 5, borderRadius: 3, background: t.bg2, overflow: 'hidden' }}>
            <div style={{ width: '58%', height: '100%', background: `linear-gradient(90deg, ${t.accent} 0%, #FFB545 100%)`, borderRadius: 3 }}/>
          </div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {FCIco.edit(16, t.textMuted)}
        </div>
      </div>

      {/* Card — render only the visible face for reliable rendering */}
      <div style={{ flex: 1, padding: '24px 22px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '100%', maxHeight: 460, aspectRatio: '0.78',
            position: 'relative',
          }}>
            {!flipped && (
            /* FRONT */
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: 20, background: t.cardBg,
              border: `1px solid ${t.border}`,
              boxShadow: dark
                ? '0 12px 40px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.2)'
                : '0 1px 2px rgba(15,23,42,0.04), 0 16px 40px rgba(15,23,42,0.10)',
              padding: '22px 22px 18px',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: t.accentSoft, color: t.accent, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>Compute</span>
                <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: t.bg2, color: t.textMuted, fontWeight: 600 }}>#ec2 #pricing</span>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px 4px' }}>
                <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.35, letterSpacing: -0.3 }}>
                  Welcher EC2-Preisplan bietet bis zu <span style={{ color: t.accent }}>90 % Rabatt</span> für unterbrechungstolerante Workloads?
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: t.textMuted, fontSize: 12 }}>
                {FCIco.flip(15, t.textMuted)} Tippe zum Umdrehen
              </div>
            </div>
            )}
            {flipped && (
            /* BACK */
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: 20, background: t.cardBg,
              border: `1.5px solid ${t.accent}`,
              boxShadow: dark
                ? '0 12px 40px rgba(0,0,0,0.4), 0 0 0 4px rgba(255,153,0,0.1)'
                : '0 1px 2px rgba(15,23,42,0.04), 0 16px 40px rgba(255,153,0,0.18)',
              padding: '22px 22px 20px',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.accent, letterSpacing: 0.6, textTransform: 'uppercase' }}>Antwort</div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left', padding: '14px 0' }}>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, color: t.accent }}>Spot Instances</div>
                <div style={{ fontSize: 14, color: t.textMuted, marginTop: 12, lineHeight: 1.55 }}>
                  Nutzen ungenutzte EC2-Kapazität — können <strong style={{ color: t.text }}>jederzeit unterbrochen</strong> werden (2-min-Warnung).
                  Ideal für Batch, CI/CD, Big-Data, Stateless-Workers.
                </div>
                <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: t.bg2, border: `1px solid ${t.border}`, fontSize: 12, color: t.textMuted, lineHeight: 1.5 }}>
                  <span style={{ color: t.text, fontWeight: 600 }}>Vergleich:</span> On-Demand (100%) · Reserved (~60%) · Savings Plans (~70%) · <span style={{ color: t.accent, fontWeight: 600 }}>Spot (~10%)</span>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>

        {/* SRS buttons */}
        <div style={{ paddingTop: 18, paddingBottom: 24 }}>
          {!flipped ? (
            <button style={{
              width: '100%', height: 52, borderRadius: 14, border: 'none',
              background: t.text, color: t.bg, fontSize: 15, fontWeight: 700,
              fontFamily: FCfont, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>{FCIco.flip(18, t.bg)} Antwort anzeigen</button>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {srsBtns.map(b => (
                <div key={b.label} style={{
                  padding: '10px 4px 10px', borderRadius: 14,
                  background: b.bg, border: `1.5px solid ${b.color}40`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  boxShadow: dark ? 'none' : `0 4px 12px ${b.shadow.replace('0.35','0.18')}`,
                  cursor: 'pointer',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: b.color, letterSpacing: -0.2 }}>{b.label}</div>
                  <div style={{
                    fontSize: 10, fontWeight: 600, color: b.color, opacity: 0.85,
                    fontVariantNumeric: 'tabular-nums',
                    padding: '2px 7px', borderRadius: 999,
                    background: dark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.7)',
                    border: `1px solid ${b.color}25`,
                  }}>{b.interval}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 1C — Card Editor (Bottom Sheet)
// ─────────────────────────────────────────────────────────
function CardEditorSheet({ dark, previewBack = false }) {
  const t = fcTheme(dark);
  const tags = ['ec2', 'compute', 'pricing', '+'];

  // background = decks list (visual continuity)
  return (
    <div style={{ background: t.bgGrad, height: '100%', position: 'relative', fontFamily: FCfont, color: t.text, overflow: 'hidden' }}>
      {/* dim faded background */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.5, filter: 'blur(2px)' }}>
        <div style={{ padding: '60px 20px 14px' }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>Flashcards</div>
        </div>
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: 64, borderRadius: 16, background: t.surface, border: `1px solid ${t.border}` }}/>
          ))}
        </div>
      </div>
      {/* backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}/>

      {/* SHEET */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: t.bg,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        boxShadow: '0 -8px 40px rgba(0,0,0,0.25)',
        padding: '8px 0 28px',
        display: 'flex', flexDirection: 'column',
        maxHeight: '88%',
      }}>
        {/* grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 6, paddingBottom: 4 }}>
          <div style={{ width: 38, height: 4, borderRadius: 2, background: t.borderStrong }}/>
        </div>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 18px 14px' }}>
          <div style={{ width: 60 }}>
            <span style={{ color: t.textMuted, fontSize: 14, fontWeight: 500 }}>Abbrechen</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Neue Karte</div>
          <div style={{ width: 60, textAlign: 'right' }}>
            <span style={{ color: t.accent, fontSize: 14, fontWeight: 700 }}>Speichern</span>
          </div>
        </div>

        {/* preview toggle */}
        <div style={{ padding: '0 18px 14px' }}>
          <div style={{
            display: 'inline-flex', padding: 3, borderRadius: 10,
            background: t.bg2, border: `1px solid ${t.border}`,
          }}>
            {['Front', 'Back'].map((s, i) => {
              const on = (i === 0 && !previewBack) || (i === 1 && previewBack);
              return (
                <div key={s} style={{
                  padding: '6px 18px', borderRadius: 8,
                  fontSize: 12, fontWeight: 700,
                  background: on ? t.surface : 'transparent',
                  color: on ? t.text : t.textMuted,
                  boxShadow: on ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }}>{s}</div>
              );
            })}
          </div>
        </div>

        {/* body */}
        <div style={{ padding: '0 18px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Front field */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Front</div>
            <div style={{
              padding: 14, borderRadius: 14,
              background: t.surface, border: previewBack ? `1px solid ${t.border}` : `1.5px solid ${t.accent}`,
              minHeight: 92,
            }}>
              <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.45, color: t.text }}>
                Welcher EC2-Preisplan bietet bis zu 90 % Rabatt für unterbrechungstolerante Workloads?
              </div>
            </div>
          </div>

          {/* Back field */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Back</div>
            <div style={{
              padding: 14, borderRadius: 14,
              background: t.surface, border: previewBack ? `1.5px solid ${t.accent}` : `1px solid ${t.border}`,
              minHeight: 110,
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.accent, letterSpacing: -0.3 }}>Spot Instances</div>
              <div style={{ fontSize: 13, color: t.textMuted, marginTop: 6, lineHeight: 1.55 }}>
                Nutzen ungenutzte EC2-Kapazität · können jederzeit unterbrochen werden (2-min-Warnung). Ideal für Batch / CI / Stateless-Workers.
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Tags</div>
            <div style={{
              padding: 10, borderRadius: 14,
              background: t.surface, border: `1px solid ${t.border}`,
              display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', minHeight: 50,
            }}>
              {tags.map((tag, i) => {
                const isAdd = tag === '+';
                return (
                  <div key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: isAdd ? '5px 8px' : '5px 4px 5px 9px', borderRadius: 999,
                    background: isAdd ? 'transparent' : t.accentSoft,
                    color: isAdd ? t.textMuted : t.accent,
                    border: isAdd ? `1px dashed ${t.borderStrong}` : 'none',
                    fontSize: 12, fontWeight: 600,
                  }}>
                    {!isAdd && '#'}{tag === '+' ? 'Tag hinzufügen' : tag}
                    {!isAdd && (
                      <div style={{ width: 16, height: 16, borderRadius: 8, background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,153,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {FCIco.x(10, t.accent)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* deck selector */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Deck</div>
            <div style={{
              padding: 12, borderRadius: 14,
              background: t.surface, border: `1px solid ${t.border}`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ width: 22, height: 26, borderRadius: 5, background: t.accent }}/>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>EC2 & Compute</div>
              {FCIco.chevDn(16, t.textMuted)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 1D — AI-Review Sheet (90% height, streaming card list)
// ─────────────────────────────────────────────────────────
function AIReviewSheet({ dark, streaming = true }) {
  const t = fcTheme(dark);

  const cards = [
    { front: 'Was unterscheidet S3 Standard-IA von Glacier Instant Retrieval?',
      back:  'IA: Sekunden-Zugriff, ~30d min · Glacier IR: ms-Zugriff, 90d min, günstiger.',
      tags: ['s3','storage','tiering'], status: 'ready' },
    { front: 'Welcher AWS-Service implementiert Layer-7-Routing für HTTP/HTTPS?',
      back:  'Application Load Balancer (ALB) · Path-/Host-/Header-Based Routing.',
      tags: ['elb','networking'], status: 'ready' },
    { front: 'Wozu dient ein VPC Endpoint vom Typ Gateway?',
      back:  'Privater Zugriff auf S3 oder DynamoDB ohne Internet — über Route-Table-Eintrag.',
      tags: ['vpc','endpoints'], status: 'editing' },
    { front: 'Was ist der Unterschied zwischen IAM Role und IAM User?',
      back:  null, // streaming
      tags: ['iam'], status: 'streaming' },
    { front: null, back: null, tags: [], status: 'skeleton' },
  ];

  return (
    <div style={{ background: t.bgGrad, height: '100%', position: 'relative', fontFamily: FCfont, color: t.text, overflow: 'hidden' }}>
      {/* dim background */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4, filter: 'blur(2px)' }}>
        <div style={{ padding: '60px 20px 14px' }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>Flashcards</div>
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(3px)' }}/>

      {/* SHEET — 90% height */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '90%',
        background: t.bg,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        boxShadow: '0 -8px 40px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 6 }}>
          <div style={{ width: 38, height: 4, borderRadius: 2, background: t.borderStrong }}/>
        </div>

        {/* header */}
        <div style={{ padding: '8px 18px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 11,
              background: `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(255,153,0,0.35)',
            }}>{FCIco.sparkle(20, '#fff')}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>Karten aus 5 Fehlern generieren</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                {streaming && (
                  <span style={{ display: 'inline-flex', gap: 2 }}>
                    <span style={{ width: 4, height: 4, borderRadius: 2, background: t.accent, animation: 'fcdot 1.2s 0s infinite' }}/>
                    <span style={{ width: 4, height: 4, borderRadius: 2, background: t.accent, animation: 'fcdot 1.2s .15s infinite' }}/>
                    <span style={{ width: 4, height: 4, borderRadius: 2, background: t.accent, animation: 'fcdot 1.2s .3s infinite' }}/>
                  </span>
                )}
                {streaming ? 'Streaming · 4 von 5 Vorschlägen' : '5 Vorschläge bereit'}
              </div>
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{FCIco.close(16, t.textMuted)}</div>
          </div>
        </div>

        {/* card list */}
        <div style={{ flex: 1, overflow: 'auto', padding: '4px 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cards.map((c, i) => {
            if (c.status === 'skeleton') {
              return (
                <div key={i} style={{
                  padding: 14, borderRadius: 14,
                  background: t.surface, border: `1px solid ${t.border}`,
                  display: 'flex', flexDirection: 'column', gap: 7,
                }}>
                  <div style={{ height: 12, borderRadius: 6, background: dark ? 'rgba(148,163,184,0.12)' : '#F1F5F9', width: '85%', backgroundImage: 'linear-gradient(90deg, transparent 0, rgba(255,255,255,0.5) 50%, transparent 100%)', backgroundSize: '200% 100%', animation: 'fcshimmer 1.4s infinite' }}/>
                  <div style={{ height: 10, borderRadius: 5, background: dark ? 'rgba(148,163,184,0.08)' : '#F8FAFC', width: '60%' }}/>
                  <div style={{ height: 10, borderRadius: 5, background: dark ? 'rgba(148,163,184,0.08)' : '#F8FAFC', width: '70%' }}/>
                </div>
              );
            }

            const isStreaming = c.status === 'streaming';
            const isEditing = c.status === 'editing';
            return (
              <div key={i} style={{
                padding: 14, borderRadius: 14,
                background: t.surface,
                border: `1px solid ${isEditing ? t.accent : t.border}`,
                display: 'flex', gap: 10, alignItems: 'flex-start',
                opacity: isStreaming ? 0.95 : 1,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.35, color: t.text }}>{c.front}</div>
                  {c.back ? (
                    <div style={{ fontSize: 12, color: t.textMuted, marginTop: 5, lineHeight: 1.5 }}>{c.back}</div>
                  ) : (
                    <div style={{ marginTop: 7, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ height: 8, borderRadius: 4, background: dark ? 'rgba(148,163,184,0.16)' : '#F1F5F9', width: '90%', backgroundImage: 'linear-gradient(90deg, transparent 0, rgba(255,153,0,0.3) 50%, transparent 100%)', backgroundSize: '200% 100%', animation: 'fcshimmer 1.4s infinite' }}/>
                      <div style={{ height: 8, borderRadius: 4, background: dark ? 'rgba(148,163,184,0.10)' : '#F8FAFC', width: '60%' }}/>
                    </div>
                  )}
                  {c.tags.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {c.tags.map(tag => (
                        <span key={tag} style={{
                          fontSize: 10, padding: '2px 7px', borderRadius: 999,
                          background: t.accentSoft, color: t.accent, fontWeight: 600,
                        }}>#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                {/* actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                  {isStreaming ? (
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 14, height: 14, borderRadius: 7, border: `2px solid ${t.accent}`, borderTopColor: 'transparent', animation: 'fcspin 0.8s linear infinite' }}/>
                    </div>
                  ) : (
                    <>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: t.greenSoft, color: t.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{FCIco.check(15, t.green)}</div>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: t.bg2, color: t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{FCIco.edit(13, t.textMuted)}</div>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: t.redSoft, color: t.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{FCIco.x(14, t.red)}</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div style={{
          padding: '12px 18px 24px',
          borderTop: `1px solid ${t.border}`,
          background: t.bg,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <button style={{
            width: '100%', height: 50, borderRadius: 14, border: 'none',
            background: t.accent, color: '#fff', fontSize: 14, fontWeight: 700,
            fontFamily: FCfont, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: dark ? 'none' : '0 8px 24px rgba(255,153,0,0.35)',
          }}>
            {FCIco.check(18, '#fff')}
            3 Karten in „Meine Fehler" speichern
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fcshimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes fcspin { to { transform: rotate(360deg); } }
        @keyframes fcdot { 0%, 60%, 100% { opacity: 0.3; } 30% { opacity: 1; } }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 2 — AWS Service Mindmap
// ─────────────────────────────────────────────────────────
const MINDMAP = [
  { id: 'compute',    label: 'Compute',     hue: 32,  services: ['EC2','Lambda','ECS','Fargate','Batch','Lightsail'] },
  { id: 'storage',    label: 'Storage',     hue: 200, services: ['S3','EBS','EFS','FSx','Storage Gateway'] },
  { id: 'database',   label: 'Database',    hue: 270, services: ['RDS','DynamoDB','Aurora','ElastiCache'] },
  { id: 'networking', label: 'Networking',  hue: 145, services: ['VPC','Route 53','CloudFront','API Gateway','Direct Connect'] },
  { id: 'security',   label: 'Security',    hue: 0,   services: ['IAM','KMS','Cognito','WAF','Shield','GuardDuty'] },
  { id: 'monitoring', label: 'Monitoring',  hue: 220, services: ['CloudWatch','X-Ray','CloudTrail'] },
  { id: 'devops',     label: 'DevOps',      hue: 310, services: ['CodeCommit','CodeBuild','CodeDeploy','CodePipeline'] },
  { id: 'analytics',  label: 'Analytics',   hue: 175, services: ['Athena','Kinesis','Redshift','Glue'] },
  { id: 'mlai',       label: 'AI / ML',     hue: 50,  services: ['SageMaker','Rekognition','Polly','Translate'] },
  { id: 'app',        label: 'App Integ.',  hue: 100, services: ['SNS','SQS','EventBridge','Step Functions'] },
  { id: 'mgmt',       label: 'Management',  hue: 250, services: ['CloudFormation','Organizations','Trusted Advisor','Control Tower'] },
];

// Cluster bubble positions on a 360x600 logical canvas (centered around root)
const CLUSTER_POS = [
  { x: 180, y: 100 }, { x: 300, y: 150 }, { x: 320, y: 290 },
  { x: 280, y: 430 }, { x: 175, y: 500 }, { x:  70, y: 450 },
  { x:  35, y: 320 }, { x:  60, y: 175 }, { x: 240, y:  60 },
  { x:  90, y:  90 }, { x: 175, y: 340 }, // last replaced by spread
];

function MindmapScreen({ dark, sheetOpen = false, focusedCluster = null }) {
  const t = fcTheme(dark);

  // Better radial layout — 11 clusters on two rings around the root.
  const cx = 188, cy = 360;
  const ring1 = { r: 130, count: 5, start: -Math.PI / 2 };
  const ring2 = { r: 230, count: 6, start: -Math.PI / 2 + Math.PI / 6 };
  const positions = [];
  for (let i = 0; i < ring1.count; i++) {
    const a = ring1.start + (i * 2 * Math.PI) / ring1.count;
    positions.push({ x: cx + ring1.r * Math.cos(a), y: cy + ring1.r * Math.sin(a) });
  }
  for (let i = 0; i < ring2.count; i++) {
    const a = ring2.start + (i * 2 * Math.PI) / ring2.count;
    positions.push({ x: cx + ring2.r * Math.cos(a), y: cy + ring2.r * Math.sin(a) });
  }

  const clusterColor = (hue) => dark
    ? `oklch(0.62 0.14 ${hue})`
    : `oklch(0.6 0.15 ${hue})`;
  const clusterBg = (hue) => dark
    ? `oklch(0.32 0.08 ${hue})`
    : `oklch(0.96 0.04 ${hue})`;

  // pre-compute cluster centers
  const clusters = MINDMAP.map((c, i) => ({ ...c, ...positions[i] }));

  return (
    <div style={{ background: t.bgGrad, height: '100%', display: 'flex', flexDirection: 'column', fontFamily: FCfont, color: t.text, position: 'relative', overflow: 'hidden' }}>
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
          <div style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {FCIco.back(18, t.text)}
          </div>
          <div style={{
            flex: 1, height: 40, borderRadius: 12,
            background: t.surface, border: `1px solid ${t.border}`,
            display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
            boxShadow: dark ? 'none' : '0 1px 2px rgba(15,23,42,0.04)',
          }}>
            {FCIco.search(16, t.textMuted)}
            <span style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>Service oder Topic suchen…</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: t.bg2, color: t.textMuted, fontFamily: FCmono, fontWeight: 600 }}>11 / 47</span>
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 0.4, paddingLeft: 4 }}>
          AWS CLOUD PRACTITIONER · 11 Themen · 47 Services
        </div>
      </div>

      {/* CANVAS */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* dotted grid */}
        <div style={{
          position: 'absolute', inset: -80,
          backgroundImage: `radial-gradient(${dark ? 'rgba(148,163,184,0.08)' : 'rgba(15,23,42,0.06)'} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          opacity: 0.7,
        }}/>

        {/* SVG edges + bubbles */}
        <svg viewBox="0 0 376 720" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
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

          {/* edges root → clusters */}
          {clusters.map((c, i) => (
            <line key={`e-${i}`} x1={cx} y1={cy} x2={c.x} y2={c.y}
              stroke={dark ? 'rgba(148,163,184,0.18)' : 'rgba(15,23,42,0.12)'}
              strokeWidth="1.5" strokeDasharray="3 3"/>
          ))}

          {/* leaf nodes — small, neutral */}
          {clusters.map((c, ci) => {
            const isFocused = focusedCluster === c.id;
            return c.services.slice(0, isFocused ? 6 : 0).map((s, si) => {
              const angle = (si / Math.max(c.services.length, 1)) * 2 * Math.PI - Math.PI / 2;
              const lr = 52;
              const lx = c.x + lr * Math.cos(angle);
              const ly = c.y + lr * Math.sin(angle);
              return (
                <g key={`l-${ci}-${si}`}>
                  <line x1={c.x} y1={c.y} x2={lx} y2={ly}
                    stroke={clusterColor(c.hue)} strokeWidth="1" strokeOpacity="0.5"/>
                  <rect x={lx - 22} y={ly - 9} width="44" height="18" rx="9"
                    fill={dark ? FCslate800 : '#fff'} stroke={clusterColor(c.hue)} strokeWidth="1"/>
                  <text x={lx} y={ly + 3.5} fontSize="9" fontWeight="600" textAnchor="middle"
                    fill={dark ? '#F8FAFC' : FCslate700}
                    fontFamily="'Inter',sans-serif">{s}</text>
                </g>
              );
            });
          })}

          {/* cluster bubbles */}
          {clusters.map((c, i) => {
            const r = 38;
            const isFocused = focusedCluster === c.id;
            return (
              <g key={c.id} style={{ cursor: 'pointer' }}>
                <circle cx={c.x} cy={c.y} r={r + 4}
                  fill={clusterColor(c.hue)} fillOpacity={isFocused ? 0.25 : 0.12}/>
                <circle cx={c.x} cy={c.y} r={r}
                  fill={clusterBg(c.hue)}
                  stroke={clusterColor(c.hue)}
                  strokeWidth={isFocused ? 2 : 1.5}/>
                <text x={c.x} y={c.y - 2} fontSize="11" fontWeight="700" textAnchor="middle"
                  fill={clusterColor(c.hue)} fontFamily="'Inter',sans-serif">{c.label}</text>
                <text x={c.x} y={c.y + 11} fontSize="9" fontWeight="600" textAnchor="middle"
                  fill={clusterColor(c.hue)} fillOpacity="0.7" fontFamily="'Inter',sans-serif">
                  {c.services.length} Services
                </text>
              </g>
            );
          })}

          {/* root node */}
          <circle cx={cx} cy={cy} r="50" fill="url(#rootGrad)" filter="url(#rootGlow)"/>
          <circle cx={cx} cy={cy} r="50" fill="url(#rootGrad)"/>
          <text x={cx} y={cy - 6} fontSize="11" fontWeight="700" textAnchor="middle" fill="#fff" fontFamily="'Inter',sans-serif">AWS Cloud</text>
          <text x={cx} y={cy + 8} fontSize="11" fontWeight="700" textAnchor="middle" fill="#fff" fontFamily="'Inter',sans-serif">Practitioner</text>
          <text x={cx} y={cy + 22} fontSize="8" fontWeight="600" textAnchor="middle" fill="#fff" fillOpacity="0.7" fontFamily="'Inter',sans-serif">CLF-C02</text>
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
            {/* tiny dots representing clusters */}
            {clusters.map((c, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${(c.x / 376) * 100}%`,
                top: `${(c.y / 720) * 100}%`,
                width: 6, height: 6, borderRadius: 3,
                background: clusterColor(c.hue), transform: 'translate(-50%, -50%)',
              }}/>
            ))}
            {/* center root */}
            <div style={{
              position: 'absolute', left: `${(cx/376)*100}%`, top: `${(cy/720)*100}%`,
              width: 9, height: 9, borderRadius: 5, background: t.accent,
              transform: 'translate(-50%, -50%)', boxShadow: `0 0 6px ${t.accent}`,
            }}/>
            {/* viewport rect */}
            <div style={{
              position: 'absolute', left: '20%', top: '24%', width: '56%', height: '52%',
              border: `1.5px solid ${t.accent}`, borderRadius: 3,
            }}/>
          </div>
        </div>

        {/* zoom controls */}
        <div style={{
          position: 'absolute', bottom: 122, right: 16,
          background: dark ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.85)',
          border: `1px solid ${t.border}`,
          backdropFilter: 'blur(12px)',
          borderRadius: 10, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        }}>
          <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${t.border}` }}>
            {FCIco.plus2(16, t.text)}
          </div>
          <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${t.border}` }}>
            {FCIco.minus(16, t.text)}
          </div>
          <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: t.text }}>
            {FCIco.target(15, t.text)}
          </div>
        </div>
      </div>

      {/* Service detail bottom-sheet */}
      {sheetOpen && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40,
          background: t.bg,
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
          padding: '8px 18px 24px',
          borderTop: `1px solid ${t.border}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 6 }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: t.borderStrong }}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: clusterBg(32), border: `1.5px solid ${clusterColor(32)}`,
              color: clusterColor(32), display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, fontFamily: FCmono,
            }}>EC2</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.2 }}>Elastic Compute Cloud</div>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginTop: 2 }}>Compute · Domain 2</div>
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: t.textMuted, lineHeight: 1.5 }}>
            Virtuelle Server in der Cloud — minutengenaue Abrechnung, vier Preismodelle (On-Demand, Reserved, Spot, Savings Plans).
          </div>
          <button style={{
            marginTop: 14, width: '100%', height: 46, borderRadius: 12, border: 'none',
            background: t.accent, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>Im Modul lernen {FCIco.chev(15, '#fff')}</button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  DecksOverview, ReviewScreen, CardEditorSheet, AIReviewSheet, MindmapScreen,
  fcTheme,
});
