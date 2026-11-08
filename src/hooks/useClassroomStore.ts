import { useState, useCallback, useEffect } from 'react';
import type { CameraMode, StudentData, StudentState } from '../types/classroom';
import { STUDENTS_DATA } from '../data/students';
import { soundEngine } from '../audio/SoundEngine';

export interface ClassroomStore {
  students: StudentData[];
  studentStates: Record<string, StudentState>;
  activeStudentId: string | null;
  hoveredStudentId: string | null;
  scorecardStudent: StudentData | null;
  cameraMode: CameraMode;
  isMuted: boolean;
  isExamRunning: boolean;
  timeRemainingSeconds: number;
  completedCount: number;

  // Actions
  setHoveredStudentId: (id: string | null) => void;
  setCameraMode: (mode: CameraMode) => void;
  toggleMute: () => void;
  callStudent: (id: string) => void;
  callRandomStudent: () => void;
  updateStudentState: (id: string, state: StudentState) => void;
  dismissScorecard: () => void;
  resetExam: () => void;
}

export function useClassroomStore(): ClassroomStore {
  const [students] = useState<StudentData[]>(STUDENTS_DATA);
  const [studentStates, setStudentStates] = useState<Record<string, StudentState>>(() => {
    const initial: Record<string, StudentState> = {};
    STUDENTS_DATA.forEach((s) => {
      initial[s.id] = 'SEATED_WRITING';
    });
    return initial;
  });

  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const [hoveredStudentId, setHoveredStudentId] = useState<string | null>(null);
  const [scorecardStudent, setScorecardStudent] = useState<StudentData | null>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>('teacher_pov');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isExamRunning, setIsExamRunning] = useState<boolean>(true);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(45 * 60); // 45:00 exam timer

  // Exam timer countdown
  useEffect(() => {
    if (!isExamRunning) return;
    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isExamRunning]);

  const toggleMute = useCallback(() => {
    const newMuted = soundEngine.toggleMute();
    setIsMuted(newMuted);
  }, []);

  const updateStudentState = useCallback((id: string, newState: StudentState) => {
    setStudentStates((prev) => ({
      ...prev,
      [id]: newState,
    }));

    // Trigger audio effects or events based on state transitions
    if (newState === 'STANDING') {
      soundEngine.playChairSlide();
    } else if (newState === 'HANDING_PAPER') {
      soundEngine.playPaperRustle();
      soundEngine.playDeskBell();
      const student = STUDENTS_DATA.find((s) => s.id === id);
      if (student) {
        setScorecardStudent(student);
        const isHigh = student.scorecard.totalScore >= 90;
        soundEngine.playGradeChime(isHigh);
      }
    } else if (newState === 'SITTING_DOWN') {
      soundEngine.playChairSlide();
    } else if (newState === 'COMPLETED') {
      setActiveStudentId((current) => (current === id ? null : current));
    }
  }, []);

  const callStudent = useCallback((id: string) => {
    // Only allow calling if no active student is currently walking/submitting
    if (activeStudentId !== null) return;
    const currentState = studentStates[id];
    if (currentState === 'COMPLETED') return;

    setActiveStudentId(id);
    updateStudentState(id, 'STANDING');
  }, [activeStudentId, studentStates, updateStudentState]);

  const callRandomStudent = useCallback(() => {
    if (activeStudentId !== null) return;
    const available = students.filter(
      (s) => studentStates[s.id] === 'SEATED_WRITING'
    );
    if (available.length === 0) return;
    const random = available[Math.floor(Math.random() * available.length)];
    callStudent(random.id);
  }, [activeStudentId, students, studentStates, callStudent]);

  const dismissScorecard = useCallback(() => {
    setScorecardStudent(null);
    // Active student should now transition to TURNING_AROUND
    if (activeStudentId && studentStates[activeStudentId] === 'HANDING_PAPER') {
      updateStudentState(activeStudentId, 'TURNING_AROUND');
    }
  }, [activeStudentId, studentStates, updateStudentState]);

  const resetExam = useCallback(() => {
    const resetStates: Record<string, StudentState> = {};
    STUDENTS_DATA.forEach((s) => {
      resetStates[s.id] = 'SEATED_WRITING';
    });
    setStudentStates(resetStates);
    setActiveStudentId(null);
    setHoveredStudentId(null);
    setScorecardStudent(null);
    setTimeRemainingSeconds(45 * 60);
    setIsExamRunning(true);
  }, []);

  const completedCount = Object.values(studentStates).filter(
    (st) => st === 'COMPLETED'
  ).length;

  return {
    students,
    studentStates,
    activeStudentId,
    hoveredStudentId,
    scorecardStudent,
    cameraMode,
    isMuted,
    isExamRunning,
    timeRemainingSeconds,
    completedCount,
    setHoveredStudentId,
    setCameraMode,
    toggleMute,
    callStudent,
    callRandomStudent,
    updateStudentState,
    dismissScorecard,
    resetExam,
  };
}
