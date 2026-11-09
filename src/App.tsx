import { Canvas } from '@react-three/fiber';
import { ClassroomScene } from './components/3d/ClassroomScene';
import { HUD } from './components/ui/HUD';
import { useClassroomStore } from './hooks/useClassroomStore';

export function App() {
  const store = useClassroomStore();

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{
          position: [0, 1.35, -3.2],
          fov: 68,
          near: 0.1,
          far: 50,
        }}
        className="w-full h-full"
      >
        <ClassroomScene store={store} />
      </Canvas>

      {/* Heads-Up Display Overlay (Clean minimal dock) */}
      <HUD store={store} />
    </main>
  );
}

export default App;
