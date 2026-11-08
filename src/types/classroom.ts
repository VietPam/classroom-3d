export type StudentState =
  | 'SEATED_WRITING'
  | 'STANDING'
  | 'STEPPING_TO_AISLE'
  | 'WALKING_TO_TEACHER'
  | 'HANDING_PAPER'
  | 'TURNING_AROUND'
  | 'WALKING_TO_SEAT'
  | 'SITTING_DOWN'
  | 'COMPLETED';

export interface ExamQuestion {
  id: string;
  question: string;
  score: number;
  maxScore: number;
  status: 'correct' | 'partial' | 'incorrect';
}

export interface StudentScorecard {
  totalScore: number;
  maxScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  subject: string;
  timestamp: string;
  feedback: string;
  questions: ExamQuestion[];
  strengths: string[];
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
  // Desk grid coordinate in world space
  deskPosition: [number, number, number]; // [x, y, z]
  aisleWaypoint: [number, number, number];
  submissionWaypoint: [number, number, number];
  scorecard: StudentScorecard;
}

export type CameraMode = 'teacher_pov' | 'overview' | 'student_cam';
