// Kept for backward-compat imports in legacy screens
export const slate900 = '#0F172A';
export const slate800 = '#1E293B';
export const slate700 = '#334155';
export const slate600 = '#475569';
export const slate400 = '#94A3B8';
export const slate300 = '#CBD5E1';
export const slate200 = '#E2E8F0';
export const slate100 = '#F1F5F9';
export const slate50  = '#F8FAFC';

export const baseFont = `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif`;
export const mono = `'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace`;

export interface Theme {
  bg: string; bg2: string; bgGrad: string;
  surface: string; surface2: string; surface3: string;
  border: string; borderStrong: string; shadow: string;
  text: string; text2: string; textMuted: string; textSubtle: string;
  accent: string; accentText: string; accentSoft: string; accentHair: string;
  success: string; successSoft: string;
  warning: string; warningSoft: string;
  danger: string;  dangerSoft: string;
  info: string;    infoSoft: string;
  navBg: string; cardBg: string;
  // Backward-compat aliases
  green: string; greenSoft: string;
  red: string;   redSoft: string;
  blue: string;  blueSoft: string;
}

export function theme(dark: boolean): Theme {
  if (dark) {
    return {
      bg:           '#000000',
      bg2:          '#1C1C1E',
      bgGrad:       'linear-gradient(180deg, #000000 0%, #1C1C1E 100%)',
      surface:      '#1C1C1E',
      surface2:     '#2C2C2E',
      surface3:     '#3A3A3C',
      border:       'rgba(255,255,255,0.10)',
      borderStrong: 'rgba(255,255,255,0.18)',
      shadow:       '0 1px 0 rgba(255,255,255,0.04) inset',
      text:         '#F5F5F7',
      text2:        '#D2D2D7',
      textMuted:    '#86868B',
      textSubtle:   '#48484A',
      accent:       '#0A84FF',
      accentText:   '#FFFFFF',
      accentSoft:   'rgba(10,132,255,0.16)',
      accentHair:   'rgba(10,132,255,0.32)',
      success:      '#30D158',
      successSoft:  'rgba(48,209,88,0.16)',
      warning:      '#FF9F0A',
      warningSoft:  'rgba(255,159,10,0.16)',
      danger:       '#FF453A',
      dangerSoft:   'rgba(255,69,58,0.16)',
      info:         '#5E5CE6',
      infoSoft:     'rgba(94,92,230,0.16)',
      navBg:        'rgba(28,28,30,0.78)',
      cardBg:       '#1C1C1E',
      // aliases
      green:        '#30D158',
      greenSoft:    'rgba(48,209,88,0.16)',
      red:          '#FF453A',
      redSoft:      'rgba(255,69,58,0.16)',
      blue:         '#0A84FF',
      blueSoft:     'rgba(10,132,255,0.16)',
    };
  }
  return {
    bg:           '#FBFBFD',
    bg2:          '#F5F5F7',
    bgGrad:       'linear-gradient(180deg, #FBFBFD 0%, #F5F5F7 100%)',
    surface:      '#FFFFFF',
    surface2:     '#F5F5F7',
    surface3:     '#E8E8ED',
    border:       'rgba(0,0,0,0.08)',
    borderStrong: 'rgba(0,0,0,0.16)',
    shadow:       '0 1px 2px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(0,0,0,0.04)',
    text:         '#1D1D1F',
    text2:        '#3A3A3C',
    textMuted:    '#86868B',
    textSubtle:   '#D2D2D7',
    accent:       '#0071E3',
    accentText:   '#FFFFFF',
    accentSoft:   '#E8F1FD',
    accentHair:   'rgba(0,113,227,0.22)',
    success:      '#248A3D',
    successSoft:  '#E3F8E9',
    warning:      '#C77700',
    warningSoft:  '#FFF1D6',
    danger:       '#D70015',
    dangerSoft:   '#FFE5E7',
    info:         '#5E5CE6',
    infoSoft:     '#EAE9FB',
    navBg:        'rgba(255,255,255,0.82)',
    cardBg:       '#FFFFFF',
    // aliases
    green:        '#248A3D',
    greenSoft:    '#E3F8E9',
    red:          '#D70015',
    redSoft:      '#FFE5E7',
    blue:         '#0071E3',
    blueSoft:     '#E8F1FD',
  };
}
