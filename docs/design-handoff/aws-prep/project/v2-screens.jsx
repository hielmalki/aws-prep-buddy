// v2-screens.jsx — Cozy Study-Café × Skill-Tree × bold
// Warm paper palette + analog texture + experimental layouts.

const V2 = {
  paper: '#F5EDE0',
  paperDark: '#EDE1CC',
  cream: '#FFFBF2',
  ink: '#1E140A',
  ink2: '#3D2E1F',
  muted: '#8B7355',
  subtle: '#C9B89A',
  line: 'rgba(30,20,10,0.12)',
  lineStrong: 'rgba(30,20,10,0.22)',
  ember: '#E76F00',
  emberSoft: '#FFD9A8',
  emberDeep: '#A84800',
  moss: '#6B8E4E',
  mossSoft: '#D4E0C0',
  berry: '#B8434C',
  berrySoft: '#F5D5D8',
  gold: '#D4A73E',
  goldSoft: '#F5E6B8',
};

const serif = `'Fraunces', 'Playfair Display', Georgia, serif`;
const sans = `'Inter', -apple-system, system-ui, sans-serif`;
const handwrite = `'Caveat', 'Comic Sans MS', cursive`;
const monoV2 = `'JetBrains Mono', Menlo, monospace`;

// Paper texture — subtle noise via SVG
const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.15 0 0 0 0 0.08 0 0 0 0 0.03 0 0 0 0.07 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Ico set for v2 (warm, slightly thicker stroke)
const V2Ico = {
  flame: (s,c=V2.ember) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z"/></svg>,
  coffee: (s,c=V2.ink2) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v2M14 2v2M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/></svg>,
  star: (s,c=V2.gold,fill='none') => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  sparkle: (s,c=V2.ember) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.9 2.1 8.7 5.2 5.6 6.4l3.1 1.2 1.2 3.1 1.2-3.1 3.1-1.2-3.1-1.2z"/><path d="M18 8v4M20 10h-4M16 18v3M17.5 19.5h-3"/></svg>,
  sword: (s,c=V2.ink2) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/></svg>,
  heart: (s,c=V2.berry,fill=V2.berry) => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  lock: (s,c=V2.muted) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  check: (s,c='#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x: (s,c='#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  chev: (s,c=V2.ink) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  chevDn: (s,c=V2.ink) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  send: (s,c='#fff') => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>,
  leaf: (s,c=V2.moss) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.3c1.7 5.7.5 13.3-3.2 17.1-1.4 1.4-3.2 2-5 2-1.4 0-2.8-.5-4-1.3"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>,
  robot: (s,c=V2.ember) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/></svg>,
  acorn: (s,c=V2.ember) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V9"/><path d="M5 9h14a2 2 0 0 0 0-4H5a2 2 0 0 0 0 4z"/><path d="M18 9c0 5-3 7-6 7s-6-2-6-7"/></svg>,
  bolt: (s,c=V2.gold) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="1.5" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  compass: (s,c=V2.ink) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
};

// ─── Paper Card ─────────────────────────────────────────
function Paper({ children, style = {}, raised, tilt = 0, tape }) {
  return (
    <div style={{
      position: 'relative',
      background: V2.cream,
      borderRadius: 4,
      border: `1px solid ${V2.line}`,
      boxShadow: raised
        ? '0 1px 0 rgba(30,20,10,0.04), 0 8px 20px rgba(30,20,10,0.08), 0 2px 4px rgba(30,20,10,0.04)'
        : '0 1px 2px rgba(30,20,10,0.06)',
      transform: tilt ? `rotate(${tilt}deg)` : undefined,
      ...style,
    }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 4, pointerEvents: 'none',
        backgroundImage: PAPER_TEX, mixBlendMode: 'multiply', opacity: 0.6,
      }}/>
      {tape && (
        <div style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
          width: 72, height: 20, background: 'rgba(212,167,62,0.5)',
          border: '1px dashed rgba(168,72,0,0.25)', borderRadius: 2,
          boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
        }}/>
      )}
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}

function StampLabel({ children, color = V2.ember }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px',
      border: `1.5px solid ${color}`, borderRadius: 3,
      color, fontSize: 10, fontWeight: 800, letterSpacing: 2,
      textTransform: 'uppercase', fontFamily: sans,
      transform: 'rotate(-1deg)',
    }}>{children}</div>
  );
}

// ─── Home: Library desk metaphor ────────────────────────
function V2Home({ onNav }) {
  const [coffee, setCoffee] = React.useState(60);
  React.useEffect(() => {
    const id = setInterval(() => setCoffee(c => c > 10 ? c - 0.3 : c), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      background: V2.paper, height: '100%', overflow: 'auto',
      fontFamily: sans, color: V2.ink,
      backgroundImage: `${PAPER_TEX}, radial-gradient(120% 80% at 0% 0%, ${V2.emberSoft}60 0%, transparent 40%)`,
    }}>
      {/* Masthead — newspaper-style */}
      <div style={{ padding: '58px 22px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: V2.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, borderBottom: `1px solid ${V2.line}`, paddingBottom: 8 }}>
          <span>Dienstag · 22.04</span>
          <span>Exam in 23 Tagen</span>
        </div>
        <div style={{ fontFamily: serif, fontSize: 44, fontWeight: 400, lineHeight: 0.95, letterSpacing: -1.2, marginTop: 14, fontStyle: 'italic' }}>
          Guten<br/>Morgen, Jan.
        </div>
        <div style={{ fontSize: 14, color: V2.muted, marginTop: 8, fontFamily: serif, fontStyle: 'italic' }}>
          — Heute ein kleiner Schritt Richtung Wolke.
        </div>
      </div>

      {/* Coffee ritual + streak */}
      <div style={{ padding: '10px 22px 0', display: 'flex', gap: 10 }}>
        <Paper raised style={{ flex: 1, padding: 14 }}>
          <div style={{ fontSize: 10, color: V2.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>Kaffee-Tasse</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <svg width="32" height="40" viewBox="0 0 32 40">
              <path d="M4 8 Q4 6 6 6 H24 Q26 6 26 8 V26 Q26 34 16 34 Q6 34 6 26 Z" fill="none" stroke={V2.ink2} strokeWidth="1.5"/>
              <path d="M26 12 Q32 12 32 18 Q32 24 26 24" fill="none" stroke={V2.ink2} strokeWidth="1.5"/>
              <clipPath id="cup"><path d="M6 8 H26 V26 Q26 33 16 33 Q6 33 6 26 Z"/></clipPath>
              <rect x="4" y={8 + (26-8) * (1-coffee/100)} width="24" height="26" fill={V2.emberDeep} clipPath="url(#cup)" style={{ transition: 'y 0.5s' }}/>
              <path d="M12 2 Q14 0 12 -2 M16 2 Q18 0 16 -2 M20 2 Q22 0 20 -2" transform="translate(0 4)" stroke={V2.muted} strokeWidth="1.2" fill="none" opacity="0.6"/>
            </svg>
            <div>
              <div style={{ fontSize: 22, fontFamily: serif, fontWeight: 500, lineHeight: 1 }}>{Math.round(coffee/10)}<span style={{ color: V2.muted, fontSize: 14 }}>/10</span></div>
              <div style={{ fontSize: 10, color: V2.muted, marginTop: 2 }}>Fragen heute</div>
            </div>
          </div>
        </Paper>
        <Paper raised style={{ flex: 1, padding: 14, background: V2.emberSoft }}>
          <div style={{ fontSize: 10, color: V2.emberDeep, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>Streak</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
            <span style={{ fontFamily: serif, fontSize: 40, fontWeight: 500, color: V2.emberDeep, lineHeight: 0.9, letterSpacing: -1 }}>12</span>
            <span style={{ fontSize: 12, color: V2.emberDeep, fontStyle: 'italic', fontFamily: serif }}>Tage</span>
          </div>
          <div style={{ display: 'flex', gap: 3, marginTop: 10 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{
                width: 14, height: 14, borderRadius: 3,
                background: i < 6 ? V2.ember : 'rgba(255,255,255,0.6)',
                border: `1px solid ${V2.emberDeep}40`,
              }}/>
            ))}
          </div>
        </Paper>
      </div>

      {/* Today's Quest — hero card */}
      <div style={{ padding: '16px 22px 0' }}>
        <Paper raised tape style={{ padding: '22px 22px 18px' }}>
          <StampLabel>Heutige Quest</StampLabel>
          <div style={{ fontFamily: serif, fontSize: 28, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.1, marginTop: 14, fontStyle: 'italic' }}>
            "Der Speicher-Schwur"
          </div>
          <div style={{ fontSize: 13, color: V2.muted, marginTop: 6, lineHeight: 1.5 }}>
            10 Fragen rund um S3, EBS & EFS.
            <br/>Meistere sie alle für ein <strong style={{ color: V2.ember }}>Moss-Badge</strong>.
          </div>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => onNav && onNav('quiz')} style={{
              flex: 1, padding: '14px 18px', borderRadius: 4,
              border: 'none', background: V2.ink, color: V2.cream,
              fontSize: 14, fontWeight: 700, letterSpacing: 0.4, cursor: 'pointer',
              fontFamily: sans, textTransform: 'uppercase',
              boxShadow: `4px 4px 0 ${V2.ember}`, transition: 'all .15s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'translate(2px,2px)'}
            onMouseUp={e => e.currentTarget.style.transform = ''}
            onMouseLeave={e => e.currentTarget.style.transform = ''}>
              Annehmen →
            </button>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: V2.muted, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Belohnung</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                {V2Ico.bolt(14, V2.gold)}
                <span style={{ fontFamily: serif, fontSize: 16, fontWeight: 600 }}>+120 XP</span>
              </div>
            </div>
          </div>
        </Paper>
      </div>

      {/* Two small cards side by side */}
      <div style={{ padding: '14px 22px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button onClick={() => onNav && onNav('duel')} style={{ padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
          <Paper style={{ padding: 14, height: '100%' }}>
            <div style={{ width: 36, height: 36, borderRadius: 4, background: V2.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{V2Ico.sword(20, V2.ember)}</div>
            <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 500, fontStyle: 'italic', marginTop: 8 }}>AI-Duell</div>
            <div style={{ fontSize: 11, color: V2.muted, marginTop: 2 }}>Best of 5 · ~4 min</div>
            <div style={{ fontSize: 10, color: V2.moss, fontWeight: 700, marginTop: 6, letterSpacing: 1 }}>⚔ 3-2 FÜHRUNG</div>
          </Paper>
        </button>
        <button onClick={() => onNav && onNav('tree')} style={{ padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
          <Paper style={{ padding: 14, height: '100%' }}>
            <div style={{ width: 36, height: 36, borderRadius: 4, background: V2.mossSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{V2Ico.compass(20, V2.moss)}</div>
            <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 500, fontStyle: 'italic', marginTop: 8 }}>Skill-Garten</div>
            <div style={{ fontSize: 11, color: V2.muted, marginTop: 2 }}>4 neue Blüten</div>
            <div style={{ fontSize: 10, color: V2.muted, fontWeight: 600, marginTop: 6, letterSpacing: 1 }}>🌱 42% GEWACHSEN</div>
          </Paper>
        </button>
      </div>

      {/* Weak topic */}
      <div style={{ padding: '14px 22px 0' }}>
        <Paper style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, background: V2.berrySoft, border: `1px solid ${V2.berry}40` }}>
          <div style={{ fontSize: 28, transform: 'rotate(-6deg)' }}>🥀</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 500, color: V2.berry }}>VPC welkt</div>
            <div style={{ fontSize: 11, color: V2.ink2, marginTop: 2, lineHeight: 1.4 }}>Subnetting & Route Tables — gieße das Topic, bevor es vergeht.</div>
          </div>
          <div style={{ padding: '6px 10px', border: `1.5px solid ${V2.berry}`, borderRadius: 3, color: V2.berry, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>47%</div>
        </Paper>
      </div>

      {/* Poetic quote */}
      <div style={{ padding: '22px 22px 120px', textAlign: 'center' }}>
        <div style={{ fontFamily: handwrite, fontSize: 22, color: V2.muted, lineHeight: 1.2 }}>
          "Jede Frage ist ein Schluck Kaffee —<br/>nicht jeder bleibt gleich wach."
        </div>
        <div style={{ fontSize: 10, color: V2.muted, letterSpacing: 2, textTransform: 'uppercase', marginTop: 10, fontWeight: 600 }}>— Seneca, vermutlich</div>
      </div>

      <V2BottomNav active="home" onNav={onNav}/>
    </div>
  );
}

// ─── Bottom nav (5 ink stamps) ──────────────────────────
function V2BottomNav({ active, onNav }) {
  const items = [
    { id: 'home', label: 'Salon', icon: V2Ico.coffee },
    { id: 'tree', label: 'Garten', icon: V2Ico.compass },
    { id: 'quiz', label: 'Quiz', icon: V2Ico.sparkle },
    { id: 'duel', label: 'Duell', icon: V2Ico.sword },
    { id: 'profile', label: 'Du', icon: V2Ico.acorn },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '10px 16px 30px',
      background: `${V2.cream}ee`,
      backdropFilter: 'blur(8px)',
      borderTop: `1px solid ${V2.line}`,
      display: 'flex', justifyContent: 'space-around',
      backgroundImage: PAPER_TEX, backgroundBlendMode: 'multiply',
    }}>
      {items.map(it => {
        const on = it.id === active;
        return (
          <button key={it.id} onClick={() => onNav && onNav(it.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '4px 8px', fontFamily: sans, color: on ? V2.ember : V2.muted,
              position: 'relative',
            }}>
            {on && <div style={{ position: 'absolute', top: -6, width: 4, height: 4, borderRadius: 2, background: V2.ember }}/>}
            <div style={{ opacity: on ? 1 : 0.7 }}>{it.icon(22, on ? V2.ember : V2.ink2)}</div>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Skill Garden (tree/map) ────────────────────────────
function V2SkillGarden({ onNav }) {
  // Nodes positioned on an organic path. Colors: moss=mastered, ember=current, gold=available, muted=locked
  const nodes = [
    { id: 'iam', x: 50, y: 780, label: 'IAM', status: 'done', icon: '🔑' },
    { id: 'ec2', x: 25, y: 690, label: 'EC2', status: 'done', icon: '🖥' },
    { id: 's3',  x: 72, y: 610, label: 'S3',  status: 'done', icon: '📦' },
    { id: 'rds', x: 35, y: 525, label: 'RDS', status: 'current', icon: '🗄' },
    { id: 'vpc', x: 76, y: 440, label: 'VPC', status: 'available', icon: '🌐' },
    { id: 'lam', x: 30, y: 360, label: 'Lambda', status: 'locked', icon: '⚡' },
    { id: 'cw',  x: 70, y: 275, label: 'CloudWatch', status: 'locked', icon: '👁' },
    { id: 'org', x: 40, y: 190, label: 'Organisations', status: 'locked', icon: '🏛' },
    { id: 'exam', x: 50, y: 100, label: 'EXAM', status: 'exam', icon: '🏆' },
  ];
  const colorFor = (s) => s === 'done' ? V2.moss : s === 'current' ? V2.ember : s === 'available' ? V2.gold : V2.subtle;

  return (
    <div style={{
      background: V2.paper, height: '100%', overflow: 'auto', position: 'relative',
      fontFamily: sans, color: V2.ink,
      backgroundImage: `${PAPER_TEX}, radial-gradient(ellipse at 50% 100%, ${V2.mossSoft}80 0%, transparent 50%)`,
    }}>
      {/* Header */}
      <div style={{ padding: '58px 22px 12px', position: 'sticky', top: 0, zIndex: 5, background: `${V2.paper}f0`, backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10, color: V2.muted, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>Kapitel II</div>
            <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 500, fontStyle: 'italic', letterSpacing: -0.5 }}>Dein Skill-Garten</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: V2.muted, letterSpacing: 1, fontWeight: 600 }}>GEWACHSEN</div>
            <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 600, color: V2.moss, letterSpacing: -0.5 }}>42%</div>
          </div>
        </div>
      </div>

      {/* Garden canvas */}
      <div style={{ position: 'relative', height: 860, margin: '0 0 120px' }}>
        {/* organic winding path */}
        <svg viewBox="0 0 100 860" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path
            d="M 50 780 Q 10 740, 25 690 Q 50 650, 72 610 Q 85 570, 35 525 Q 15 485, 76 440 Q 90 400, 30 360 Q 10 320, 70 275 Q 90 235, 40 190 Q 10 140, 50 100"
            fill="none" stroke={V2.ember} strokeWidth="0.8" strokeDasharray="2 3" opacity="0.7"
          />
          {/* little sprouts along path */}
          {[{x:35,y:740},{x:55,y:650},{x:52,y:580},{x:55,y:480},{x:55,y:400},{x:55,y:320},{x:55,y:230},{x:25,y:150}].map((p, i) => (
            <g key={i}>
              <path d={`M ${p.x} ${p.y} q -2 -4 0 -6 M ${p.x} ${p.y} q 2 -4 0 -6`} stroke={V2.moss} strokeWidth="0.4" fill="none" opacity="0.5"/>
            </g>
          ))}
        </svg>

        {/* nodes */}
        {nodes.map(n => {
          const c = colorFor(n.status);
          const isExam = n.status === 'exam';
          const size = isExam ? 72 : n.status === 'current' ? 64 : 52;
          return (
            <div key={n.id} style={{
              position: 'absolute', left: `${n.x}%`, top: n.y,
              transform: 'translate(-50%, -50%)',
            }}>
              {n.status === 'current' && (
                <div style={{
                  position: 'absolute', inset: -8, borderRadius: '50%',
                  background: V2.ember, opacity: 0.25,
                  animation: 'pulse 2s infinite',
                }}/>
              )}
              <button onClick={() => n.status !== 'locked' && onNav && onNav('quiz')} disabled={n.status === 'locked'}
                style={{
                  width: size, height: size, borderRadius: '50%',
                  background: n.status === 'locked' ? V2.paperDark : V2.cream,
                  border: `2.5px solid ${c}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: n.status === 'locked' ? 'not-allowed' : 'pointer',
                  boxShadow: isExam
                    ? `0 6px 0 ${V2.goldSoft}, 0 8px 16px rgba(0,0,0,0.12)`
                    : `0 3px 0 ${c}40, 0 4px 10px rgba(0,0,0,0.08)`,
                  fontSize: isExam ? 30 : 22, position: 'relative', padding: 0,
                  transition: 'transform .15s',
                  filter: n.status === 'locked' ? 'grayscale(1) opacity(0.6)' : 'none',
                }}
                onMouseEnter={e => n.status !== 'locked' && (e.currentTarget.style.transform = 'scale(1.08)')}
                onMouseLeave={e => e.currentTarget.style.transform = ''}>
                {n.status === 'locked' ? V2Ico.lock(18, V2.muted) : n.icon}
                {n.status === 'done' && (
                  <div style={{
                    position: 'absolute', bottom: -4, right: -4,
                    width: 22, height: 22, borderRadius: '50%',
                    background: V2.moss, border: `2px solid ${V2.cream}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{V2Ico.check(12, '#fff')}</div>
                )}
              </button>
              {/* label tag */}
              <div style={{
                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                marginTop: 4, whiteSpace: 'nowrap',
                fontFamily: isExam ? serif : sans,
                fontSize: isExam ? 14 : 11,
                fontWeight: isExam ? 600 : 700,
                fontStyle: isExam ? 'italic' : 'normal',
                letterSpacing: isExam ? 0 : 1,
                textTransform: isExam ? 'none' : 'uppercase',
                color: n.status === 'locked' ? V2.muted : V2.ink,
              }}>{n.label}</div>
              {/* XP bubble on current */}
              {n.status === 'current' && (
                <div style={{
                  position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%) rotate(-4deg)',
                  marginBottom: 6, padding: '3px 8px',
                  background: V2.ink, color: V2.cream, borderRadius: 3,
                  fontSize: 10, fontWeight: 700, letterSpacing: 1, whiteSpace: 'nowrap',
                }}>HIER BIST DU
                  <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid ${V2.ink}` }}/>
                </div>
              )}
            </div>
          );
        })}

        {/* floating sprites */}
        <div style={{ position: 'absolute', left: '85%', top: 400, fontSize: 20, opacity: 0.5 }}>🦋</div>
        <div style={{ position: 'absolute', left: '8%', top: 550, fontSize: 16, opacity: 0.4 }}>🍄</div>
        <div style={{ position: 'absolute', left: '90%', top: 720, fontSize: 18, opacity: 0.4 }}>🌾</div>
      </div>

      <style>{`@keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.25; } 50% { transform: scale(1.3); opacity: 0; } }`}</style>
      <V2BottomNav active="tree" onNav={onNav}/>
    </div>
  );
}

// ─── Quiz with Ceremony ─────────────────────────────────
function V2Quiz({ onNav, onOpenTutor }) {
  const [picked, setPicked] = React.useState(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [ceremony, setCeremony] = React.useState(null); // 'correct' | 'wrong' | null
  const [combo, setCombo] = React.useState(3);
  const correct = 'B';

  const opts = [
    { k: 'A', text: 'Reserved Instances mit 3-Jahres-Commitment' },
    { k: 'B', text: 'Spot Instances für fehlertolerante Batch-Jobs' },
    { k: 'C', text: 'Dedicated Hosts, on-demand' },
    { k: 'D', text: 'Savings Plans auf EC2-Familie' },
  ];

  const submit = () => {
    if (!picked) return;
    const isRight = picked === correct;
    setSubmitted(true);
    setCeremony(isRight ? 'correct' : 'wrong');
    if (isRight) setCombo(c => c + 1);
  };
  const next = () => {
    setPicked(null); setSubmitted(false); setCeremony(null);
  };

  return (
    <div style={{
      background: V2.paper, height: '100%', overflow: 'hidden',
      fontFamily: sans, color: V2.ink, position: 'relative',
      backgroundImage: PAPER_TEX,
    }}>
      {/* Top bar — torn paper look */}
      <div style={{ padding: '56px 22px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => onNav && onNav('home')} style={{
          width: 34, height: 34, background: 'transparent', border: 'none',
          cursor: 'pointer', color: V2.ink, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'scaleX(-1)',
        }}>{V2Ico.chev(22, V2.ink)}</button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: V2.muted, letterSpacing: 2, fontWeight: 700 }}>FRAGE 4 / 20</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {V2Ico.flame(14, V2.ember)}
              <span style={{ fontFamily: serif, fontSize: 14, fontWeight: 600, color: V2.ember }}>×{combo}</span>
              <span style={{ fontSize: 9, color: V2.muted, letterSpacing: 1, fontWeight: 700, marginLeft: 4 }}>KOMBO</span>
            </div>
          </div>
          {/* dot progress */}
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i < 3 ? V2.moss : i === 3 ? V2.ember : V2.lineStrong,
              }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Question */}
      <div style={{ padding: '12px 22px 0' }}>
        <StampLabel color={V2.berry}>Szenario · Billing</StampLabel>
        <div style={{
          fontFamily: serif, fontSize: 24, fontWeight: 500, letterSpacing: -0.4,
          lineHeight: 1.25, marginTop: 16, color: V2.ink,
        }}>
          <span style={{ fontSize: 36, float: 'left', lineHeight: 0.9, marginRight: 8, marginTop: 2, fontStyle: 'italic', color: V2.ember }}>"</span>
          Ein Unternehmen hat einen verteilten Batch-Workload, der Unterbrechungen toleriert. Was ist die kostengünstigste Option?
        </div>
      </div>

      {/* Options */}
      <div style={{ padding: '22px 22px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {opts.map(o => {
          const isPicked = picked === o.k;
          const isRight = submitted && o.k === correct;
          const isWrong = submitted && isPicked && o.k !== correct;
          let bg = V2.cream, border = V2.line, badgeBg = V2.paperDark, badgeColor = V2.ink;
          if (!submitted && isPicked) { bg = V2.emberSoft; border = V2.ember; badgeBg = V2.ember; badgeColor = V2.cream; }
          if (isRight) { bg = V2.mossSoft; border = V2.moss; badgeBg = V2.moss; badgeColor = V2.cream; }
          if (isWrong) { bg = V2.berrySoft; border = V2.berry; badgeBg = V2.berry; badgeColor = V2.cream; }
          return (
            <button key={o.k} disabled={submitted} onClick={() => setPicked(o.k)}
              style={{
                textAlign: 'left', padding: '14px 14px', borderRadius: 4,
                background: bg, border: `1.5px solid ${border}`,
                cursor: submitted ? 'default' : 'pointer',
                display: 'flex', gap: 12, alignItems: 'center',
                fontFamily: sans, color: V2.ink,
                transform: isPicked && !submitted ? 'translateX(4px)' : 'none',
                transition: 'all .15s',
                position: 'relative', overflow: 'hidden',
              }}>
              <div style={{
                width: 32, height: 32, borderRadius: 4,
                background: badgeBg, color: badgeColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: serif, fontSize: 16, fontWeight: 600, fontStyle: 'italic',
                flexShrink: 0,
              }}>{isRight ? V2Ico.check(16) : isWrong ? V2Ico.x(16) : o.k}</div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 500, lineHeight: 1.4 }}>{o.text}</div>
            </button>
          );
        })}
      </div>

      {/* AI help button */}
      {!submitted && (
        <button onClick={onOpenTutor} style={{
          position: 'absolute', bottom: 88, left: 22, right: 22,
          padding: '11px 14px', borderRadius: 4,
          background: `${V2.cream}`,
          border: `1.5px dashed ${V2.ember}`,
          color: V2.ember, fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
          fontFamily: sans, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          textTransform: 'uppercase',
        }}>
          {V2Ico.sparkle(14, V2.ember)} Frag den Tutor
        </button>
      )}

      {/* Submit bar */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '10px 22px 24px', background: `${V2.paper}f0`, backdropFilter: 'blur(8px)',
        borderTop: `1px solid ${V2.line}`,
      }}>
        {!submitted ? (
          <button onClick={submit} disabled={!picked} style={{
            width: '100%', padding: '14px 18px', borderRadius: 4, border: 'none',
            background: picked ? V2.ink : V2.subtle,
            color: V2.cream, fontSize: 14, fontWeight: 700, letterSpacing: 1,
            fontFamily: sans, cursor: picked ? 'pointer' : 'not-allowed',
            textTransform: 'uppercase',
            boxShadow: picked ? `4px 4px 0 ${V2.ember}` : 'none',
            transition: 'all .15s',
          }}>Siegel aufdrücken</button>
        ) : (
          <button onClick={next} style={{
            width: '100%', padding: '14px 18px', borderRadius: 4, border: 'none',
            background: V2.ember, color: V2.cream, fontSize: 14, fontWeight: 700, letterSpacing: 1,
            fontFamily: sans, cursor: 'pointer', textTransform: 'uppercase',
            boxShadow: `4px 4px 0 ${V2.ink}`,
          }}>Nächste Frage →</button>
        )}
      </div>

      {/* Ceremony overlay */}
      {ceremony && <CeremonyOverlay kind={ceremony} combo={combo} onDismiss={() => setCeremony(null)}/>}
    </div>
  );
}

function CeremonyOverlay({ kind, combo, onDismiss }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);
  const isRight = kind === 'correct';

  return (
    <div onClick={onDismiss} style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: isRight ? `${V2.moss}cc` : `${V2.berry}cc`,
      backdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: mounted ? 1 : 0, transition: 'opacity .3s',
      color: V2.cream, textAlign: 'center', padding: 32,
      backgroundImage: PAPER_TEX, backgroundBlendMode: 'multiply',
    }}>
      {/* confetti */}
      {isRight && mounted && Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', top: '40%', left: '50%',
          width: 6, height: 14, background: [V2.gold, V2.ember, V2.cream, V2.mossSoft][i % 4],
          transform: `rotate(${Math.random() * 360}deg) translate(${(Math.random() - 0.5) * 500}px, ${(Math.random() - 0.5) * 500}px)`,
          transition: 'transform 1.2s ease-out',
          opacity: 0.9, borderRadius: 1,
        }}/>
      ))}

      <div style={{
        fontSize: 80, marginBottom: 14,
        transform: mounted ? 'scale(1) rotate(0)' : 'scale(0.2) rotate(-30deg)',
        transition: 'transform .5s cubic-bezier(.2,2,.3,1)',
      }}>{isRight ? '🎉' : '🌧'}</div>
      <div style={{
        fontFamily: serif, fontSize: 42, fontWeight: 500, fontStyle: 'italic',
        letterSpacing: -1, lineHeight: 1, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'transform .4s .1s',
      }}>{isRight ? 'Wunderbar!' : 'Knapp daneben.'}</div>
      <div style={{ fontSize: 14, marginTop: 10, opacity: 0.9, maxWidth: 260, lineHeight: 1.5, fontFamily: serif, fontStyle: 'italic' }}>
        {isRight
          ? `Kombo ×${combo} · die Bohnen duften.`
          : 'Die richtige Antwort war B — Spot Instances sind bis zu 90% günstiger.'}
      </div>
      <div style={{
        marginTop: 24, padding: '10px 16px',
        border: `2px solid ${V2.cream}`, borderRadius: 3,
        fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
      }}>{isRight ? `+${20 + combo * 5} XP` : '+5 XP für Mut'}</div>
      <div style={{ position: 'absolute', bottom: 40, fontSize: 11, letterSpacing: 2, opacity: 0.7, textTransform: 'uppercase', fontWeight: 600 }}>Tippen zum Fortfahren</div>
    </div>
  );
}

// ─── AI Duel ────────────────────────────────────────────
function V2Duel({ onNav }) {
  const [round, setRound] = React.useState(3);
  const [youScore, setYou] = React.useState(2);
  const [aiScore, setAi] = React.useState(1);
  const [phase, setPhase] = React.useState('play'); // play | answered
  const [lastYou, setLastYou] = React.useState(null);

  return (
    <div style={{
      background: `linear-gradient(180deg, ${V2.paperDark} 0%, ${V2.paper} 100%)`,
      height: '100%', overflow: 'hidden', fontFamily: sans, color: V2.ink, position: 'relative',
      backgroundImage: PAPER_TEX,
    }}>
      {/* top arena header */}
      <div style={{ padding: '56px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => onNav && onNav('home')} style={{ width: 34, height: 34, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, transform: 'scaleX(-1)' }}>{V2Ico.chev(22, V2.ink)}</button>
          <StampLabel color={V2.berry}>Runde {round} / 5</StampLabel>
          <div style={{ width: 34 }}/>
        </div>
      </div>

      {/* VS faces */}
      <div style={{ padding: '22px 22px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto',
            background: `linear-gradient(135deg, ${V2.ember} 0%, ${V2.gold} 100%)`,
            border: `3px solid ${V2.cream}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, boxShadow: `0 4px 0 ${V2.emberDeep}, 0 6px 14px rgba(0,0,0,0.15)`,
          }}>🧑‍🎓</div>
          <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 500, fontStyle: 'italic', marginTop: 8 }}>Jan</div>
          <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 600, color: V2.ember, letterSpacing: -1, lineHeight: 0.9 }}>{youScore}</div>
        </div>
        <div style={{ fontFamily: serif, fontSize: 22, fontStyle: 'italic', color: V2.muted, transform: 'rotate(-6deg)' }}>vs</div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto',
            background: `linear-gradient(135deg, ${V2.ink} 0%, ${V2.ink2} 100%)`,
            border: `3px solid ${V2.cream}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, color: V2.ember,
            boxShadow: `0 4px 0 ${V2.ink}, 0 6px 14px rgba(0,0,0,0.15)`,
          }}>{V2Ico.robot(32, V2.ember)}</div>
          <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 500, fontStyle: 'italic', marginTop: 8 }}>Claude</div>
          <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 600, color: V2.ink2, letterSpacing: -1, lineHeight: 0.9 }}>{aiScore}</div>
        </div>
      </div>

      {/* Speed timer bar */}
      <div style={{ padding: '18px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
          {V2Ico.bolt(12, V2.gold)}
          <span style={{ fontSize: 10, color: V2.muted, letterSpacing: 2, fontWeight: 700 }}>SCHNELLER = MEHR XP</span>
        </div>
        <div style={{ height: 6, background: V2.line, borderRadius: 3, marginTop: 8, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '62%', background: `linear-gradient(90deg, ${V2.moss} 0%, ${V2.gold} 70%, ${V2.ember} 100%)`, borderRadius: 3 }}/>
        </div>
      </div>

      {/* Question */}
      <div style={{ padding: '20px 22px 0' }}>
        <Paper raised style={{ padding: 18 }}>
          <div style={{ fontSize: 10, color: V2.muted, letterSpacing: 2, fontWeight: 700, textTransform: 'uppercase' }}>Blitz-Frage</div>
          <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 500, lineHeight: 1.3, marginTop: 8, letterSpacing: -0.2 }}>
            Welcher Service speichert Objekte mit 99.999999999% Haltbarkeit?
          </div>
        </Paper>
      </div>

      {/* 2x2 option grid */}
      <div style={{ padding: '14px 22px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { k: 'A', t: 'EBS' },
          { k: 'B', t: 'S3' },
          { k: 'C', t: 'EFS' },
          { k: 'D', t: 'RDS' },
        ].map(o => (
          <button key={o.k} onClick={() => setLastYou(o.k)}
            style={{
              padding: '18px 12px', borderRadius: 4,
              background: lastYou === o.k ? V2.ember : V2.cream,
              color: lastYou === o.k ? V2.cream : V2.ink,
              border: `1.5px solid ${lastYou === o.k ? V2.ember : V2.line}`,
              cursor: 'pointer', fontFamily: sans,
              textAlign: 'center',
            }}>
            <div style={{ fontSize: 10, letterSpacing: 2, opacity: 0.7, fontWeight: 700 }}>{o.k}</div>
            <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 600, marginTop: 4, letterSpacing: -0.3 }}>{o.t}</div>
          </button>
        ))}
      </div>

      {/* AI activity */}
      <div style={{ padding: '18px 22px 0' }}>
        <div style={{
          padding: '10px 14px', borderRadius: 4,
          background: V2.ink, color: V2.cream,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {[0,1,2].map(i => <span key={i} style={{ width: 4, height: 4, borderRadius: 2, background: V2.ember, animation: `dot2 1.2s ${i*0.15}s infinite` }}/>)}
          </div>
          <span style={{ fontSize: 11, letterSpacing: 1, fontWeight: 500 }}>Claude denkt nach…</span>
          <span style={{ marginLeft: 'auto', fontFamily: monoV2, fontSize: 11, color: V2.ember }}>2.3s</span>
        </div>
      </div>

      <style>{`@keyframes dot2 { 0%,60%,100% { opacity: .3; } 30% { opacity: 1; } }`}</style>
      <V2BottomNav active="duel" onNav={onNav}/>
    </div>
  );
}

// ─── AI Tutor (as duel companion / tutor chat) ─────────
function V2Tutor({ onNav }) {
  return (
    <div style={{
      background: V2.paper, height: '100%', overflow: 'hidden',
      fontFamily: sans, color: V2.ink, position: 'relative',
      backgroundImage: PAPER_TEX, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '56px 22px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => onNav && onNav('home')} style={{ width: 34, height: 34, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, transform: 'scaleX(-1)' }}>{V2Ico.chev(22, V2.ink)}</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 500, fontStyle: 'italic', letterSpacing: -0.3 }}>Tutor im Salon</div>
          <div style={{ fontSize: 11, color: V2.moss, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: V2.moss }}/> Claude · bereit zum Plaudern
          </div>
        </div>
        <div style={{ fontSize: 24 }}>☕</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 22px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* context */}
        <div style={{
          alignSelf: 'center', padding: '6px 12px',
          background: V2.cream, border: `1px dashed ${V2.lineStrong}`, borderRadius: 3,
          fontSize: 10, color: V2.muted, letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase',
        }}>— 4. April · Frage 4 —</div>

        {/* user */}
        <div style={{ alignSelf: 'flex-end', maxWidth: '82%' }}>
          <div style={{
            padding: '10px 14px', background: V2.ink, color: V2.cream,
            borderRadius: '12px 12px 2px 12px', fontSize: 13, lineHeight: 1.5,
          }}>
            Warum ist C falsch? Dedicated Hosts klingen doch günstig?
          </div>
        </div>

        {/* ai — styled like a letter */}
        <div style={{ alignSelf: 'flex-start', maxWidth: '90%' }}>
          <Paper style={{ padding: '12px 14px', borderRadius: '12px 12px 12px 2px' }}>
            <div style={{ fontFamily: serif, fontSize: 13, fontStyle: 'italic', color: V2.ember, fontWeight: 500, marginBottom: 6 }}>Lieber Jan,</div>
            <div style={{ fontSize: 13, lineHeight: 1.55, color: V2.ink }}>
              schöne Frage! Dedicated Hosts sind <strong>teurer</strong>, nicht günstiger — du zahlst die gesamte physische Maschine.
            </div>
            <div style={{ marginTop: 10, padding: '10px 12px', background: V2.paperDark, borderLeft: `3px solid ${V2.ember}`, fontFamily: monoV2, fontSize: 11, lineHeight: 1.7 }}>
              <div style={{ color: V2.muted }}># preis-hierarchie</div>
              <div>Spot     &lt; Savings  &lt; Reserved</div>
              <div>&lt; On-Demand &lt; <strong style={{ color: V2.ember }}>Dedicated</strong></div>
            </div>
            <div style={{ fontFamily: handwrite, fontSize: 18, color: V2.ember, marginTop: 10, lineHeight: 1 }}>— C.</div>
          </Paper>
        </div>

        {/* quick chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
          {['Merksatz?', 'Gib ein Beispiel', 'Erkläre wie für Kinder'].map(c => (
            <button key={c} style={{
              padding: '7px 12px', borderRadius: 3,
              background: 'transparent', border: `1px dashed ${V2.lineStrong}`,
              color: V2.ink2, fontSize: 11, fontWeight: 600, fontFamily: sans,
              cursor: 'pointer',
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* input */}
      <div style={{ padding: '12px 22px 30px', borderTop: `1px solid ${V2.line}`, background: V2.cream }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '4px 4px 4px 14px', borderRadius: 4,
          background: V2.paper, border: `1.5px solid ${V2.line}`,
        }}>
          <input placeholder="Schreib ins Buch…" style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: sans, fontSize: 14, padding: '10px 0', color: V2.ink,
          }}/>
          <button style={{
            width: 38, height: 38, borderRadius: 3, border: 'none',
            background: V2.ember, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{V2Ico.send(16, V2.cream)}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Learn ──────────────────────────────────────────────
function V2Learn({ onNav }) {
  return (
    <div style={{
      background: V2.paper, height: '100%', overflow: 'auto',
      fontFamily: sans, color: V2.ink,
      backgroundImage: PAPER_TEX,
    }}>
      <div style={{ padding: '54px 22px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => onNav && onNav('home')} style={{ width: 34, height: 34, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, transform: 'scaleX(-1)' }}>{V2Ico.chev(22, V2.ink)}</button>
        <div style={{ fontSize: 10, color: V2.muted, letterSpacing: 2, fontWeight: 700, textTransform: 'uppercase' }}>Kapitel 03 · Compute</div>
      </div>

      <div style={{ padding: '18px 22px 0' }}>
        {/* Big title w/ initial cap */}
        <div style={{ fontFamily: serif, fontSize: 12, color: V2.ember, letterSpacing: 3, fontWeight: 700, textTransform: 'uppercase' }}>Amazon</div>
        <div style={{
          fontFamily: serif, fontSize: 72, fontWeight: 500, letterSpacing: -3,
          lineHeight: 0.9, marginTop: 4, fontStyle: 'italic',
        }}>EC2<span style={{ fontSize: 24, fontStyle: 'normal', letterSpacing: -0.5, color: V2.muted }}>.</span></div>

        <div style={{ marginTop: 14, display: 'flex', gap: 16, fontSize: 11, color: V2.muted, letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase', borderTop: `1px solid ${V2.line}`, borderBottom: `1px solid ${V2.line}`, padding: '8px 0' }}>
          <span>12 min</span>
          <span>·</span>
          <span>8 Fragen</span>
          <span>·</span>
          <span style={{ color: V2.moss }}>Fundamentals</span>
        </div>

        {/* Body */}
        <div style={{ marginTop: 22, fontSize: 15, lineHeight: 1.7, color: V2.ink2, fontFamily: serif }}>
          <span style={{
            fontSize: 64, float: 'left', fontFamily: serif, fontWeight: 500,
            lineHeight: 0.8, marginRight: 8, marginTop: 6, color: V2.ember, fontStyle: 'italic',
          }}>E</span>lastic Compute Cloud ist AWS' Dienst für <em>virtuelle Server in der Wolke</em>. Du mietest Rechenleistung minutengenau — Starten, Stoppen, Skalieren per API.
        </div>

        {/* Key facts as a real callout */}
        <div style={{ marginTop: 20, position: 'relative' }}>
          <div style={{
            position: 'absolute', top: -14, left: 16,
            transform: 'rotate(-2deg)',
            padding: '4px 10px', background: V2.gold, color: V2.ink,
            fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase',
          }}>3 Dinge zu wissen</div>
          <Paper style={{ padding: '22px 18px 16px', background: V2.goldSoft }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['1', 'IaaS', 'Du managst OS & Apps selbst — AWS nur die Hardware.'],
                ['2', 'Pay-per-Second', 'Linux: sekundengenau · Windows: stundengenau.'],
                ['3', 'Region → AZ → Instance', 'Immer dieser Aufbau.'],
              ].map(([n, t, d]) => (
                <div key={n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 11, flexShrink: 0,
                    background: V2.ink, color: V2.gold,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: serif, fontSize: 12, fontWeight: 700,
                  }}>{n}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 600, fontStyle: 'italic', color: V2.ink, letterSpacing: -0.2 }}>{t}</div>
                    <div style={{ fontSize: 12, color: V2.ink2, marginTop: 1, lineHeight: 1.45 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Paper>
        </div>

        {/* Code snippet styled as typewriter */}
        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 500, fontStyle: 'italic' }}>Auf der Kommandozeile</div>
          <div style={{
            marginTop: 8, padding: '14px 16px', borderRadius: 3,
            background: V2.ink, color: V2.cream, fontFamily: monoV2, fontSize: 11, lineHeight: 1.7,
            border: `1px solid ${V2.ink}`,
          }}>
            <div style={{ color: V2.subtle }}># Start a t3.micro instance</div>
            <div><span style={{ color: V2.ember }}>aws</span> ec2 run-instances <span style={{ color: V2.muted }}>\</span></div>
            <div>  <span style={{ color: V2.gold }}>--image-id</span> ami-0abc123</div>
            <div>  <span style={{ color: V2.gold }}>--instance-type</span> t3.micro</div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 22 }}>
          <Paper raised style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, background: V2.emberSoft }}>
            <div style={{ fontSize: 36 }}>✍</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 600, fontStyle: 'italic', letterSpacing: -0.2 }}>Prüfe dein Wissen</div>
              <div style={{ fontSize: 11, color: V2.ink2, marginTop: 2 }}>10 Fragen · ~6 Minuten</div>
            </div>
            <button onClick={() => onNav && onNav('quiz')} style={{
              padding: '10px 14px', borderRadius: 3, border: 'none',
              background: V2.ink, color: V2.cream, fontSize: 11, fontWeight: 700, letterSpacing: 1,
              fontFamily: sans, cursor: 'pointer', textTransform: 'uppercase',
              boxShadow: `3px 3px 0 ${V2.emberDeep}`,
            }}>Start →</button>
          </Paper>
        </div>

        <div style={{ height: 120 }}/>
      </div>
    </div>
  );
}

// ─── Profile ────────────────────────────────────────────
function V2Profile({ onNav }) {
  const badges = [
    { icon: '☕', label: 'Erste Tasse', won: true },
    { icon: '🔥', label: '7-Tage Feuer', won: true },
    { icon: '🌱', label: 'IAM Keimling', won: true },
    { icon: '⚔', label: 'Duell-Sieger', won: true },
    { icon: '📦', label: 'S3 Meister', won: true },
    { icon: '🎯', label: 'Perfekt-Lauf', won: false },
    { icon: '🦉', label: 'Nacht-Eule', won: false },
    { icon: '🏆', label: 'Exam bestanden', won: false },
  ];
  return (
    <div style={{
      background: V2.paper, height: '100%', overflow: 'auto',
      fontFamily: sans, color: V2.ink,
      backgroundImage: PAPER_TEX,
    }}>
      <div style={{ padding: '54px 22px 0' }}>
        <div style={{ fontSize: 10, color: V2.muted, letterSpacing: 2, fontWeight: 700, textTransform: 'uppercase' }}>Dein Pass</div>
      </div>

      {/* Passport card */}
      <div style={{ padding: '14px 22px 0' }}>
        <Paper raised tilt={-1} style={{ padding: 18, background: `linear-gradient(135deg, ${V2.cream} 0%, ${V2.emberSoft} 100%)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 68, height: 68, borderRadius: '50%',
              background: V2.ember, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, border: `3px solid ${V2.cream}`,
              boxShadow: `0 3px 0 ${V2.emberDeep}`,
            }}>🧑‍🎓</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 500, fontStyle: 'italic', letterSpacing: -0.3, lineHeight: 1 }}>Jan Müller</div>
              <div style={{ fontSize: 11, color: V2.muted, marginTop: 4, letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase' }}>Rang · Cloud Wanderer</div>
              <div style={{ marginTop: 6, height: 5, background: 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '68%', height: '100%', background: V2.ember }}/>
              </div>
              <div style={{ fontSize: 10, color: V2.muted, marginTop: 3, fontWeight: 600 }}>Level 7 · 680/1000 XP</div>
            </div>
          </div>
          <div style={{
            position: 'absolute', bottom: 10, right: 12,
            width: 60, height: 60, borderRadius: '50%',
            border: `2px solid ${V2.emberDeep}50`, opacity: 0.3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: serif, fontSize: 10, color: V2.emberDeep,
            transform: 'rotate(-14deg)', fontWeight: 700, letterSpacing: 1,
          }}>APB · 2026</div>
        </Paper>
      </div>

      {/* Stats trio */}
      <div style={{ padding: '14px 22px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[
          { n: '412', l: 'Fragen', c: V2.ink },
          { n: '78%', l: 'Ø Score', c: V2.moss },
          { n: '8h22', l: 'Gelernt', c: V2.ember },
        ].map(s => (
          <Paper key={s.l} style={{ padding: 12, textAlign: 'center' }}>
            <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 600, color: s.c, letterSpacing: -0.5 }}>{s.n}</div>
            <div style={{ fontSize: 10, color: V2.muted, letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase' }}>{s.l}</div>
          </Paper>
        ))}
      </div>

      {/* Badges — as stamps on a passport page */}
      <div style={{ padding: '22px 22px 0' }}>
        <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 500, fontStyle: 'italic', letterSpacing: -0.3 }}>Stempel & Siegel</div>
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {badges.map((b, i) => (
            <div key={b.label} style={{ textAlign: 'center' }}>
              <div style={{
                width: 60, height: 60, margin: '0 auto',
                borderRadius: '50%', border: `2px dashed ${b.won ? V2.ember : V2.subtle}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, position: 'relative',
                filter: b.won ? 'none' : 'grayscale(1) opacity(0.3)',
                transform: `rotate(${(i % 2 ? -1 : 1) * (i + 1)}deg)`,
                background: b.won ? `${V2.emberSoft}60` : 'transparent',
              }}>
                {b.won ? b.icon : V2Ico.lock(20, V2.muted)}
              </div>
              <div style={{ fontSize: 10, color: b.won ? V2.ink : V2.muted, marginTop: 6, lineHeight: 1.2, fontWeight: b.won ? 600 : 500 }}>{b.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 120 }}/>
      <V2BottomNav active="profile" onNav={onNav}/>
    </div>
  );
}

// ─── Daily Challenge Feed ───────────────────────────────
function V2Daily({ onNav }) {
  const cards = [
    { tag: 'TÄGLICH', title: 'Erkenne die Falle', body: 'Welches davon ist KEIN Managed-Service?', variant: 'ember', emoji: '🪤', xp: 15 },
    { tag: 'KLASSIKER', title: 'Acronym-Roulette', body: 'Was bedeutet IAM?', variant: 'moss', emoji: '🎰', xp: 10 },
    { tag: 'BLITZ', title: '5 in 60 Sekunden', body: 'S3 Storage Classes nach Preis sortieren.', variant: 'gold', emoji: '⚡', xp: 40 },
    { tag: 'RÄTSEL', title: 'Architekt für einen Tag', body: 'Welche Architektur löst dieses Szenario?', variant: 'berry', emoji: '🏛', xp: 60 },
  ];

  const variantColor = {
    ember: V2.emberSoft, moss: V2.mossSoft, gold: V2.goldSoft, berry: V2.berrySoft,
  };
  const variantInk = {
    ember: V2.emberDeep, moss: V2.moss, gold: V2.ink2, berry: V2.berry,
  };

  return (
    <div style={{
      background: V2.paper, height: '100%', overflow: 'hidden',
      fontFamily: sans, color: V2.ink,
      backgroundImage: PAPER_TEX,
    }}>
      <div style={{ padding: '54px 22px 0' }}>
        <div style={{ fontSize: 10, color: V2.muted, letterSpacing: 2, fontWeight: 700, textTransform: 'uppercase' }}>Dienstag · 22.04</div>
        <div style={{ fontFamily: serif, fontSize: 34, fontWeight: 500, fontStyle: 'italic', letterSpacing: -0.8, marginTop: 6 }}>Die Kartenpost.</div>
        <div style={{ fontSize: 13, color: V2.muted, marginTop: 4, fontFamily: serif, fontStyle: 'italic' }}>— 4 neue Herausforderungen, 125 XP Gesamt.</div>
      </div>

      {/* scrollable card stack */}
      <div style={{ padding: '20px 12px 120px', overflow: 'auto', height: 'calc(100% - 180px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {cards.map((c, i) => (
            <button key={i} style={{
              padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
            }}>
              <Paper raised tilt={i % 2 === 0 ? -0.8 : 0.6} style={{ padding: '18px 18px 16px', background: variantColor[c.variant] }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ padding: '3px 8px', background: variantInk[c.variant], color: V2.cream, fontSize: 9, fontWeight: 800, letterSpacing: 2, borderRadius: 2 }}>{c.tag}</div>
                  <div style={{ fontSize: 32 }}>{c.emoji}</div>
                </div>
                <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 500, fontStyle: 'italic', letterSpacing: -0.4, marginTop: 8, color: variantInk[c.variant] }}>{c.title}</div>
                <div style={{ fontSize: 13, color: V2.ink2, marginTop: 4, lineHeight: 1.4 }}>{c.body}</div>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: variantInk[c.variant] }}>
                    {V2Ico.bolt(12, variantInk[c.variant])}
                    <span style={{ fontFamily: serif, fontSize: 14, fontWeight: 700 }}>+{c.xp} XP</span>
                  </div>
                  <div style={{ fontSize: 10, color: V2.ink2, letterSpacing: 1, fontWeight: 700, textTransform: 'uppercase' }}>Öffnen →</div>
                </div>
              </Paper>
            </button>
          ))}
        </div>
      </div>

      <V2BottomNav active="home" onNav={onNav}/>
    </div>
  );
}

Object.assign(window, {
  V2Home, V2SkillGarden, V2Quiz, V2Duel, V2Tutor, V2Learn, V2Profile, V2Daily, V2BottomNav, V2, PAPER_TEX,
});
