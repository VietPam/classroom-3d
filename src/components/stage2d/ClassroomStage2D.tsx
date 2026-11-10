import React, { useMemo, useEffect } from 'react';
import type { ClassroomStore } from '../../hooks/useClassroomStore';
import type { VoteOption } from '../../modules/voting/votingTypes';
import { Smartboard2D } from './Smartboard2D';
import { FloorPads2D } from './FloorPads2D';
import { ChibiAvatar2D } from './ChibiAvatar2D';
import { ParticleEngine2D } from './ParticleEngine2D';
import {
  ZONE_2D_CENTERS,
  ZONE_SLOT_2D_OFFSETS,
  DESK_2D_POSITIONS,
} from './types2d';

interface ClassroomStage2DProps {
  store: ClassroomStore;
}

export const ClassroomStage2D: React.FC<ClassroomStage2DProps> = ({ store }) => {
  const {
    students,
    quiz,
    quizStatus,
    votingState,
  } = store;

  // Kiểm tra chế độ OBS Studio (?obs=1)
  const isObsMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('obs') === '1';
  }, []);

  useEffect(() => {
    if (isObsMode) {
      document.body.classList.add('obs-mode');
    }
  }, [isObsMode]);

  // Tính toán vị trí 2D của từng học sinh (Desks vs Pads)
  const studentPositions = useMemo(() => {
    const slotCounts: Record<VoteOption, number> = { A: 0, B: 0, C: 0, D: 0 };

    return students.map((student) => {
      // 1. GIAI ĐOẠN IDLE: Đứng / ngồi tại bàn học
      if (quizStatus === 'IDLE' || !student.chosenOption) {
        const desk = DESK_2D_POSITIONS[student.id] || { x: 50, y: 62 };
        return {
          student,
          x: desk.x,
          y: desk.y,
          scale: 0.80 + (desk.y - 48) * 0.007, // Càng gần mép dưới càng to nhẹ (0.80 -> 0.98)
          zIndex: Math.round(desk.y * 10),
          state: student.currentState || 'IDLE',
        };
      }

      // 2. GIAI ĐOẠN CHẠY ĐUA / SUY NGHĨ / CÔNG BỐ: Chạy về ô đáp án
      const chosen = student.chosenOption;
      const slotIdx = slotCounts[chosen]++;
      const center = ZONE_2D_CENTERS[chosen];
      const offset = ZONE_SLOT_2D_OFFSETS[slotIdx % ZONE_SLOT_2D_OFFSETS.length];

      const posX = center.x + offset.dx;
      const posY = center.y + offset.dy;

      // Xác định trạng thái hoạt hình khi công bố kết quả
      let characterState = student.currentState || 'WALKING';
      if (quizStatus === 'REVEAL') {
        characterState = chosen === quiz.correctOption ? 'CELEBRATING' : 'SHOCKED';
      }

      return {
        student,
        x: posX,
        y: posY,
        scale: 0.74 + offset.dy * 0.015, // Đứng ở sàn đấu nhỏ hơn ở bàn, hàng trước to hơn hàng sau
        zIndex: Math.round((posY + 20) * 10),
        state: characterState,
      };
    });
  }, [students, quizStatus, quiz.correctOption]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
      {/* KHUNG HÌNH 9:16 CHUẨN TIKTOK LIVE & OBS BROWSER SOURCE */}
      <div
        className="relative w-full h-full max-w-[520px] max-h-[960px] aspect-[9/16] overflow-hidden flex flex-col shadow-2xl border-x border-slate-800/60 select-none"
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 35%, #2e1065 65%, #18181b 100%)',
        }}
      >
        {/* ================= LỚP 1: NỀN PHÒNG HỌC PHỐI CẢNH ANIME (MATTE 2.5D) ================= */}
        {/* Ánh nắng ban mai xiên từ cửa sổ bên trái */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 10% 20%, rgba(254, 240, 138, 0.3) 0%, transparent 70%)',
          }}
        />

        {/* Tường phòng học & Giá sách / Đồng hồ mờ ảo phía sau */}
        <div className="absolute top-0 left-0 right-0 h-[48%] pointer-events-none opacity-25 flex justify-between px-6 pt-4">
          <div className="w-16 h-36 rounded-lg border border-amber-200/20 bg-amber-950/20" />
          <div className="w-12 h-12 rounded-full border-2 border-amber-200/30 flex items-center justify-center text-amber-200/40 text-xs font-mono font-bold">
            10:15
          </div>
          <div className="w-16 h-36 rounded-lg border border-amber-200/20 bg-amber-950/20" />
        </div>

        {/* Sàn gỗ phòng học với phối cảnh chiều sâu */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[56%] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, #1c1917 0%, #292524 40%, #1c1917 100%)',
            boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.8)',
          }}
        >
          {/* Đường vân phối cảnh sàn gỗ hướng tâm */}
          <svg className="w-full h-full opacity-15" preserveAspectRatio="none">
            <line x1="50%" y1="0%" x2="0%" y2="100%" stroke="#fde047" strokeWidth="1.5" />
            <line x1="50%" y1="0%" x2="25%" y2="100%" stroke="#fde047" strokeWidth="1.5" />
            <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#fde047" strokeWidth="1.5" />
            <line x1="50%" y1="0%" x2="75%" y2="100%" stroke="#fde047" strokeWidth="1.5" />
            <line x1="50%" y1="0%" x2="100%" y2="100%" stroke="#fde047" strokeWidth="1.5" />
          </svg>
        </div>

        {/* ================= LỚP 2: BẢNG THÔNG MINH SẮC NÉT (NỬA TRÊN) ================= */}
        <div className="relative z-10 px-3 pt-3 sm:px-4 sm:pt-4">
          <Smartboard2D
            quiz={quiz}
            status={quizStatus}
            votePercentages={votingState.votePercentages}
            voteCounts={votingState.voteCounts}
            totalVotes={votingState.totalVotes}
          />
        </div>

        {/* ================= LỚP 3: 4 Ô ĐÁP ÁN SÀN ĐẤU (GIỮA SÂN ĐẤU) ================= */}
        <div className="relative z-10 px-3 sm:px-4 mt-2 sm:mt-2.5">
          <FloorPads2D
            quizStatus={quizStatus}
            correctOption={quiz.correctOption}
            votePercentages={votingState.votePercentages}
            voteCounts={votingState.voteCounts}
            totalVotes={votingState.totalVotes}
          />
        </div>

        {/* ================= LỚP 4: BÀN HỌC BAN ĐẦU (KHI IDLE) ================= */}
        {quizStatus === 'IDLE' && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {Object.entries(DESK_2D_POSITIONS).map(([id, pos]) => (
              <div
                key={`desk_${id}`}
                className="absolute w-13 h-4 rounded-md bg-amber-950/70 border border-amber-700/50 shadow-md transition-all duration-300"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y + 4.5}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </div>
        )}

        {/* ================= LỚP 5: 20 NHÂN VẬT CHIBI HOẠT HÌNH 2D ================= */}
        <div className="absolute inset-0 pointer-events-none">
          {studentPositions.map(({ student, x, y, scale, zIndex, state }) => (
            <div
              key={student.id}
              className="absolute pointer-events-auto transition-all duration-[1600ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -85%) scale(${scale})`,
                zIndex,
              }}
            >
              <ChibiAvatar2D
                data={student}
                state={state}
                showName={true}
              />
            </div>
          ))}
        </div>

        {/* ================= LỚP 6: CANVAS HIỆU ỨNG HẠT PHÁO HOA ================= */}
        <ParticleEngine2D quizStatus={quizStatus} />

        {/* Khoảng đệm chân cho HUD */}
        <div className="h-16 sm:h-20 shrink-0" />
      </div>
    </div>
  );
};
