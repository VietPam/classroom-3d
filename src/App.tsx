import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ClassroomScene } from './components/3d/ClassroomScene';
import { ClassroomStage2D } from './components/stage2d/ClassroomStage2D';
import { HUD } from './components/ui/HUD';
import { useClassroomStore } from './hooks/useClassroomStore';

export function App() {
  const store = useClassroomStore();

  // Kiểm tra chế độ 3D tùy chọn (?3d=1). Mặc định là 2.5D Hybrid siêu nhẹ (giống repo Chùa)
  const is3DMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('3d') === '1';
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {is3DMode ? (
        /* Chế độ 3D Three.js WebGL (?3d=1) */
        <Canvas
          shadows
          camera={{
            position: [0, 2.8, -6.5],
            fov: 68,
            near: 0.1,
            far: 50,
          }}
          className="w-full h-full"
        >
          <ClassroomScene store={store} />
        </Canvas>
      ) : (
        /* Chế độ 2.5D Hybrid Mặc định: Sân khấu Anime + Chibi 2D + Canvas Hạt */
        <ClassroomStage2D store={store} />
      )}

      {/* Heads-Up Display Overlay (Clean minimal dock) */}
      <HUD store={store} />
    </main>
  );
}

export default App;
