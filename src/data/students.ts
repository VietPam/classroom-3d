import type { StudentData } from '../types/classroom';

// Compact 3x3 Grid layout for Mobile-First Viewport: 3 columns x 3 rows = 9 Chibi Capybara students
// Columns: X in [-0.72, 0, 0.72] (Compact width ~1.8m fits vertically inside 9:16 mobile screen without clipping)
// Rows: Z in [1.2 (Front Row A), 0.0 (Middle Row B), -1.2 (Back Row C)]
// Stage / Submission spot: Z = 2.4 (in front of teacher desk and directly beneath the IELTS Honor Board)

export const STUDENTS_DATA: StudentData[] = [
  // ================= ROW 1 (Front Row near Board) =================
  {
    id: 'student-1',
    name: 'Emily Zhang',
    seatId: 'A1',
    gender: 'f',
    skinTone: '#b8753e', // Warm Caramel Fur
    hairColor: '#2b1d0c',
    hairStyle: 'ponytail',
    shirtColor: '#4f46e5', // Royal Indigo Sweater
    pantsColor: '#1e293b',
    shoesColor: '#6d3c19',
    accessory: 'orange', // Iconic Yuzu Orange on head
    capybaraTone: '#b8753e',
    deskPosition: [-0.72, 0, 1.2],
    aisleWaypoint: [0, 0, 1.2],
    submissionWaypoint: [0, 0, 2.4],
    scorecard: {
      totalScore: 96,
      maxScore: 100,
      grade: 'A+',
      subject: 'IELTS Academic & Calculus Midterm',
      timestamp: '10:42 AM',
      feedback: 'Flawless execution on multivariate integrals and Taylor approximations. Outstanding work, Capy Emily!',
      strengths: ['Multivariable Integration', 'Series Convergence', 'Lagrange Multipliers'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 25, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 25, maxScore: 25, status: 'correct' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 24, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 22, maxScore: 25, status: 'correct' }
      ]
    }
  },
  {
    id: 'student-2',
    name: 'Marcus Vance',
    seatId: 'A2',
    gender: 'm',
    skinTone: '#9a5c2f', // Toffee Brown Fur
    hairColor: '#1a110a',
    hairStyle: 'short',
    shirtColor: '#059669', // Emerald Green Sweater
    pantsColor: '#334155',
    shoesColor: '#5c3214',
    accessory: 'lotus', // Peaceful Pink Lotus on head
    capybaraTone: '#9a5c2f',
    deskPosition: [0, 0, 1.2],
    aisleWaypoint: [0, 0, 1.2],
    submissionWaypoint: [0, 0, 2.4],
    scorecard: {
      totalScore: 91,
      maxScore: 100,
      grade: 'A',
      subject: 'IELTS Academic & Calculus Midterm',
      timestamp: '10:44 AM',
      feedback: 'Very solid reasoning on the divergence theorem; minor algebraic sign slip in question 4.',
      strengths: ['Vector Fields', 'Stokes Theorem', 'Boundary Conditions'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 24, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 23, maxScore: 25, status: 'correct' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 25, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 19, maxScore: 25, status: 'partial' }
      ]
    }
  },
  {
    id: 'student-3',
    name: 'Sophia Patel',
    seatId: 'A3',
    gender: 'f',
    skinTone: '#a86a3d', // Golden Toffee Fur
    hairColor: '#171717',
    hairStyle: 'curly',
    shirtColor: '#d97706', // Amber Gold Sweater
    pantsColor: '#1e1e24',
    shoesColor: '#633718',
    accessory: 'glasses', // Round Wire Glasses
    capybaraTone: '#a86a3d',
    deskPosition: [0.72, 0, 1.2],
    aisleWaypoint: [0, 0, 1.2],
    submissionWaypoint: [0, 0, 2.4],
    scorecard: {
      totalScore: 98,
      maxScore: 100,
      grade: 'A+',
      subject: 'IELTS Academic & Calculus Midterm',
      timestamp: '10:39 AM',
      feedback: 'Remarkable speed and precision! Full marks on all proofs with elegant notation.',
      strengths: ['Proof Rigor', 'Geometric Intuition', 'Rapid Computation'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 25, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 25, maxScore: 25, status: 'correct' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 25, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 23, maxScore: 25, status: 'correct' }
      ]
    }
  },

  // ================= ROW 2 (Middle Row) =================
  {
    id: 'student-4',
    name: 'Lucas Kim',
    seatId: 'B1',
    gender: 'm',
    skinTone: '#8e4f24', // Chestnut Fur
    hairColor: '#1c1917',
    hairStyle: 'short',
    shirtColor: '#2563eb', // Sapphire Blue Sweater
    pantsColor: '#374151',
    shoesColor: '#522b10',
    accessory: 'scholar_hat', // Scholar Mortarboard Hat
    capybaraTone: '#8e4f24',
    deskPosition: [-0.72, 0, 0.0],
    aisleWaypoint: [0, 0, 0.0],
    submissionWaypoint: [0, 0, 2.4],
    scorecard: {
      totalScore: 84,
      maxScore: 100,
      grade: 'B',
      subject: 'IELTS Academic & Calculus Midterm',
      timestamp: '10:48 AM',
      feedback: 'Good overall grasp of line integrals. Double check limits of integration in polar coordinates.',
      strengths: ['Partial Derivatives', 'Gradient Ascent'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 22, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 18, maxScore: 25, status: 'partial' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 23, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 21, maxScore: 25, status: 'correct' }
      ]
    }
  },
  {
    id: 'student-5',
    name: 'Amina Diallo',
    seatId: 'B2',
    gender: 'f',
    skinTone: '#ba7b44', // Cinnamon Fur
    hairColor: '#0a0a0a',
    hairStyle: 'curly',
    shirtColor: '#db2777', // Rose Pink Sweater
    pantsColor: '#18181b',
    shoesColor: '#6a3b1a',
    accessory: 'red_bow', // Cute Red Ribbon Bow
    capybaraTone: '#ba7b44',
    deskPosition: [0, 0, 0.0],
    aisleWaypoint: [0, 0, 0.0],
    submissionWaypoint: [0, 0, 2.4],
    scorecard: {
      totalScore: 89,
      maxScore: 100,
      grade: 'B+',
      subject: 'IELTS Academic & Calculus Midterm',
      timestamp: '10:46 AM',
      feedback: 'Clean step-by-step calculus work. Great intuition on directional derivatives.',
      strengths: ['Directional Derivatives', 'Critical Point Classification'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 24, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 22, maxScore: 25, status: 'correct' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 21, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 22, maxScore: 25, status: 'correct' }
      ]
    }
  },
  {
    id: 'student-6',
    name: 'Jin-Woo Park',
    seatId: 'B3',
    gender: 'm',
    skinTone: '#945528', // Cocoa Fur
    hairColor: '#171717',
    hairStyle: 'short',
    shirtColor: '#0284c7', // Sky Blue Sweater
    pantsColor: '#3f3f46',
    shoesColor: '#552e12',
    accessory: 'orange', // Yuzu Orange on head
    capybaraTone: '#945528',
    deskPosition: [0.72, 0, 0.0],
    aisleWaypoint: [0, 0, 0.0],
    submissionWaypoint: [0, 0, 2.4],
    scorecard: {
      totalScore: 94,
      maxScore: 100,
      grade: 'A',
      subject: 'IELTS Academic & Calculus Midterm',
      timestamp: '10:41 AM',
      feedback: 'Very thorough derivations. Excellent symmetry arguments to simplify volume integrals.',
      strengths: ['Symmetry Reduction', 'Iterated Integrals'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 25, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 24, maxScore: 25, status: 'correct' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 23, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 22, maxScore: 25, status: 'correct' }
      ]
    }
  },

  // ================= ROW 3 (Back Row) =================
  {
    id: 'student-7',
    name: 'Isabella Rossi',
    seatId: 'C1',
    gender: 'f',
    skinTone: '#a36437', // Warm Amber Fur
    hairColor: '#451a03',
    hairStyle: 'ponytail',
    shirtColor: '#7c3aed', // Purple Robe
    pantsColor: '#1e293b',
    shoesColor: '#603517',
    accessory: 'lotus', // Zen Lotus Flower
    capybaraTone: '#a36437',
    deskPosition: [-0.72, 0, -1.2],
    aisleWaypoint: [0, 0, -1.2],
    submissionWaypoint: [0, 0, 2.4],
    scorecard: {
      totalScore: 92,
      maxScore: 100,
      grade: 'A',
      subject: 'IELTS Academic & Calculus Midterm',
      timestamp: '10:43 AM',
      feedback: 'Great presentation and clear diagrams. Solved question 1 with impressive elegance.',
      strengths: ['Geometric Visualization', 'Vector Calculus'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 25, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 22, maxScore: 25, status: 'correct' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 23, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 22, maxScore: 25, status: 'correct' }
      ]
    }
  },
  {
    id: 'student-8',
    name: 'Dev Patel',
    seatId: 'C2',
    gender: 'm',
    skinTone: '#b3723c', // Golden Cinnamon Fur
    hairColor: '#18181b',
    hairStyle: 'buzz',
    shirtColor: '#0d9488', // Teal Sweater
    pantsColor: '#1e293b',
    shoesColor: '#653919',
    accessory: 'scholar_hat', // Scholar Mortarboard Hat
    capybaraTone: '#b3723c',
    deskPosition: [0, 0, -1.2],
    aisleWaypoint: [0, 0, -1.2],
    submissionWaypoint: [0, 0, 2.4],
    scorecard: {
      totalScore: 95,
      maxScore: 100,
      grade: 'A',
      subject: 'IELTS Academic & Calculus Midterm',
      timestamp: '10:40 AM',
      feedback: 'Superb mastery of spherical coordinate transformations. Well done!',
      strengths: ['Coordinate Transformations', 'Jacobian Determinants'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 25, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 24, maxScore: 25, status: 'correct' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 24, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 22, maxScore: 25, status: 'correct' }
      ]
    }
  },
  {
    id: 'student-9',
    name: 'Chloe Dubois',
    seatId: 'C3',
    gender: 'f',
    skinTone: '#9c5e31', // Caramel Fur
    hairColor: '#713f12',
    hairStyle: 'ponytail',
    shirtColor: '#e11d48', // Crimson Sweater
    pantsColor: '#1c1917',
    shoesColor: '#5c3214',
    accessory: 'orange', // Yuzu Orange
    capybaraTone: '#9c5e31',
    deskPosition: [0.72, 0, -1.2],
    aisleWaypoint: [0, 0, -1.2],
    submissionWaypoint: [0, 0, 2.4],
    scorecard: {
      totalScore: 87,
      maxScore: 100,
      grade: 'B+',
      subject: 'IELTS Academic & Calculus Midterm',
      timestamp: '10:47 AM',
      feedback: 'Solid computation of Jacobian matrices. Minor issue on question 3 boundary setup.',
      strengths: ['Jacobian Matrices', 'Chain Rule in Multivariable'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 24, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 22, maxScore: 25, status: 'correct' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 20, maxScore: 25, status: 'partial' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 21, maxScore: 25, status: 'correct' }
      ]
    }
  }
];
