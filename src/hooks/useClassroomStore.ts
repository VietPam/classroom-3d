import { useState, useCallback, useRef } from 'react';
import type {
  StudentData,
  QuizData,
  QuizStatus,
  CharacterState,
} from '../types/classroom';
import { STUDENTS_DATA } from '../data/students';
import { QUIZ_ZONES, PODIUM_POSITION } from '../data/floorZones';

export const DEFAULT_QUIZ: QuizData = {
  title: 'JavaScript Quiz Race',
  question: 'Trong JavaScript, kết quả của biểu thức sau là gì?',
  codeSnippet: 'typeof NaN',
  options: [
    { id: 'A', label: 'Đáp án A', code: '"number"', isCorrect: true },
    { id: 'B', label: 'Đáp án B', code: '"NaN"', isCorrect: false },
    { id: 'C', label: 'Đáp án C', code: '"undefined"', isCorrect: false },
    { id: 'D', label: 'Đáp án D', code: '"object"', isCorrect: false },
  ],
  correctOption: 'A',
  explanation: 'NaN là viết tắt của "Not-a-Number", nhưng theo chuẩn IEEE 754 trong JS, kiểu dữ liệu của nó vẫn là "number".',
};

export interface ClassroomStore {
  students: StudentData[];
  quiz: QuizData;
  quizStatus: QuizStatus;
  cameraResetCount: number;
  resetCamera: () => void;
  startQuizShowdown: () => void;
  callStudentToBoard: (studentId?: string) => void;
  resetAllToSpawn: () => void;
  celebrateAll: () => void;
}

export function useClassroomStore(): ClassroomStore {
  const [students, setStudents] = useState<StudentData[]>(() =>
    STUDENTS_DATA.map((s) => ({
      ...s,
      targetPosition: s.deskPosition,
      currentState: 'IDLE' as CharacterState,
    }))
  );
  const [quiz] = useState<QuizData>(DEFAULT_QUIZ);
  const [quizStatus, setQuizStatus] = useState<QuizStatus>('IDLE');
  const [cameraResetCount, setCameraResetCount] = useState<number>(0);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const resetCamera = useCallback(() => {
    setCameraResetCount((c) => c + 1);
  }, []);

  // 1. Kịch bản: Bắt đầu Cuộc đua Quiz (Quiz Showdown)
  const startQuizShowdown = useCallback(() => {
    clearTimers();
    setQuizStatus('RUNNING');

    // Phân công 4 học sinh chạy về 4 ô A, B, C, D
    setStudents((prev) =>
      prev.map((student, idx) => {
        const zone = QUIZ_ZONES[idx % QUIZ_ZONES.length];
        return {
          ...student,
          targetPosition: zone.position,
          currentState: 'WALKING',
          chosenOption: zone.id,
        };
      })
    );

    // Giai đoạn 2: Đến nơi, đứng suy nghĩ đắn đo
    const timer1 = setTimeout(() => {
      setQuizStatus('THINKING');
      setStudents((prev) =>
        prev.map((student) => ({
          ...student,
          currentState: 'THINKING',
        }))
      );
    }, 1800);
    timersRef.current.push(timer1);

    // Giai đoạn 3: Bảng công bố kết quả (Reveal)
    const timer2 = setTimeout(() => {
      setQuizStatus('REVEAL');
      setStudents((prev) =>
        prev.map((student) => {
          const isWinner = student.chosenOption === DEFAULT_QUIZ.correctOption;
          return {
            ...student,
            currentState: isWinner ? 'CELEBRATING' : 'SAD',
          };
        })
      );
    }, 3800);
    timersRef.current.push(timer2);
  }, [clearTimers]);

  // 2. Kịch bản: Gọi học sinh lên bục trước bảng thuyết trình (Call to Board)
  const callStudentToBoard = useCallback((studentId = 's1') => {
    clearTimers();
    setQuizStatus('PRESENTING');

    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            targetPosition: PODIUM_POSITION,
            currentState: 'WALKING',
          };
        }
        return {
          ...student,
          currentState: 'IDLE',
        };
      })
    );

    // Đến bục giảng thì bắt đầu thuyết trình
    const timer = setTimeout(() => {
      setStudents((prev) =>
        prev.map((student) => {
          if (student.id === studentId) {
            return {
              ...student,
              currentState: 'PRESENTING',
            };
          }
          return student;
        })
      );
    }, 1800);
    timersRef.current.push(timer);
  }, [clearTimers]);

  // 3. Kịch bản: Quay về vị trí xuất phát ban đầu
  const resetAllToSpawn = useCallback(() => {
    clearTimers();
    setQuizStatus('IDLE');

    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        targetPosition: student.deskPosition,
        currentState: 'WALKING',
        chosenOption: undefined,
      }))
    );

    const timer = setTimeout(() => {
      setStudents((prev) =>
        prev.map((student) => ({
          ...student,
          currentState: 'IDLE',
        }))
      );
    }, 1800);
    timersRef.current.push(timer);
  }, [clearTimers]);

  // 4. Cả lớp nhảy múa ăn mừng
  const celebrateAll = useCallback(() => {
    clearTimers();
    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        currentState: 'CELEBRATING',
      }))
    );
  }, [clearTimers]);

  return {
    students,
    quiz,
    quizStatus,
    cameraResetCount,
    resetCamera,
    startQuizShowdown,
    callStudentToBoard,
    resetAllToSpawn,
    celebrateAll,
  };
}
