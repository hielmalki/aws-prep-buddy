// screens.jsx — AWS Prep Buddy mockup screens (original design)

const awsOrange = '#FF9900';
const slate900 = '#0F172A';
const slate800 = '#1E293B';
const slate700 = '#334155';
const slate600 = '#475569';
const slate400 = '#94A3B8';
const slate300 = '#CBD5E1';
const slate200 = '#E2E8F0';
const slate100 = '#F1F5F9';
const slate50  = '#F8FAFC';
const green400 = '#4ADE80';
const red400   = '#F87171';

// Icons — tiny inline SVG set, lucide-style (24/stroke:1.75)
const Ico = {
  flame: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z"/></svg>,
  home: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  book: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  quiz: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>,
  sett: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z"/><circle cx="12" cy="12" r="3"/></svg>,
  sparkle: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9.9 2.1 8.7 5.2 5.6 6.4l3.1 1.2 1.2 3.1 1.2-3.1 3.1-1.2-3.1-1.2z"/><path d="M18 8v4"/><path d="M20 10h-4"/><path d="M16 18v3"/><path d="M17.5 19.5h-3"/></svg>,
  chevron: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  chevronDown: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  close: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  send: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>,
  clip: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 17.93 8.8l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  check: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  cloud: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19a4.5 4.5 0 1 0-1.15-8.85 6 6 0 1 0-11.11 3.85"/><path d="M12 14v8"/><path d="m16 18-4 4-4-4"/></svg>,
  server: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>,
  target: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  sun: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>,
  moon: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
  clock: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  bolt: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  trophy: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
};

// ── Shared styles ───────────────────────────────────────
const baseFont = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
const mono = `'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace`;

function theme(dark) {
  return dark ? {
    bg: slate900,
    bg2: '#0B1120',
    surface: slate800,
    surface2: '#253349',
    border: 'rgba(148,163,184,0.14)',
    borderStrong: 'rgba(148,163,184,0.24)',
    text: '#F8FAFC',
    textMuted: slate400,
    textSubtle: slate600,
    accent: awsOrange,
    accentSoft: 'rgba(255,153,0,0.14)',
    green: green400,
    red: red400,
    navBg: 'rgba(15,23,42,0.85)',
  } : {
    bg: '#F8FAFC',
    bg2: '#EEF2F7',
    surface: '#FFFFFF',
    surface2: '#F8FAFC',
    border: 'rgba(15,23,42,0.08)',
    borderStrong: 'rgba(15,23,42,0.14)',
    text: slate900,
    textMuted: slate600,
    textSubtle: slate400,
    accent: '#E88800',
    accentSoft: 'rgba(255,153,0,0.12)',
    green: '#16A34A',
    red: '#DC2626',
    navBg: 'rgba(255,255,255,0.9)',
  };
}

function Chip({ children, color, bg, border }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 9px', borderRadius: 999,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.2,
      color, background: bg, border: `1px solid ${border || 'transparent'}`,
      fontFamily: baseFont,
    }}>{children}</span>
  );
}

function ProgressBar({ pct, t, h = 6 }) {
  return (
    <div style={{ height: h, width: '100%', borderRadius: 999, background: t.bg2, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${pct}%`,
        background: `linear-gradient(90deg, ${t.accent} 0%, #FFB545 100%)`,
        borderRadius: 999, transition: 'width .6s cubic-bezier(.2,.8,.2,1)',
      }} />
    </div>
  );
}

function ProgressRing({ pct, size = 96, stroke = 9, t }) {
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
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1 }}>6<span style={{ color: t.textMuted, fontSize: 14, fontWeight: 500 }}>/10</span></div>
        <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 600 }}>Fragen</div>
      </div>
    </div>
  );
}

// ── Bottom nav ──────────────────────────────────────────
function BottomNav({ active, onChange, t }) {
  const items = [
    { id: 'home', label: 'Home', icon: Ico.home },
    { id: 'learn', label: 'Learn', icon: Ico.book },
    { id: 'quiz', label: 'Quiz', icon: Ico.quiz },
    { id: 'settings', label: 'Du', icon: Ico.sett },
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
          <button key={it.id} onClick={() => onChange && onChange(it.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              minWidth: 56, padding: '6px 4px', color: col,
              fontFamily: baseFont, position: 'relative',
            }}>
            {on && <div style={{ position: 'absolute', top: -9, width: 24, height: 3, borderRadius: 2, background: t.accent }}/>}
            {it.icon(22, col)}
            <span style={{ fontSize: 10, fontWeight: on ? 700 : 500, letterSpacing: 0.2 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── 1. Home / Dashboard ─────────────────────────────────
function HomeScreen({ dark, onToggleDark, onNav }) {
  const t = theme(dark);
  const [ring, setRing] = React.useState(0);
  React.useEffect(() => { const id = setTimeout(() => setRing(60), 200); return () => clearTimeout(id); }, []);

  return (
    <div style={{ background: t.bg, height: '100%', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '64px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>Moin, Jan 👋</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, marginTop: 2 }}>AWS Prep Buddy</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onToggleDark}
            style={{ width: 38, height: 38, borderRadius: 12, border: `1px solid ${t.border}`, background: t.surface, color: t.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {dark ? Ico.sun(18, t.text) : Ico.moon(18, t.text)}
          </button>
        </div>
      </div>

      {/* scrollable content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 20px 120px' }}>
        {/* Streak + Goal card */}
        <div style={{
          background: dark ? `linear-gradient(135deg, ${slate800} 0%, #1B2A44 100%)` : '#FFFFFF',
          border: `1px solid ${t.border}`, borderRadius: 20,
          padding: 18, display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: dark ? 'none' : '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.04)',
        }}>
          <ProgressRing pct={ring} t={t} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 9px', borderRadius: 999, background: 'rgba(255,153,0,0.14)', color: t.accent, fontSize: 11, fontWeight: 700, letterSpacing: 0.3 }}>
              {Ico.flame(12, t.accent)} 12 TAGE STREAK
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 8, lineHeight: 1.3 }}>Heutiges Ziel</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>Noch 4 Fragen bis zur Flamme 🔥</div>
          </div>
        </div>

        {/* Section: Pick up */}
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>Weiter lernen</div>
          <div style={{ fontSize: 12, color: t.accent, fontWeight: 600 }}>Alle</div>
        </div>

        {/* Continue exam card */}
        <button onClick={() => onNav && onNav('quiz')} style={{ width: '100%', textAlign: 'left', border: 'none', padding: 0, background: 'transparent', cursor: 'pointer' }}>
        <div style={{
          marginTop: 10, background: t.surface,
          border: `1px solid ${t.border}`, borderRadius: 18, padding: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {Ico.target(22, t.accent)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Continue — Practice Exam 3</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>Frage 14 von 65 · ~25 min übrig</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.accent, letterSpacing: -0.5 }}>21%</div>
          </div>
          <div style={{ marginTop: 12 }}><ProgressBar pct={21} t={t}/></div>
        </div>
        </button>

        {/* Weak topic card */}
        <div style={{
          marginTop: 12, background: t.surface,
          border: `1px solid ${t.border}`, borderRadius: 18, padding: 16,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: dark ? 'rgba(248,113,113,0.12)' : '#FEE2E2', color: t.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {Ico.bolt(22, t.red)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Schwaches Topic: VPC</span>
              <Chip color={t.red} bg={dark ? 'rgba(248,113,113,0.12)' : '#FEE2E2'}>47%</Chip>
            </div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>Subnetting & Route Tables</div>
          </div>
          <button style={{
            padding: '8px 12px', borderRadius: 10, border: `1px solid ${t.borderStrong}`,
            background: t.surface2, color: t.text, fontSize: 12, fontWeight: 600,
            fontFamily: baseFont, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
          }}>Quiz {Ico.chevron(14, t.text)}</button>
        </div>

        {/* AI Tutor prominent */}
        <div style={{ marginTop: 24, fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>Hilfe holen</div>
        <div style={{
          marginTop: 10, position: 'relative', overflow: 'hidden',
          borderRadius: 20, padding: 18,
          background: dark
            ? `radial-gradient(120% 90% at 0% 0%, rgba(255,153,0,0.35) 0%, transparent 55%), linear-gradient(135deg, #1B2541 0%, #0F172A 100%)`
            : `radial-gradient(120% 90% at 0% 0%, rgba(255,153,0,0.3) 0%, transparent 55%), linear-gradient(135deg, #FFFFFF 0%, #FFF5E6 100%)`,
          border: `1px solid ${t.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(255,153,0,0.35)',
            }}>
              {Ico.sparkle(24, '#fff')}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>AI Tutor</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>Claude & GPT · erklärt, was nicht klickt</div>
            </div>
            {Ico.chevron(18, t.textMuted)}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {['Was ist ein NAT Gateway?', 'S3 vs EFS?', 'IAM erklärt'].map(p =>
              <span key={p} style={{
                fontSize: 11, padding: '6px 10px', borderRadius: 999,
                background: dark ? 'rgba(255,255,255,0.06)' : '#fff',
                border: `1px solid ${t.border}`, color: t.textMuted, fontWeight: 500,
              }}>{p}</span>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { l: 'Ø Score', v: '78%', i: Ico.trophy, c: t.accent },
            { l: 'Fragen', v: '412', i: Ico.quiz, c: t.text },
            { l: 'Zeit', v: '8h 22m', i: Ico.clock, c: t.text },
          ].map(s => (
            <div key={s.l} style={{
              background: t.surface, border: `1px solid ${t.border}`,
              borderRadius: 14, padding: '12px 12px',
            }}>
              <div style={{ color: s.c, opacity: 0.9 }}>{s.i(16, s.c)}</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4, letterSpacing: -0.4 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="home" onChange={onNav} t={t}/>
    </div>
  );
}

// ── 2. Quiz screen ──────────────────────────────────────
function QuizScreen({ dark, onOpenTutor, onNav }) {
  const t = theme(dark);
  const [picked, setPicked] = React.useState(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [expOpen, setExpOpen] = React.useState(true);
  const correct = 'B';

  const options = [
    { k: 'A', text: 'Reserved Instances mit 3-Jahres-Commitment', sub: 'Langzeit-Rabatt, aber unflexibel' },
    { k: 'B', text: 'Spot Instances für fehlertolerante Batch-Jobs', sub: 'Bis zu 90% günstiger, können unterbrochen werden' },
    { k: 'C', text: 'Dedicated Hosts mit On-Demand pricing', sub: 'Volle Kontrolle über physische Hardware' },
    { k: 'D', text: 'Savings Plans auf EC2-Familie', sub: 'Flexible Instance-Typen, fester Commit' },
  ];

  const submit = () => { if (picked) setSubmitted(true); };

  return (
    <div style={{ background: t.bg, height: '100%', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
      {/* top bar */}
      <div style={{ padding: '60px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => onNav && onNav('home')} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {Ico.close(18, t.text)}
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: t.textMuted, marginBottom: 6 }}>
            <span>Frage 4 von 20</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>12:04</span>
          </div>
          <ProgressBar pct={(4/20)*100} t={t}/>
        </div>
      </div>

      {/* content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '22px 20px 200px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          <Chip color={t.accent} bg={t.accentSoft}>Domain 4 · Billing</Chip>
          <Chip color={t.textMuted} bg={dark ? 'rgba(255,255,255,0.04)' : slate100} border={t.border}>Medium</Chip>
        </div>

        <h2 style={{
          fontSize: 22, fontWeight: 700, letterSpacing: -0.5,
          lineHeight: 1.3, margin: 0, color: t.text,
        }}>
          Ein Unternehmen hat einen verteilten Batch-Workload, der Unterbrechungen toleriert. Was ist die <span style={{ color: t.accent }}>kostengünstigste</span> Option?
        </h2>

        {/* options */}
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map(opt => {
            const isPicked = picked === opt.k;
            const isCorrect = submitted && opt.k === correct;
            const isWrongPick = submitted && isPicked && opt.k !== correct;
            let border = t.border, bg = t.surface, badgeBg = t.bg2, badgeColor = t.text;
            if (!submitted && isPicked) { border = t.accent; bg = t.accentSoft; badgeBg = t.accent; badgeColor = '#fff'; }
            if (isCorrect) { border = t.green; bg = dark ? 'rgba(74,222,128,0.1)' : '#F0FDF4'; badgeBg = t.green; badgeColor = '#fff'; }
            if (isWrongPick) { border = t.red; bg = dark ? 'rgba(248,113,113,0.1)' : '#FEF2F2'; badgeBg = t.red; badgeColor = '#fff'; }
            return (
              <button key={opt.k}
                disabled={submitted}
                onClick={() => setPicked(opt.k)}
                style={{
                  textAlign: 'left', padding: 14, borderRadius: 14,
                  border: `1.5px solid ${border}`, background: bg, color: t.text,
                  cursor: submitted ? 'default' : 'pointer', fontFamily: baseFont,
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  transition: 'all .15s ease', transform: isPicked && !submitted ? 'scale(0.995)' : 'scale(1)',
                }}>
                <div style={{
                  width: 32, height: 32, flexShrink: 0, borderRadius: 10,
                  background: badgeBg, color: badgeColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 14, letterSpacing: -0.2,
                }}>
                  {isCorrect ? Ico.check(18, '#fff') : isWrongPick ? Ico.x(18, '#fff') : opt.k}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35 }}>{opt.text}</div>
                  <div style={{ fontSize: 12, color: t.textMuted, marginTop: 3, lineHeight: 1.4 }}>{opt.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* explanation panel */}
        {submitted && (
          <div style={{
            marginTop: 16, borderRadius: 16,
            background: t.surface, border: `1px solid ${t.border}`,
            overflow: 'hidden',
          }}>
            <button onClick={() => setExpOpen(!expOpen)} style={{
              width: '100%', padding: 14, border: 'none', background: 'transparent',
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              color: t.text, fontFamily: baseFont,
            }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Ico.sparkle(16, t.accent)}</div>
              <div style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 700 }}>Erklärung</div>
              <div style={{ transform: expOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform .2s' }}>{Ico.chevronDown(18, t.textMuted)}</div>
            </button>
            {expOpen && (
              <div style={{ padding: '0 14px 16px', fontSize: 13, color: t.textMuted, lineHeight: 1.55 }}>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: t.text }}>Spot Instances</strong> sind ideal für unterbrechbare Workloads: AWS vergibt ungenutzte EC2-Kapazität mit bis zu <strong style={{ color: t.accent }}>90% Rabatt</strong>. Können mit 2-Minuten-Warnung zurückgezogen werden — kein Problem für Batch.
                </p>
                <div style={{
                  marginTop: 10, padding: '10px 12px', borderRadius: 8,
                  background: t.bg2, border: `1px solid ${t.border}`,
                  fontFamily: mono, fontSize: 12, color: t.text,
                }}>
                  <div style={{ color: t.accent, fontWeight: 700 }}>// merke</div>
                  <div>Spot = günstig + unterbrechbar</div>
                  <div>Reserved = Commit (1–3 J.)</div>
                  <div>Savings Plan = flexibel, fix $</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* floating AI button */}
      <button onClick={onOpenTutor} style={{
        position: 'absolute', left: 20, right: 20, bottom: submitted ? 88 : 92,
        height: 52, borderRadius: 16,
        border: `1px solid ${t.border}`,
        background: dark ? 'rgba(30,41,59,0.75)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        color: t.text, fontFamily: baseFont, fontSize: 14, fontWeight: 600,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)', zIndex: 30,
      }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)` }}>{Ico.sparkle(16, '#fff')}</span>
        Ask AI about this question
      </button>

      {/* primary action */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '12px 20px 24px',
        background: t.navBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderTop: `1px solid ${t.border}`, zIndex: 35,
      }}>
        {!submitted ? (
          <button onClick={submit} disabled={!picked} style={{
            width: '100%', height: 52, borderRadius: 14, border: 'none',
            background: picked ? t.accent : (dark ? slate700 : slate200),
            color: picked ? '#fff' : t.textMuted, fontSize: 15, fontWeight: 700,
            fontFamily: baseFont, cursor: picked ? 'pointer' : 'not-allowed',
            letterSpacing: 0.1, transition: 'all .2s',
          }}>Antwort prüfen</button>
        ) : (
          <button style={{
            width: '100%', height: 52, borderRadius: 14, border: 'none',
            background: t.text, color: t.bg, fontSize: 15, fontWeight: 700,
            fontFamily: baseFont, cursor: 'pointer', letterSpacing: 0.1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>Nächste Frage {Ico.chevron(18, t.bg)}</button>
        )}
      </div>
    </div>
  );
}

// ── 3. AI Tutor Sheet ───────────────────────────────────
function TutorSheet({ dark, open, onClose }) {
  const t = theme(dark);
  const [model, setModel] = React.useState('claude');
  const [input, setInput] = React.useState('');
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { if (open) requestAnimationFrame(() => setMounted(true)); else setMounted(false); }, [open]);

  if (!open) return null;

  const msgs = [
    { role: 'user', text: 'Warum ist C falsch? Dedicated Hosts geben mir doch auch Kontrolle über Kosten?' },
    { role: 'ai', text: 'Guter Gedanke! Aber Dedicated Hosts sind teurer, nicht günstiger — du zahlst für die gesamte physische Maschine, unabhängig von der Auslastung.', code: null },
    { role: 'ai', text: 'Die Preis-Hierarchie für EC2 grob von günstig → teuer:', code: {
      lang: 'text',
      body: '1. Spot         (bis −90%, unterbrechbar)\n2. Savings Plan (−72%, 1–3 Jahre)\n3. Reserved     (−72%, 1–3 Jahre)\n4. On-Demand    (Listenpreis)\n5. Dedicated    (teuerste Option)'
    }},
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 80,
      pointerEvents: 'auto',
    }}>
      {/* backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: dark ? 'rgba(2,6,15,0.55)' : 'rgba(15,23,42,0.35)',
        backdropFilter: 'blur(4px)',
        opacity: mounted ? 1 : 0, transition: 'opacity .25s',
      }}/>
      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: '88%',
        background: dark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        border: `1px solid ${t.border}`, borderBottom: 'none',
        borderRadius: '24px 24px 0 0',
        color: t.text, fontFamily: baseFont,
        display: 'flex', flexDirection: 'column',
        transform: mounted ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform .35s cubic-bezier(.2,.8,.2,1)',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.25)',
      }}>
        {/* grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: t.borderStrong }}/>
        </div>

        {/* header */}
        <div style={{ padding: '6px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Ico.sparkle(18, '#fff')}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>AI Tutor</div>
            <div style={{ fontSize: 11, color: t.textMuted }}>Online · antwortet in DE</div>
          </div>
          {/* model toggle */}
          <div style={{
            display: 'flex', padding: 3, borderRadius: 10,
            background: t.bg2, border: `1px solid ${t.border}`,
          }}>
            {['claude', 'gpt'].map(m => (
              <button key={m} onClick={() => setModel(m)} style={{
                padding: '6px 12px', border: 'none', borderRadius: 7,
                background: model === m ? t.surface : 'transparent',
                color: model === m ? t.text : t.textMuted,
                fontSize: 12, fontWeight: 600, fontFamily: baseFont,
                cursor: 'pointer', textTransform: 'capitalize',
                boxShadow: model === m ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}>{m}</button>
            ))}
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: t.bg2, color: t.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Ico.close(16, t.text)}</button>
        </div>

        {/* context chip */}
        <div style={{ padding: '0 16px 10px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 10px 7px 8px', borderRadius: 10,
            background: t.accentSoft, border: `1px solid ${t.border}`,
            fontSize: 12, color: t.text, fontWeight: 500,
          }}>
            {Ico.clip(13, t.accent)}
            <span style={{ fontWeight: 600 }}>Frage 4</span>
            <span style={{ color: t.textMuted }}>·</span>
            <span style={{ color: t.textMuted }}>EC2 Instance Types</span>
          </div>
        </div>

        {/* chat */}
        <div style={{ flex: 1, overflow: 'auto', padding: '4px 16px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '85%',
                padding: '10px 13px', borderRadius: 16,
                background: m.role === 'user'
                  ? t.accent
                  : (dark ? 'rgba(30,41,59,0.7)' : '#fff'),
                color: m.role === 'user' ? '#fff' : t.text,
                fontSize: 13, lineHeight: 1.5,
                border: m.role === 'user' ? 'none' : `1px solid ${t.border}`,
                borderBottomRightRadius: m.role === 'user' ? 4 : 16,
                borderBottomLeftRadius: m.role === 'user' ? 16 : 4,
              }}>
                {m.text}
                {m.code && (
                  <pre style={{
                    margin: '8px 0 0', padding: '10px 12px',
                    background: dark ? '#0B1120' : slate900, color: '#E2E8F0',
                    borderRadius: 10, fontFamily: mono, fontSize: 11.5,
                    lineHeight: 1.5, overflow: 'auto',
                  }}>
{m.code.body.split('\n').map((ln, j) => {
  const m2 = ln.match(/^(\d+\.\s+)(\w+[\w\s]*?)(\s+\(.*\))?$/);
  if (m2) return <div key={j}><span style={{ color: '#64748B' }}>{m2[1]}</span><span style={{ color: '#FFB545' }}>{m2[2]}</span><span style={{ color: '#64748B' }}>{m2[3] || ''}</span></div>;
  return <div key={j}>{ln}</div>;
})}
                  </pre>
                )}
              </div>
            </div>
          ))}

          {/* typing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: t.textMuted, fontSize: 11, padding: '2px 4px' }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  width: 5, height: 5, borderRadius: 3, background: t.textMuted,
                  animation: `dot 1.2s ${i*0.15}s infinite`,
                }}/>
              ))}
            </div>
            tippt…
          </div>
        </div>

        {/* quick chips */}
        <div style={{ padding: '0 16px 10px', display: 'flex', gap: 6, overflow: 'auto' }}>
          {['Erkläre einfacher', 'Gib ein Beispiel', 'Warum nicht C?', 'Merksatz?'].map(c =>
            <button key={c} style={{
              padding: '7px 12px', borderRadius: 999,
              background: t.bg2, border: `1px solid ${t.border}`,
              color: t.text, fontSize: 12, fontWeight: 500,
              fontFamily: baseFont, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{c}</button>
          )}
        </div>

        {/* input */}
        <div style={{
          padding: '10px 16px 24px',
          borderTop: `1px solid ${t.border}`,
          display: 'flex', gap: 8, alignItems: 'center',
        }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            padding: '0 12px', height: 44, borderRadius: 12,
            background: t.bg2, border: `1px solid ${t.border}`,
          }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              placeholder="Frage den Tutor…"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: baseFont, fontSize: 14, color: t.text,
              }}/>
          </div>
          <button style={{
            width: 44, height: 44, borderRadius: 12, border: 'none',
            background: input.trim() ? t.accent : t.bg2,
            color: input.trim() ? '#fff' : t.textMuted,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .15s',
          }}>{Ico.send(18, input.trim() ? '#fff' : t.textMuted)}</button>
        </div>
      </div>

      <style>{`@keyframes dot{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-2px)}}`}</style>
    </div>
  );
}

// ── 4. Learn / Topic detail ─────────────────────────────
function LearnScreen({ dark, onNav }) {
  const t = theme(dark);
  const [tocOpen, setTocOpen] = React.useState(false);
  const toc = [
    { n: '1', label: 'Was ist EC2?', active: true },
    { n: '2', label: 'Instance Types & Familien' },
    { n: '3', label: 'Preismodelle' },
    { n: '4', label: 'Placement Groups' },
    { n: '5', label: 'AMIs & Storage' },
  ];

  return (
    <div style={{ background: t.bg, height: '100%', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
      {/* top bar */}
      <div style={{ padding: '60px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => onNav && onNav('home')} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scaleX(-1)' }}>
          {Ico.chevron(18, t.text)}
        </button>
        <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 600 }}>Compute · Kapitel 3 / 12</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '18px 20px 120px' }}>
        {/* Topic header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)`,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(255,153,0,0.3)',
          }}>{Ico.server(26, '#fff')}</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.accent, letterSpacing: 1, textTransform: 'uppercase' }}>Amazon</div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1 }}>EC2</div>
          </div>
        </div>
        <div style={{ marginTop: 10, display: 'flex', gap: 14, fontSize: 12, color: t.textMuted, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{Ico.clock(13, t.textMuted)} 12 min</span>
          <span>·</span>
          <span>8 Fragen im Exam</span>
          <span>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: t.green }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: t.green }}/> Fundamentals
          </span>
        </div>

        {/* TOC accordion */}
        <div style={{
          marginTop: 18, borderRadius: 14,
          background: t.surface, border: `1px solid ${t.border}`,
          overflow: 'hidden',
        }}>
          <button onClick={() => setTocOpen(!tocOpen)} style={{
            width: '100%', padding: '12px 14px', border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
            color: t.text, fontFamily: baseFont,
          }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>Inhalt</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{toc.find(i => i.active).label}</div>
            </div>
            <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600 }}>1/{toc.length}</div>
            <div style={{ transform: tocOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>{Ico.chevronDown(18, t.textMuted)}</div>
          </button>
          {tocOpen && (
            <div style={{ padding: '4px 8px 10px', borderTop: `1px solid ${t.border}` }}>
              {toc.map(it => (
                <div key={it.n} style={{
                  padding: '10px 10px', borderRadius: 8,
                  display: 'flex', gap: 10, alignItems: 'center',
                  background: it.active ? t.accentSoft : 'transparent',
                  color: it.active ? t.accent : t.text,
                  fontSize: 13, fontWeight: it.active ? 600 : 500,
                  cursor: 'pointer',
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: it.active ? t.accent : t.bg2,
                    color: it.active ? '#fff' : t.textMuted,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, fontFamily: mono,
                  }}>{it.n}</span>
                  {it.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* content */}
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '28px 0 8px', letterSpacing: -0.3 }}>1 · Was ist EC2?</h3>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: t.textMuted, margin: '0 0 14px' }}>
          <strong style={{ color: t.text }}>Elastic Compute Cloud</strong> ist AWS' Dienst für virtuelle Server in der Cloud.
          Du mietest Rechenleistung minutengenau — Starten, Stoppen, Skalieren per API.
        </p>

        {/* Key Facts callout */}
        <div style={{
          borderRadius: 14, padding: '14px 14px 14px 16px',
          background: t.accentSoft,
          border: `1px solid ${t.accent}40`,
          borderLeft: `4px solid ${t.accent}`,
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: t.accent, letterSpacing: 1, textTransform: 'uppercase' }}>
            {Ico.bolt(13, t.accent)} Key Facts
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.65, color: t.text }}>
            <li>IaaS — du managst OS & Apps</li>
            <li>Pay-per-second (Linux) / per-hour (Windows)</li>
            <li>Regions → AZs → Instances</li>
          </ul>
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '24px 0 8px', letterSpacing: -0.3 }}>CLI Beispiel</h3>
        <pre style={{
          margin: 0, padding: '14px 16px', borderRadius: 12,
          background: dark ? '#0B1120' : slate900, color: '#E2E8F0',
          fontFamily: mono, fontSize: 12, lineHeight: 1.6, overflow: 'auto',
          border: `1px solid ${t.border}`,
        }}>
<div><span style={{ color: '#64748B' }}># Start a t3.micro instance</span></div>
<div><span style={{ color: '#FFB545' }}>aws</span> ec2 run-instances <span style={{ color: '#94A3B8' }}>\</span></div>
<div>  <span style={{ color: '#4ADE80' }}>--image-id</span> ami-0abc123 <span style={{ color: '#94A3B8' }}>\</span></div>
<div>  <span style={{ color: '#4ADE80' }}>--instance-type</span> t3.micro <span style={{ color: '#94A3B8' }}>\</span></div>
<div>  <span style={{ color: '#4ADE80' }}>--key-name</span> my-key</div>
        </pre>

        <p style={{ fontSize: 14, lineHeight: 1.65, color: t.textMuted, margin: '16px 0 0' }}>
          Instance-Familien decken unterschiedliche Workloads ab — <strong style={{ color: t.text }}>T</strong> (burstable),
          <strong style={{ color: t.text }}> M</strong> (general), <strong style={{ color: t.text }}>C</strong> (compute),
          <strong style={{ color: t.text }}> R</strong> (memory), <strong style={{ color: t.text }}>I</strong> (storage).
        </p>

        {/* CTA */}
        <div style={{
          marginTop: 22, padding: 16, borderRadius: 18,
          background: dark
            ? `linear-gradient(135deg, ${slate800} 0%, #1B2A44 100%)`
            : '#FFF',
          border: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Ico.target(22, t.accent)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Quiz dich zu EC2</div>
            <div style={{ fontSize: 12, color: t.textMuted }}>10 Fragen · ~6 min</div>
          </div>
          <button onClick={() => onNav && onNav('quiz')} style={{
            padding: '10px 14px', borderRadius: 10, border: 'none',
            background: t.accent, color: '#fff', fontSize: 13, fontWeight: 700,
            fontFamily: baseFont, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
          }}>Start {Ico.chevron(14, '#fff')}</button>
        </div>
      </div>

      <BottomNav active="learn" onChange={onNav} t={t}/>
    </div>
  );
}

Object.assign(window, { HomeScreen, QuizScreen, TutorSheet, LearnScreen, theme: theme, baseFont });
