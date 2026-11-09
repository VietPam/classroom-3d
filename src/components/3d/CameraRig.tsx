import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface CameraRigProps {
  resetTrigger?: number;
}

export function CameraRig({ resetTrigger = 0 }: CameraRigProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera, size } = useThree();

  const isPortrait = size.width < size.height;
  const initialCamPos = useRef(
    isPortrait ? new THREE.Vector3(0, 3.2, -6.6) : new THREE.Vector3(0, 2.2, -6.2)
  );
  const initialTarget = useRef(
    isPortrait ? new THREE.Vector3(0, 1.9, 3.3) : new THREE.Vector3(0, 0.7, 1.8)
  );

  // Responsive camera setup on mount & resize
  useEffect(() => {
    const isPortrait = size.width < size.height;
    if (isPortrait) {
      initialCamPos.current.set(0, 3.2, -6.6);
      initialTarget.current.set(0, 1.9, 3.3);
    } else {
      initialCamPos.current.set(0, 2.2, -6.2);
      initialTarget.current.set(0, 0.7, 1.8);
    }

    if ('isPerspectiveCamera' in camera && (camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const persCamera = camera as THREE.PerspectiveCamera;
      const targetFov = isPortrait ? 73 : 52;
      if (Math.abs(persCamera.fov - targetFov) > 0.5) {
        persCamera.fov = targetFov;
        persCamera.updateProjectionMatrix();
      }
    }

    if (controlsRef.current) {
      controlsRef.current.target.copy(initialTarget.current);
      controlsRef.current.update();
    }
  }, [size.width, size.height, camera]);

  // Handle reset button / trigger
  useEffect(() => {
    if (resetTrigger > 0 && controlsRef.current) {
      camera.position.copy(initialCamPos.current);
      controlsRef.current.target.copy(initialTarget.current);
      controlsRef.current.update();
    }
  }, [resetTrigger, camera]);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }

    // Boundary safety: keep camera within reasonable 3D classroom boundary
    camera.position.z = Math.max(-10.0, Math.min(camera.position.z, 6.0));
    camera.position.y = Math.max(0.4, Math.min(camera.position.y, 6.0));
    camera.position.x = Math.max(-7.5, Math.min(camera.position.x, 7.5));
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={[initialTarget.current.x, initialTarget.current.y, initialTarget.current.z]}
      makeDefault
      enableDamping={false}
      enablePan={false}
      enableRotate={false}
      enableZoom={false}
    />
  );
}
