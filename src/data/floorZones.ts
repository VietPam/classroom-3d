import { BRAND_COLORS } from '../theme/brandTokens';

export interface ZoneConfig {
  id: 'A' | 'B' | 'C' | 'D';
  position: [number, number, number];
  color: string;
  glowColor: string;
  label: string;
}

export const QUIZ_ZONES: ZoneConfig[] = [
  {
    id: 'A',
    position: [2.35, 0, 3.4],
    color: BRAND_COLORS.accentAmber,
    glowColor: BRAND_COLORS.glowAmber,
    label: 'A',
  },
  {
    id: 'B',
    position: [0.78, 0, 3.4],
    color: BRAND_COLORS.primary,
    glowColor: BRAND_COLORS.glowBlue,
    label: 'B',
  },
  {
    id: 'C',
    position: [-0.78, 0, 3.4],
    color: BRAND_COLORS.semanticGreen,
    glowColor: BRAND_COLORS.glowGreen,
    label: 'C',
  },
  {
    id: 'D',
    position: [-2.35, 0, 3.4],
    color: BRAND_COLORS.semanticRed,
    glowColor: BRAND_COLORS.glowRed,
    label: 'D',
  },
];
