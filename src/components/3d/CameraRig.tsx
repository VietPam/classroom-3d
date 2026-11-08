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
  const targetCamPos = useRef(new THREE.Vector3(0, 1.72, 5.85));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.95, -1.0));

  useEffect(() => {
    const isPortrait = size.width < size.height;
    const aspect = size.width / Math.max(1, size.height);

    if (mode === 'teacher_pov') {
      if (isPortrait) {
        // In portrait mode, pull camera further back and slightly higher so both sides of classroom and teacher desk are visible
        const zOffset = (1 - Math.min(1, aspect)) * 2.2;
        targetCamPos.current.set(0, 1.92, 5.85 + zOffset);
        targetLookAt.current.set(0, 0.85, -0.6);
      } else {
        // Behind teacher desk looking forward over the students
        targetCamPos.current.set(0, 1.72, 5.85);
        targetLookAt.current.set(0, 0.95, -1.0);
      }
    } else if (mode === 'overview') {
      if (isPortrait) {
        targetCamPos.current.set(6.2, 5.8, 5.2);
        targetLookAt.current.set(0, 0.6, -1.0);
      } else {
        // High bird's eye orbit perspective showing the entire classroom
        targetCamPos.current.set(5.5, 4.8, 4.0);
        targetLookAt.current.set(0, 0.8, -1.2);
      }
    }

    // Adapt camera FOV dynamically to avoid narrow horizontal FOV in portrait mode
    if ('isPerspectiveCamera' in camera && (camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const persCamera = camera as THREE.PerspectiveCamera;
      const targetFov = isPortrait ? Math.min(68, Math.max(52, Math.round(52 / (aspect * 1.25)))) : 52;
      if (Math.abs(persCamera.fov - targetFov) > 0.5) {
        persCamera.fov = targetFov;
        persCamera.updateProjectionMatrix();
      }
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
      maxPolarAngle={mode === 'teacher_pov' ? Math.PI / 2.05 : Math.PI / 2.1}
      minPolarAngle={mode === 'teacher_pov' ? Math.PI / 3.2 : Math.PI / 6}
      minAzimuthAngle={mode === 'teacher_pov' ? -Math.PI / 4 : -Infinity}
      maxAzimuthAngle={mode === 'teacher_pov' ? Math.PI / 4 : Infinity}
      minDistance={1.2}
      maxDistance={mode === 'teacher_pov' ? 10 : 22}
      enablePan={mode === 'overview'}
    />
  );
}
