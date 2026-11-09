export type CharacterState =
  | 'IDLE'
  | 'WALKING'
  | 'THINKING'
  | 'CELEBRATING'
  | 'SAD'
  | 'PRESENTING';

export type QuizStatus =
  | 'IDLE'
  | 'RUNNING'
  | 'THINKING'
  | 'REVEAL'
  | 'PRESENTING';

export interface QuizOption {
  id: 'A' | 'B' | 'C' | 'D';
  label: string;
  code: string;
  isCorrect?: boolean;
}

export interface QuizData {
  title: string;
  question: string;
  codeSnippet: string;
  options: QuizOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface StudentData {
  id: string;
  name: string;
  seatId: string;
  gender: 'm' | 'f';
  skinTone: string;
  hairColor: string;
  hairStyle: 'short' | 'curly' | 'ponytail' | 'buzz';
  shirtColor: string;
  pantsColor: string;
  shoesColor: string;
  accessory?: 'orange' | 'lotus' | 'glasses' | 'scholar_hat' | 'red_bow' | 'none';
  capybaraTone?: string;
  // Spawn & desk coordinate in world space
  deskPosition: [number, number, number]; // [x, y, z]
  targetPosition?: [number, number, number];
  currentState?: CharacterState;
  chosenOption?: 'A' | 'B' | 'C' | 'D' | 'PODIUM';
}
