export const awsOrange = '#FF9900';
export const slate900 = '#0F172A';
export const slate800 = '#1E293B';
export const slate700 = '#334155';
export const slate600 = '#475569';
export const slate400 = '#94A3B8';
export const slate300 = '#CBD5E1';
export const slate200 = '#E2E8F0';
export const slate100 = '#F1F5F9';
export const slate50  = '#F8FAFC';
export const green400 = '#4ADE80';
export const red400   = '#F87171';

export const baseFont = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
export const mono = `'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace`;

export interface Theme {
  bg: string; bg2: string; bgGrad: string; surface: string; surface2: string;
  border: string; borderStrong: string;
  text: string; textMuted: string; textSubtle: string;
  accent: string; accentSoft: string;
  green: string; greenSoft: string; red: string; redSoft: string;
  blue: string; blueSoft: string;
  navBg: string; cardBg: string;
}

export function theme(dark: boolean): Theme {
  return dark ? {
    bg: slate900, bg2: '#0B1120',
    bgGrad: `linear-gradient(180deg, ${slate900} 0%, ${slate800} 100%)`,
    surface: slate800, surface2: '#253349',
    border: 'rgba(148,163,184,0.14)', borderStrong: 'rgba(148,163,184,0.24)',
    text: '#F8FAFC', textMuted: slate400, textSubtle: slate600,
    accent: awsOrange, accentSoft: 'rgba(255,153,0,0.14)',
    green: green400, greenSoft: 'rgba(74,222,128,0.14)',
    red: red400, redSoft: 'rgba(248,113,113,0.14)',
    blue: '#60A5FA', blueSoft: 'rgba(96,165,250,0.14)',
    navBg: 'rgba(15,23,42,0.85)', cardBg: '#1E293B',
  } : {
    bg: '#F8FAFC', bg2: '#EEF2F7',
    bgGrad: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2F7 100%)',
    surface: '#FFFFFF', surface2: '#F8FAFC',
    border: 'rgba(15,23,42,0.08)', borderStrong: 'rgba(15,23,42,0.14)',
    text: slate900, textMuted: slate600, textSubtle: slate400,
    accent: '#E88800', accentSoft: 'rgba(255,153,0,0.12)',
    green: '#16A34A', greenSoft: '#DCFCE7',
    red: '#DC2626', redSoft: '#FEE2E2',
    blue: '#2563EB', blueSoft: '#DBEAFE',
    navBg: 'rgba(255,255,255,0.9)', cardBg: '#FFFFFF',
  };
}
