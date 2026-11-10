export type CharacterState =
  | 'IDLE'
  | 'WALKING'
  | 'THINKING'
  | 'CELEBRATING'
  | 'SAD'
  | 'WAVE'
  | 'RAISE_HAND'
  | 'DANCE'
  | 'SHOCKED';

export type QuizStatus =
  | 'IDLE'
  | 'RUNNING'
  | 'THINKING'
  | 'REVEAL';

export interface QuizOption {
  id: 'A' | 'B' | 'C' | 'D';
  word: string;
  ipa?: string;
  meaning?: string;
  isCorrect?: boolean;
}

export interface QuizData {
  id?: string;
  groupId?: string;
  groupName?: string;
  quizNumber?: number;
  totalQuizzes?: number;
  category?: string;
  level?: string;
  question: string;
  targetWord?: string;
  contextSentence?: string;
  options: QuizOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
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
  currentState?: CharacterState;
  chosenOption?: 'A' | 'B' | 'C' | 'D';
}
