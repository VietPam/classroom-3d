import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { CameraMode } from '../../types/classroom';

interface CameraRigProps {
  mode: CameraMode;
}

export function CameraRig({ mode }: CameraRigProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera, size } = useThree();

  // Target positions & look-ats for each camera mode
  const targetCamPos = useRef(new THREE.Vector3(0, 1.82, 5.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.85, -1.0));

  useEffect(() => {
    const isPortrait = size.width < size.height;

    // Room boundaries: X in [-6.5, 6.5], Y in [0.5, 3.8] (ceiling at 4.2), Z in [-8.5, 5.7] (front wall at 6.0)
    if (mode === 'teacher_pov') {
      if (isPortrait) {
        // Teacher POV in portrait mode: At teacher desk, looking down over the classroom
        targetCamPos.current.set(0, 1.85, 5.35);
        targetLookAt.current.set(0, 0.85, -0.8);
      } else {
        // Desktop landscape POV
        targetCamPos.current.set(0, 1.75, 5.5);
        targetLookAt.current.set(0, 0.9, -1.0);
      }
    } else if (mode === 'overview') {
      if (isPortrait) {
        // Overview in portrait mode: high angle corner, safely below ceiling (Y < 4.0) and inside walls
        targetCamPos.current.set(4.8, 3.8, 4.2);
        targetLookAt.current.set(0, 0.7, -1.2);
      } else {
        // Desktop landscape overview
        targetCamPos.current.set(4.8, 3.6, 4.2);
        targetLookAt.current.set(0, 0.7, -1.2);
      }
    }

    if ('isPerspectiveCamera' in camera && (camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const persCamera = camera as THREE.PerspectiveCamera;
      const targetFov = isPortrait ? 66 : 50;
      if (Math.abs(persCamera.fov - targetFov) > 0.5) {
        persCamera.fov = targetFov;
        persCamera.updateProjectionMatrix();
      }
    }

    if (controlsRef.current) {
      controlsRef.current.target.copy(targetLookAt.current);
    }
  }, [mode, size.width, size.height, camera]);

  useFrame((_, delta) => {
    // Smooth cinematic interpolation when switching modes
    camera.position.lerp(targetCamPos.current, delta * 3.5);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, delta * 3.5);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={Math.PI / 6}
      minDistance={1.2}
      maxDistance={mode === 'teacher_pov' ? 8 : 16}
      enablePan={mode === 'overview'}
    />
  );
}

