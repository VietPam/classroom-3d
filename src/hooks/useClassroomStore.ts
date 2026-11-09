import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  StudentData,
  QuizData,
  QuizStatus,
  CharacterState,
} from '../types/classroom';
import { STUDENTS_DATA } from '../data/students';
import { QUIZ_ZONES } from '../data/floorZones';
import { audioEngine } from '../audio/audioEngine';
import {
  getQuizPlaylist,
  getQuizByIndex,
  getTotalQuizCount,
} from '../config/quizConfig';
import { STREAM_TIMING } from '../config/streamConfig';

// Slot offsets bên trong mỗi ô đáp án phóng to (1.4m x 1.8m)
// Giúp 2 đến 4 học sinh cùng đứng chung một ô mà không bị đè người
const ZONE_SLOT_OFFSETS: [number, number, number][] = [
  [-0.32, 0, 0.25],
  [0.32, 0, 0.25],
  [-0.32, 0, -0.10],
  [0.32, 0, -0.10],
];

export interface ClassroomStore {
  students: StudentData[];
  quiz: QuizData;
  quizStatus: QuizStatus;
  cameraResetCount: number;
  isAutoPlay: boolean;
  activeGroupId: string;
  quizIndex: number;
  totalQuizzes: number;
  toggleAutoPlay: () => void;
  nextQuiz: () => void;
  prevQuiz: () => void;
  selectGroup: (groupId: string) => void;
  resetCamera: () => void;
  startQuizShowdown: () => void;
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

  const [activeGroupId, setActiveGroupId] = useState<string>('all');
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [quizStatus, setQuizStatus] = useState<QuizStatus>('IDLE');
  const [cameraResetCount, setCameraResetCount] = useState<number>(0);

  // Sync refs to avoid stale closure issues in continuous loop timers
  const activeGroupIdRef = useRef(activeGroupId);
  const quizIndexRef = useRef(quizIndex);
  const isAutoPlayRef = useRef(isAutoPlay);
  const quizStatusRef = useRef(quizStatus);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const startQuizShowdownRef = useRef<() => void>(() => {});

  useEffect(() => {
    activeGroupIdRef.current = activeGroupId;
  }, [activeGroupId]);

  useEffect(() => {
    quizIndexRef.current = quizIndex;
  }, [quizIndex]);

  useEffect(() => {
    isAutoPlayRef.current = isAutoPlay;
  }, [isAutoPlay]);

  useEffect(() => {
    quizStatusRef.current = quizStatus;
  }, [quizStatus]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const resetCamera = useCallback(() => {
    setCameraResetCount((c) => c + 1);
  }, []);

  // Get current active quiz item
  const currentRawQuiz = getQuizByIndex(quizIndex, activeGroupId);
  const totalQuizzes = getTotalQuizCount(activeGroupId);

  const quiz: QuizData = {
    ...currentRawQuiz,
    quizNumber: quizIndex + 1,
    totalQuizzes,
  };

  // Kịch bản: Bắt đầu Cuộc đua Quiz (Quiz Showdown)
  // Phân bổ tự nhiên: 2 bạn chọn đúng (đứng chung ô), 2 bạn chọn 2 đáp án sai khác nhau
  const startQuizShowdown = useCallback(() => {
    clearTimers();
    setQuizStatus('RUNNING');

    // SFX: Tiếng vút gió xuất phát
    audioEngine.playSFX('whoosh_fast');

    const targetQuiz = getQuizByIndex(quizIndexRef.current, activeGroupIdRef.current);
    const correct = targetQuiz.correctOption;
    const allOptions: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    const wrongOptions = allOptions.filter((opt) => opt !== correct);

    // Phân bổ 4 học sinh: 2 bạn chọn đúng, 2 bạn chia về 2 ô sai
    const choices: ('A' | 'B' | 'C' | 'D')[] = [
      correct,
      correct,
      wrongOptions[0] || 'B',
      wrongOptions[1] || 'C',
    ];

    const zoneSlotCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };

    setStudents((prev) =>
      prev.map((student, idx) => {
        const chosen = choices[idx % choices.length];
        const slotIdx = zoneSlotCounts[chosen]++;
        const offset = ZONE_SLOT_OFFSETS[slotIdx % ZONE_SLOT_OFFSETS.length];
        const zone = QUIZ_ZONES.find((z) => z.id === chosen) || QUIZ_ZONES[0];

        // Tọa độ mục tiêu kết hợp offset vị trí trong ô
        const targetPos: [number, number, number] = [
          zone.position[0] + offset[0],
          zone.position[1] + offset[1],
          zone.position[2] + offset[2],
        ];

        return {
          ...student,
          targetPosition: targetPos,
          currentState: 'WALKING',
          chosenOption: chosen,
        };
      })
    );

    // Tiếng bước chân lon ton khi chạy
    const footstepTimer = setTimeout(() => {
      audioEngine.playSFX('pop_soft');
    }, STREAM_TIMING.FOOTSTEP_AUDIO_DELAY_MS);
    timersRef.current.push(footstepTimer);

    // Giai đoạn 2: Đến nơi, đứng suy nghĩ đắn đo
    const thinkingTimer = setTimeout(() => {
      setQuizStatus('THINKING');
      audioEngine.playSFX('cat_huh');
      setStudents((prev) =>
        prev.map((student) => ({
          ...student,
          currentState: 'THINKING',
        }))
      );
    }, STREAM_TIMING.WALK_TO_THINKING_MS);
    timersRef.current.push(thinkingTimer);

    // Giai đoạn 3: Bảng công bố kết quả (Reveal)
    const revealTimer = setTimeout(() => {
      setQuizStatus('REVEAL');

      // Auto-duck BGM và phát chuông báo đúng
      audioEngine.duckBGM(0.02, 1800);
      audioEngine.playSFX('ding_correct');

      // Thưởng xu cho người thắng và buzzer cho người thua
      const winTimer = setTimeout(() => {
        audioEngine.playSFX('coin_reward');
      }, STREAM_TIMING.REWARD_SFX_DELAY_MS);
      const loseTimer = setTimeout(() => {
        audioEngine.playSFX('wrong_buzzer');
      }, STREAM_TIMING.BUZZER_SFX_DELAY_MS);
      timersRef.current.push(winTimer, loseTimer);

      setStudents((prev) =>
        prev.map((student) => {
          const isWinner = student.chosenOption === targetQuiz.correctOption;
          return {
            ...student,
            currentState: isWinner ? 'CELEBRATING' : 'SAD',
          };
        })
      );

      // Giai đoạn 4: Vòng lặp phát câu hỏi liên tục (Continuous Live Loop)
      // Nếu isAutoPlay bật: sau thời gian hiển thị kết quả -> chuyển sang câu tiếp theo
      const autoNextTimer = setTimeout(() => {
        if (!isAutoPlayRef.current) return;

        // Đưa học sinh về vạch xuất phát
        audioEngine.playSFX('card_slide');
        setQuizStatus('IDLE');
        setStudents((prev) =>
          prev.map((student) => ({
            ...student,
            targetPosition: student.deskPosition,
            currentState: 'WALKING',
            chosenOption: undefined,
          }))
        );

        // Chuyển chỉ mục câu hỏi tiếp theo
        const playlist = getQuizPlaylist(activeGroupIdRef.current);
        const nextIdx = (quizIndexRef.current + 1) % playlist.length;
        quizIndexRef.current = nextIdx;
        setQuizIndex(nextIdx);

        // Sau khi về chỗ, học sinh đứng nghiêm túc đọc đề mới
        const readyTimer = setTimeout(() => {
          setStudents((prev) =>
            prev.map((student) => ({
              ...student,
              currentState: 'IDLE',
            }))
          );
        }, STREAM_TIMING.RETURN_TO_SPAWN_MS);
        timersRef.current.push(readyTimer);

        // Sau khi đọc đề mới, tự động chạy vòng showdown tiếp theo!
        const nextShowdownTimer = setTimeout(() => {
          if (isAutoPlayRef.current) {
            startQuizShowdownRef.current();
          }
        }, STREAM_TIMING.READ_PROMPT_MS);
        timersRef.current.push(nextShowdownTimer);
      }, STREAM_TIMING.REVEAL_DISPLAY_MS);
      timersRef.current.push(autoNextTimer);
    }, STREAM_TIMING.THINKING_TO_REVEAL_MS);
    timersRef.current.push(revealTimer);
  }, [clearTimers]);

  useEffect(() => {
    startQuizShowdownRef.current = startQuizShowdown;
  }, [startQuizShowdown]);

  // Kịch bản: Quay về vị trí xuất phát ban đầu
  const resetAllToSpawn = useCallback(() => {
    clearTimers();
    setQuizStatus('IDLE');
    audioEngine.playSFX('card_slide');

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
    }, STREAM_TIMING.RETURN_TO_SPAWN_MS);
    timersRef.current.push(timer);
  }, [clearTimers]);

  // Cả lớp nhảy múa ăn mừng
  const celebrateAll = useCallback(() => {
    clearTimers();
    audioEngine.playSFX('coin_reward');
    const popTimer = setTimeout(() => {
      audioEngine.playSFX('pop_mouth');
    }, 300);
    timersRef.current.push(popTimer);

    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        currentState: 'CELEBRATING',
      }))
    );
  }, [clearTimers]);

  // Chuyển sang câu hỏi tiếp theo
  const nextQuiz = useCallback(() => {
    clearTimers();
    resetAllToSpawn();
    const playlist = getQuizPlaylist(activeGroupIdRef.current);
    const nextIdx = (quizIndexRef.current + 1) % playlist.length;
    quizIndexRef.current = nextIdx;
    setQuizIndex(nextIdx);

    // Nếu đang bật Auto Play, lên lịch chạy sau khi đọc đề
    if (isAutoPlayRef.current) {
      const autoTimer = setTimeout(() => {
        startQuizShowdown();
      }, STREAM_TIMING.READ_PROMPT_MS);
      timersRef.current.push(autoTimer);
    }
  }, [clearTimers, resetAllToSpawn, startQuizShowdown]);

  // Quay lại câu hỏi trước
  const prevQuiz = useCallback(() => {
    clearTimers();
    resetAllToSpawn();
    const playlist = getQuizPlaylist(activeGroupIdRef.current);
    const prevIdx = (quizIndexRef.current - 1 + playlist.length) % playlist.length;
    quizIndexRef.current = prevIdx;
    setQuizIndex(prevIdx);

    if (isAutoPlayRef.current) {
      const autoTimer = setTimeout(() => {
        startQuizShowdown();
      }, STREAM_TIMING.READ_PROMPT_MS);
      timersRef.current.push(autoTimer);
    }
  }, [clearTimers, resetAllToSpawn, startQuizShowdown]);

  // Bật/Tắt chế độ tự động chạy liên tục (Continuous Auto-Play)
  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlay((prev) => {
      const nextState = !prev;
      isAutoPlayRef.current = nextState;

      if (nextState) {
        // Nếu vừa bật lại, kích hoạt showdown câu hiện tại
        clearTimers();
        resetAllToSpawn();
        const autoTimer = setTimeout(() => {
          startQuizShowdown();
        }, STREAM_TIMING.AUTOPLAY_RESTART_DELAY_MS);
        timersRef.current.push(autoTimer);
      } else {
        // Tắt auto play: giữ nguyên trạng thái hiện tại, dừng lịch trình tự động chuyển câu
        clearTimers();
      }

      return nextState;
    });
  }, [clearTimers, resetAllToSpawn, startQuizShowdown]);

  // Chọn nhóm câu hỏi (Tất cả / Đồng nghĩa / Trái nghĩa / Điền từ)
  const selectGroup = useCallback(
    (groupId: string) => {
      clearTimers();
      setActiveGroupId(groupId);
      activeGroupIdRef.current = groupId;
      setQuizIndex(0);
      quizIndexRef.current = 0;
      resetAllToSpawn();

      if (isAutoPlayRef.current) {
        const autoTimer = setTimeout(() => {
          startQuizShowdown();
        }, STREAM_TIMING.GROUP_SWITCH_DELAY_MS);
        timersRef.current.push(autoTimer);
      }
    },
    [clearTimers, resetAllToSpawn, startQuizShowdown]
  );

  // Khởi động vòng lặp tự động lần đầu tiên khi ứng dụng mở
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      if (isAutoPlayRef.current) {
        startQuizShowdown();
      }
    }, STREAM_TIMING.INITIAL_AUTOPLAY_DELAY_MS);
    timersRef.current.push(initialTimer);

    return () => {
      clearTimers();
    };
  }, [clearTimers, startQuizShowdown]);

  return {
    students,
    quiz,
    quizStatus,
    cameraResetCount,
    isAutoPlay,
    activeGroupId,
    quizIndex,
    totalQuizzes,
    toggleAutoPlay,
    nextQuiz,
    prevQuiz,
    selectGroup,
    resetCamera,
    startQuizShowdown,
    resetAllToSpawn,
    celebrateAll,
  };
}
