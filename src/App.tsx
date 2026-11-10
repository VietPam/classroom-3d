import { ClassroomStage2D } from './components/stage2d/ClassroomStage2D';
import { HUD } from './components/ui/HUD';
import { useClassroomStore } from './hooks/useClassroomStore';

export function App() {
  const store = useClassroomStore();

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* Sân khấu 2.5D Hybrid Vector: Anime + Chibi 2D SVG + Canvas Hạt */}
      <ClassroomStage2D store={store} />

      {/* Heads-Up Display Overlay (Clean minimal dock) */}
      <HUD store={store} />
    </main>
  );
}

export default App;
