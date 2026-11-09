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
    position: [2.25, 0, 3.4],
    color: '#f59e0b',
    glowColor: '#fbbf24',
    label: 'A',
  },
  {
    id: 'B',
    position: [0.75, 0, 3.4],
    color: '#0284c7',
    glowColor: '#38bdf8',
    label: 'B',
  },
  {
    id: 'C',
    position: [-0.75, 0, 3.4],
    color: '#059669',
    glowColor: '#34d399',
    label: 'C',
  },
  {
    id: 'D',
    position: [-2.25, 0, 3.4],
    color: '#e11d48',
    glowColor: '#fb7185',
    label: 'D',
  },
];

export const PODIUM_POSITION: [number, number, number] = [0, 0, 4.5];
