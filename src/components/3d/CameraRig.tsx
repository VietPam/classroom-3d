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

  // Target positions & look-ats for each camera mode (Bottom-Left Corner looking diagonally up towards board)
  const targetCamPos = useRef(new THREE.Vector3(-2.8, 1.35, -1.0));
  const targetLookAt = useRef(new THREE.Vector3(0.1, 1.85, 5.0));

  useEffect(() => {
    const isPortrait = size.width < size.height;

    // Bottom-Left Corner Up-View: Looking from the bottom-left of the classroom diagonally up towards the front board
    if (mode === 'teacher_pov') {
      if (isPortrait) {
        // Mobile portrait: eye level at bottom-left corner, angled up towards board
        targetCamPos.current.set(-2.8, 1.35, -1.0);
        targetLookAt.current.set(0.1, 1.85, 5.0);
      } else {
        // Desktop landscape POV: slightly wider
        targetCamPos.current.set(-3.5, 1.40, -0.8);
        targetLookAt.current.set(0.2, 1.90, 5.0);
      }
    } else if (mode === 'overview') {
      if (isPortrait) {
        // Overview in portrait mode: high diagonal corner looking down at class & board
        targetCamPos.current.set(3.4, 3.4, 0.2);
        targetLookAt.current.set(0, 1.2, 2.5);
      } else {
        // Desktop landscape overview
        targetCamPos.current.set(3.8, 3.2, 0.5);
        targetLookAt.current.set(0, 1.2, 2.5);
      }
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
      controlsRef.current.target.copy(targetLookAt.current);
    }
  }, [mode, size.width, size.height, camera]);

  useFrame((_, delta) => {
    if (mode === 'teacher_pov') {
      camera.position.lerp(targetCamPos.current, delta * 4.0);
      camera.lookAt(targetLookAt.current);
    } else {
      if (controlsRef.current) {
        controlsRef.current.update();
      }
    }

    // Boundary safety: stay safely within the 3D room perimeter
    camera.position.z = Math.max(-7.5, Math.min(camera.position.z, 5.45));
    camera.position.y = Math.max(0.5, Math.min(camera.position.y, 3.9));
    camera.position.x = Math.max(-6.0, Math.min(camera.position.x, 6.0));
  });

  return mode === 'overview' ? (
    <OrbitControls
      ref={controlsRef}
      target={[0, 1.2, 2.5]}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={Math.PI / 6}
      minDistance={1.2}
      maxDistance={16}
      enablePan={true}
    />
  ) : null;
}

