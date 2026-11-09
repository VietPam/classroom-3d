import { useState, useCallback } from 'react';
import type { StudentData } from '../types/classroom';
import { STUDENTS_DATA } from '../data/students';

export interface ClassroomStore {
  students: StudentData[];
  cameraResetCount: number;
  resetCamera: () => void;
}

export function useClassroomStore(): ClassroomStore {
  const [students] = useState<StudentData[]>(STUDENTS_DATA);
  const [cameraResetCount, setCameraResetCount] = useState<number>(0);

  const resetCamera = useCallback(() => {
    setCameraResetCount((c) => c + 1);
  }, []);

  return {
    students,
    cameraResetCount,
    resetCamera,
  };
}
