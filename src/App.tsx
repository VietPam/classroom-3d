import { Canvas } from '@react-three/fiber';
import { ClassroomScene } from './components/3d/ClassroomScene';
import { HUD } from './components/ui/HUD';
import { ScorecardModal } from './components/ui/ScorecardModal';
import { useClassroomStore } from './hooks/useClassroomStore';

export function App() {
  const store = useClassroomStore();

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{
          position: [-2.8, 1.35, -1.0],
          fov: 68,
          near: 0.1,
          far: 50,
        }}
        className="w-full h-full"
      >
        <ClassroomScene store={store} />
      </Canvas>

      {/* Heads-Up Display Overlay */}
      <HUD store={store} />

      {/* Exam Grading Scorecard Modal */}
      <ScorecardModal
        student={store.scorecardStudent}
        onDismiss={store.dismissScorecard}
      />
    </main>
  );
}

export default App;
