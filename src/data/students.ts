import type { StudentData } from '../types/classroom';

// Grid layout: 4 columns x 3 rows = 12 students
// Columns: -3.0, -1.1, 1.1, 3.0 (Leaving X = 0 center aisle with ~2.2m clearance)
// Rows: Z = 1.6, -0.8, -3.2 (Teacher desk is at Z = 4.2 facing -Z)

export const STUDENTS_DATA: StudentData[] = [
  // Row 1 (closest to front)
  {
    id: 'student-1',
    name: 'Emily Zhang',
    seatId: 'A1',
    gender: 'f',
    skinTone: '#f3c6ad',
    hairColor: '#2b1d0c',
    hairStyle: 'ponytail',
    shirtColor: '#4f46e5', // indigo
    pantsColor: '#1e293b',
    shoesColor: '#ffffff',
    deskPosition: [-3.0, 0, 1.6],
    aisleWaypoint: [0, 0, 1.6],
    submissionWaypoint: [0, 0, 3.2],
    scorecard: {
      totalScore: 96,
      maxScore: 100,
      grade: 'A+',
      subject: 'Advanced Calculus - Midterm',
      timestamp: '10:42 AM',
      feedback: 'Flawless execution on multivariate integrals and Taylor approximations. Outstanding work!',
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
    skinTone: '#a06e49',
    hairColor: '#1a110a',
    hairStyle: 'short',
    shirtColor: '#059669', // emerald
    pantsColor: '#334155',
    shoesColor: '#0f172a',
    deskPosition: [-1.1, 0, 1.6],
    aisleWaypoint: [0, 0, 1.6],
    submissionWaypoint: [0, 0, 3.2],
    scorecard: {
      totalScore: 91,
      maxScore: 100,
      grade: 'A',
      subject: 'Advanced Calculus - Midterm',
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
    skinTone: '#c68d59',
    hairColor: '#171717',
    hairStyle: 'curly',
    shirtColor: '#d97706', // amber
    pantsColor: '#1e1e24',
    shoesColor: '#cbd5e1',
    deskPosition: [1.1, 0, 1.6],
    aisleWaypoint: [0, 0, 1.6],
    submissionWaypoint: [0, 0, 3.2],
    scorecard: {
      totalScore: 98,
      maxScore: 100,
      grade: 'A+',
      subject: 'Advanced Calculus - Midterm',
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
  {
    id: 'student-4',
    name: 'Lucas Kim',
    seatId: 'A4',
    gender: 'm',
    skinTone: '#f8d2b2',
    hairColor: '#1c1917',
    hairStyle: 'short',
    shirtColor: '#2563eb', // blue
    pantsColor: '#374151',
    shoesColor: '#18181b',
    deskPosition: [3.0, 0, 1.6],
    aisleWaypoint: [0, 0, 1.6],
    submissionWaypoint: [0, 0, 3.2],
    scorecard: {
      totalScore: 84,
      maxScore: 100,
      grade: 'B',
      subject: 'Advanced Calculus - Midterm',
      timestamp: '10:48 AM',
      feedback: 'Good overall grasp of line integrals. Double check limits of integration in polar coordinates.',
      strengths: ['Partial Derivatives', 'Gradient Ascent'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 22, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 18, maxScore: 25, status: 'partial' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 22, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 22, maxScore: 25, status: 'correct' }
      ]
    }
  },

  // Row 2 (middle row)
  {
    id: 'student-5',
    name: 'Aria Montgomery',
    seatId: 'B1',
    gender: 'f',
    skinTone: '#fed0b8',
    hairColor: '#78350f', // auburn
    hairStyle: 'ponytail',
    shirtColor: '#db2777', // pink
    pantsColor: '#1e293b',
    shoesColor: '#f1f5f9',
    deskPosition: [-3.0, 0, -0.8],
    aisleWaypoint: [0, 0, -0.8],
    submissionWaypoint: [0, 0, 3.2],
    scorecard: {
      totalScore: 94,
      maxScore: 100,
      grade: 'A',
      subject: 'Advanced Calculus - Midterm',
      timestamp: '10:45 AM',
      feedback: 'Very thorough solutions. Clean vector notation and accurate diagrams.',
      strengths: ['Flux Integrals', 'Orthogonal Projections'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 25, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 24, maxScore: 25, status: 'correct' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 23, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 22, maxScore: 25, status: 'correct' }
      ]
    }
  },
  {
    id: 'student-6',
    name: 'David O\'Connor',
    seatId: 'B2',
    gender: 'm',
    skinTone: '#ffdec4',
    hairColor: '#b45309', // red-brown
    hairStyle: 'curly',
    shirtColor: '#7c3aed', // violet
    pantsColor: '#111827',
    shoesColor: '#475569',
    deskPosition: [-1.1, 0, -0.8],
    aisleWaypoint: [0, 0, -0.8],
    submissionWaypoint: [0, 0, 3.2],
    scorecard: {
      totalScore: 88,
      maxScore: 100,
      grade: 'B+',
      subject: 'Advanced Calculus - Midterm',
      timestamp: '10:50 AM',
      feedback: 'Solid work throughout. Review Jacobians for coordinate transformation in Question 2.',
      strengths: ['Differential Forms', 'Directional Derivatives'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 24, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 19, maxScore: 25, status: 'partial' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 22, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 23, maxScore: 25, status: 'correct' }
      ]
    }
  },
  {
    id: 'student-7',
    name: 'Chloe Takahashi',
    seatId: 'B3',
    gender: 'f',
    skinTone: '#fbe2cd',
    hairColor: '#09090b',
    hairStyle: 'short',
    shirtColor: '#0891b2', // cyan
    pantsColor: '#334155',
    shoesColor: '#ffffff',
    deskPosition: [1.1, 0, -0.8],
    aisleWaypoint: [0, 0, -0.8],
    submissionWaypoint: [0, 0, 3.2],
    scorecard: {
      totalScore: 92,
      maxScore: 100,
      grade: 'A',
      subject: 'Advanced Calculus - Midterm',
      timestamp: '10:46 AM',
      feedback: 'Great clarity in explaining steps. Surface area parametrization was done flawlessly.',
      strengths: ['Parametric Surfaces', 'Curl & Circulation'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 24, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 23, maxScore: 25, status: 'correct' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 24, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 21, maxScore: 25, status: 'correct' }
      ]
    }
  },
  {
    id: 'student-8',
    name: 'Jordan Rivera',
    seatId: 'B4',
    gender: 'm',
    skinTone: '#b87c4f',
    hairColor: '#171717',
    hairStyle: 'buzz',
    shirtColor: '#ea580c', // orange
    pantsColor: '#1e293b',
    shoesColor: '#e2e8f0',
    deskPosition: [3.0, 0, -0.8],
    aisleWaypoint: [0, 0, -0.8],
    submissionWaypoint: [0, 0, 3.2],
    scorecard: {
      totalScore: 86,
      maxScore: 100,
      grade: 'B',
      subject: 'Advanced Calculus - Midterm',
      timestamp: '10:49 AM',
      feedback: 'Well constructed solutions. Keep an eye on unit vector normal orientations.',
      strengths: ['Multivariable Limits', 'Optimization'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 22, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 21, maxScore: 25, status: 'correct' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 21, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 22, maxScore: 25, status: 'correct' }
      ]
    }
  },

  // Row 3 (back row)
  {
    id: 'student-9',
    name: 'Maya Al-Mansoor',
    seatId: 'C1',
    gender: 'f',
    skinTone: '#cf9868',
    hairColor: '#0a0a0a',
    hairStyle: 'curly',
    shirtColor: '#16a34a', // green
    pantsColor: '#18181b',
    shoesColor: '#ffffff',
    deskPosition: [-3.0, 0, -3.2],
    aisleWaypoint: [0, 0, -3.2],
    submissionWaypoint: [0, 0, 3.2],
    scorecard: {
      totalScore: 97,
      maxScore: 100,
      grade: 'A+',
      subject: 'Advanced Calculus - Midterm',
      timestamp: '10:40 AM',
      feedback: 'Exceptional test paper! All proofs were rigorous and vector calculus derivations immaculate.',
      strengths: ['Green’s Theorem', 'Curvilinear Coordinates', 'Rigor'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 25, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 24, maxScore: 25, status: 'correct' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 25, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 23, maxScore: 25, status: 'correct' }
      ]
    }
  },
  {
    id: 'student-10',
    name: 'Ethan Becker',
    seatId: 'C2',
    gender: 'm',
    skinTone: '#f7d5be',
    hairColor: '#451a03',
    hairStyle: 'short',
    shirtColor: '#475569', // slate
    pantsColor: '#0f172a',
    shoesColor: '#94a3b8',
    deskPosition: [-1.1, 0, -3.2],
    aisleWaypoint: [0, 0, -3.2],
    submissionWaypoint: [0, 0, 3.2],
    scorecard: {
      totalScore: 89,
      maxScore: 100,
      grade: 'B+',
      subject: 'Advanced Calculus - Midterm',
      timestamp: '10:47 AM',
      feedback: 'Very close to an A! Re-verify partial derivative chain rules when using nested functions.',
      strengths: ['Spherical Integration', 'Tangent Planes'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 23, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 22, maxScore: 25, status: 'correct' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 23, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 21, maxScore: 25, status: 'correct' }
      ]
    }
  },
  {
    id: 'student-11',
    name: 'Isabella Rossi',
    seatId: 'C3',
    gender: 'f',
    skinTone: '#fcdcc5',
    hairColor: '#27272a',
    hairStyle: 'ponytail',
    shirtColor: '#0284c7', // light blue
    pantsColor: '#1e293b',
    shoesColor: '#ffffff',
    deskPosition: [1.1, 0, -3.2],
    aisleWaypoint: [0, 0, -3.2],
    submissionWaypoint: [0, 0, 3.2],
    scorecard: {
      totalScore: 95,
      maxScore: 100,
      grade: 'A',
      subject: 'Advanced Calculus - Midterm',
      timestamp: '10:43 AM',
      feedback: 'Brilliant conceptual comprehension and clean handwriting. A pleasure to grade!',
      strengths: ['Conservative Vector Fields', 'Line Integrals'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 25, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 24, maxScore: 25, status: 'correct' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 24, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 22, maxScore: 25, status: 'correct' }
      ]
    }
  },
  {
    id: 'student-12',
    name: 'Zane Washington',
    seatId: 'C4',
    gender: 'm',
    skinTone: '#6b472e',
    hairColor: '#09090b',
    hairStyle: 'buzz',
    shirtColor: '#b91c1c', // red
    pantsColor: '#111827',
    shoesColor: '#ffffff',
    deskPosition: [3.0, 0, -3.2],
    aisleWaypoint: [0, 0, -3.2],
    submissionWaypoint: [0, 0, 3.2],
    scorecard: {
      totalScore: 93,
      maxScore: 100,
      grade: 'A',
      subject: 'Advanced Calculus - Midterm',
      timestamp: '10:44 AM',
      feedback: 'Very solid math intuition and clear algebraic reduction. Excellent job overall!',
      strengths: ['Multivariate Chain Rule', 'Gradient Fields'],
      questions: [
        { id: 'q1', question: 'Find global extrema using Lagrange Multipliers', score: 24, maxScore: 25, status: 'correct' },
        { id: 'q2', question: 'Triple integral over cylindrical coordinate region', score: 23, maxScore: 25, status: 'correct' },
        { id: 'q3', question: 'Divergence Theorem verification on Gaussian surface', score: 24, maxScore: 25, status: 'correct' },
        { id: 'q4', question: 'Derive Taylor Series for composite function', score: 22, maxScore: 25, status: 'correct' }
      ]
    }
  }
];
