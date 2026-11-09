import { Play, Camera, User, PartyPopper, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import type { ClassroomStore } from '../../hooks/useClassroomStore';
import { useAudio } from '../../audio/useAudio';

interface HUDProps {
  store: ClassroomStore;
}

export function HUD({ store }: HUDProps) {
  const {
    resetCamera,
    startQuizShowdown,
    callStudentToBoard,
    resetAllToSpawn,
    celebrateAll,
    quizStatus,
  } = store;

  const { isMuted, toggleMute, playSFX } = useAudio();

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between items-center p-3 sm:p-5 select-none pb-[calc(1rem+env(safe-area-inset-bottom))] font-sans">
      {/* Top Floating Status Indicator */}
      <header className="pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700/60 shadow-lg text-xs font-semibold text-slate-200">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F08806] animate-pulse" />
          <span className="tracking-wide">TikTok 3D Live Studio</span>
          <span className="text-slate-600">|</span>
          <span className="text-[#38BDF8] font-mono">
            {quizStatus === 'RUNNING' && '🏃 Đang chạy đua...'}
            {quizStatus === 'THINKING' && '🤔 Đang suy nghĩ...'}
            {quizStatus === 'REVEAL' && '🎉 Đã công bố kết quả!'}
            {quizStatus === 'PRESENTING' && '🎤 Lên bảng thuyết trình'}
            {quizStatus === 'IDLE' && '⚡ Sẵn sàng'}
          </span>
        </div>
      </header>

      {/* Bottom Control Dock: Scenario Triggers, Audio & Camera Controls */}
      <footer className="pointer-events-auto flex flex-col items-center gap-2 w-full max-w-sm">
        {/* Main Scenario Control Bar */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-slate-950/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-slate-700/70 shadow-2xl w-full">
          {/* 1. Quiz Race Trigger (Brand Accent Amber) */}
          <button
            onClick={() => {
              playSFX('click_ui');
              startQuizShowdown();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#F08806] to-[#D97706] hover:from-[#F59E0B] hover:to-[#EA580C] text-white text-xs font-bold shadow-md shadow-amber-950/40 transition-all cursor-pointer active:scale-95"
            title="4 học sinh chạy đua chọn ô đáp án A/B/C/D"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Quiz Race</span>
          </button>

          {/* 2. Call to Board Trigger (Brand Royal Blue) */}
          <button
            onClick={() => {
              playSFX('click_ui');
              callStudentToBoard('s1');
            }}
            data-testid="btn-call-board"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#1F3EB7] hover:bg-[#293486] text-white text-xs font-bold shadow-md shadow-blue-950/40 transition-all cursor-pointer active:scale-95"
            title="Gọi học sinh lên bảng phát biểu"
          >
            <User className="w-3.5 h-3.5" />
            <span>Lên bảng</span>
          </button>

          {/* 3. Celebrate All Trigger (Brand Semantic Green) */}
          <button
            onClick={() => {
              playSFX('click_ui');
              celebrateAll();
            }}
            className="p-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white transition-all cursor-pointer active:scale-95 shrink-0"
            title="Cả lớp cùng nhảy ăn mừng"
          >
            <PartyPopper className="w-4 h-4" />
          </button>

          {/* 4. Reset All to Spawn Pods */}
          <button
            onClick={() => {
              playSFX('click_ui');
              resetAllToSpawn();
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer active:scale-95 shrink-0"
            title="Đưa học sinh về vị trí xuất phát"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* 5. Mute / Unmute Audio Toggle (Speaker) */}
          <button
            onClick={() => {
              toggleMute();
              playSFX('click_ui');
            }}
            data-testid="btn-audio-mute"
            className={`p-2.5 rounded-xl border transition-all cursor-pointer active:scale-95 shrink-0 ${
              isMuted
                ? 'bg-rose-950/50 text-rose-400 border-rose-800/80 hover:bg-rose-900/60'
                : 'bg-emerald-950/50 text-emerald-400 border-emerald-800/80 hover:bg-emerald-900/60'
            }`}
            title={isMuted ? 'Bật âm thanh (BGM & SFX)' : 'Tắt âm thanh (Mute)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* 6. Reset Camera View */}
          <button
            onClick={() => {
              playSFX('click_ui');
              resetCamera();
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer active:scale-95 shrink-0"
            title="Đặt lại góc nhìn camera mặc định"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
