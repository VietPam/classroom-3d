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

  // Target positions & look-ats for each camera mode (Up-View looking from back towards IELTS board)
  const targetCamPos = useRef(new THREE.Vector3(0, 1.25, -3.2));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.65, 3.8));

  useEffect(() => {
    const isPortrait = size.width < size.height;

    // Up-View: Looking from the audience/back of the classroom up towards the front stage & IELTS board
    if (mode === 'teacher_pov') {
      if (isPortrait) {
        // Mobile portrait: eye level behind 3x3 rows, framed on IELTS Board & stage
        targetCamPos.current.set(0, 1.25, -3.2);
        targetLookAt.current.set(0, 1.65, 3.8);
      } else {
        // Desktop landscape POV: slightly wider
        targetCamPos.current.set(0, 1.35, -3.4);
        targetLookAt.current.set(0, 1.65, 3.8);
      }
    } else if (mode === 'overview') {
      if (isPortrait) {
        // Overview in portrait mode: high diagonal corner looking down at class & board
        targetCamPos.current.set(3.2, 3.2, -2.8);
        targetLookAt.current.set(0, 1.2, 1.0);
      } else {
        // Desktop landscape overview
        targetCamPos.current.set(3.8, 3.0, -2.5);
        targetLookAt.current.set(0, 1.2, 1.0);
      }
    }

    if ('isPerspectiveCamera' in camera && (camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const persCamera = camera as THREE.PerspectiveCamera;
      const targetFov = isPortrait ? 66 : 52;
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
      target={[0, 1.2, 1.0]}
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

