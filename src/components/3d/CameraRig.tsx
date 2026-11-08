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
  const { camera } = useThree();

  // Target positions & look-ats for each camera mode
  const targetCamPos = useRef(new THREE.Vector3(0, 1.72, 5.85));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.95, -1.0));

  useEffect(() => {
    if (mode === 'teacher_pov') {
      // Behind teacher desk looking forward over the students
      targetCamPos.current.set(0, 1.72, 5.85);
      targetLookAt.current.set(0, 0.95, -1.0);
    } else if (mode === 'overview') {
      // High bird's eye orbit perspective showing the entire classroom
      targetCamPos.current.set(5.5, 4.8, 4.0);
      targetLookAt.current.set(0, 0.8, -1.2);
    }
  }, [mode]);

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
      maxDistance={mode === 'teacher_pov' ? 6.5 : 18}
      enablePan={mode === 'overview'}
    />
  );
}
