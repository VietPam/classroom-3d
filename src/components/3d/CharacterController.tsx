import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { StudentData, CharacterState } from '../../types/classroom';

export interface LocomotionContext {
  isWalking: boolean;
  state: CharacterState;
}

export interface CharacterControllerProps {
  data: StudentData;
  children: (context: LocomotionContext) => React.ReactNode;
}

export function CharacterController({ data, children }: CharacterControllerProps) {
  const rootGroupRef = useRef<THREE.Group>(null);

  // Position & Rotation Tracking
  const currentPos = useRef(
    new THREE.Vector3(data.deskPosition[0], 0, data.deskPosition[2])
  );
  const currentYaw = useRef(0);
  const [isWalking, setIsWalking] = useState(false);

  // Target destination
  const targetX = data.targetPosition ? data.targetPosition[0] : data.deskPosition[0];
  const targetZ = data.targetPosition ? data.targetPosition[2] : data.deskPosition[2];

  // Character state
  const state = data.currentState || 'IDLE';

  // Smooth Movement & Steering in useFrame
  useFrame((_, delta) => {
    // 1. Calculate vector to target
    const dx = targetX - currentPos.current.x;
    const dz = targetZ - currentPos.current.z;
    const dist = Math.hypot(dx, dz);

    let walkingNow = false;

    if (dist > 0.06) {
      walkingNow = true;
      // Moving towards target: steer toward movement vector
      const targetYaw = Math.atan2(dx, dz);
      let diff = targetYaw - currentYaw.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      currentYaw.current += diff * Math.min(1, delta * 12);

      // Move along vector (speed: 2.6 m/s)
      const step = Math.min(dist, 2.6 * delta);
      currentPos.current.x += (dx / dist) * step;
      currentPos.current.z += (dz / dist) * step;
    } else {
      // Arrived at destination
      walkingNow = false;

      // Desired idle facing angle:
      // When at Quiz Zone or Podium, face forward towards the camera (yaw = Math.PI)
      // When back at Spawn, face the blackboard (yaw = 0)
      let targetYaw = 0;
      if (
        state === 'THINKING' ||
        state === 'CELEBRATING' ||
        state === 'SAD'
      ) {
        targetYaw = Math.PI;
      }

      let diff = targetYaw - currentYaw.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      currentYaw.current += diff * Math.min(1, delta * 6);
    }

    if (walkingNow !== isWalking) {
      setIsWalking(walkingNow);
    }

    // Apply position & rotation to root 3D group
    if (rootGroupRef.current) {
      rootGroupRef.current.position.set(
        currentPos.current.x,
        0,
        currentPos.current.z
      );
      rootGroupRef.current.rotation.y = currentYaw.current;
    }
  });

  return (
    <group
      ref={rootGroupRef}
      position={[data.deskPosition[0], 0, data.deskPosition[2]]}
    >
      {children({ isWalking, state })}
    </group>
  );
}
