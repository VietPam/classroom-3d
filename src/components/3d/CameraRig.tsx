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
    isPortrait ? new THREE.Vector3(0, 1.35, -3.2) : new THREE.Vector3(0, 1.45, -3.5)
  );
  const initialTarget = useRef(new THREE.Vector3(0, 1.5, 3.0));

  // Responsive camera setup on mount & resize
  useEffect(() => {
    const isPortrait = size.width < size.height;
    if (isPortrait) {
      initialCamPos.current.set(0, 1.35, -3.2);
      initialTarget.current.set(0, 1.5, 3.0);
    } else {
      initialCamPos.current.set(0, 1.45, -3.5);
      initialTarget.current.set(0, 1.5, 3.0);
    }

    if ('isPerspectiveCamera' in camera && (camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const persCamera = camera as THREE.PerspectiveCamera;
      const targetFov = isPortrait ? 68 : 54;
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
    camera.position.z = Math.max(-8.5, Math.min(camera.position.z, 5.5));
    camera.position.y = Math.max(0.4, Math.min(camera.position.y, 4.1));
    camera.position.x = Math.max(-6.5, Math.min(camera.position.x, 6.5));
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={[initialTarget.current.x, initialTarget.current.y, initialTarget.current.z]}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={Math.PI / 12}
      minDistance={1.0}
      maxDistance={18}
      enablePan={true}
      enableRotate={true}
      enableZoom={true}
    />
  );
}
