import { Camera, RotateCcw } from 'lucide-react';
import type { ClassroomStore } from '../../hooks/useClassroomStore';

interface HUDProps {
  store: ClassroomStore;
}

export function HUD({ store }: HUDProps) {
  const { resetCamera } = store;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end items-center p-3 sm:p-5 select-none pb-[calc(1rem+env(safe-area-inset-bottom))]">
      {/* Bottom Control Dock: Only Toàn Cảnh Orbit & Reset View (as requested in IMG_3205.jpeg) */}
      <footer className="pointer-events-auto">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-slate-700/60 shadow-2xl">
          {/* Toàn Cảnh Orbit Button */}
          <button
            onClick={resetCamera}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-medium shadow-md transition-all cursor-pointer active:scale-95"
            title="Góc nhìn Toàn Cảnh Orbit (Click để đặt lại góc nhìn)"
          >
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Toàn Cảnh Orbit</span>
          </button>

          {/* Reset View Button */}
          <button
            onClick={resetCamera}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer active:scale-95 shrink-0"
            title="Đặt lại góc nhìn mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
