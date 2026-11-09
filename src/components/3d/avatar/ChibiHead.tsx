import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { CharacterState } from '../../../types/classroom';

interface ChibiHeadProps {
  skinTone: string;
  state?: CharacterState;
}

export function ChibiHead({ skinTone, state = 'IDLE' }: ChibiHeadProps) {
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Group>(null);

  // Natural anime periodic blink & dynamic facial expressions
  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    // Blink cycle every 3.8 seconds for ~0.14 seconds
    const cycle = (time + 0.8) % 3.8;
    let baseEyeScaleY = 1;
    let baseEyeScaleX = 1;

    if (state === 'SHOCKED') {
      // Dilated wide shock eyes, no blinking while shocked
      baseEyeScaleY = 1.35;
      baseEyeScaleX = 1.35;
    } else if (state === 'CELEBRATING') {
      // Joyful squinting smile eyes
      baseEyeScaleY = 0.78;
      baseEyeScaleX = 1.15;
    } else {
      if (cycle > 3.66) {
        const progress = (cycle - 3.66) / 0.14;
        baseEyeScaleY = 0.1 + Math.abs(progress - 0.5) * 1.8;
      }
    }

    const lerpFactor = Math.min(1, delta * 15);
    if (leftEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, baseEyeScaleY, lerpFactor);
      leftEyeRef.current.scale.x = THREE.MathUtils.lerp(leftEyeRef.current.scale.x, baseEyeScaleX, lerpFactor);
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, baseEyeScaleY, lerpFactor);
      rightEyeRef.current.scale.x = THREE.MathUtils.lerp(rightEyeRef.current.scale.x, baseEyeScaleX, lerpFactor);
    }

    // Mouth expression transition
    if (mouthRef.current) {
      const targetMouthScale = state === 'SHOCKED' ? 1.4 : state === 'CELEBRATING' ? 1.35 : 1.0;
      mouthRef.current.scale.setScalar(
        THREE.MathUtils.lerp(mouthRef.current.scale.x, targetMouthScale, lerpFactor)
      );
    }
  });

  return (
    // Local head anchor relative to neck pivot [0, 0.40, 0]
    <group position={[0, 0.06, 0]}>
      {/* Round Cute Chibi Head */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial color={skinTone} roughness={0.65} />
      </mesh>

      {/* Chubby Cheeks for cute anime silhouette */}
      <mesh position={[-0.07, -0.02, 0.08]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={skinTone} roughness={0.65} />
      </mesh>
      <mesh position={[0.07, -0.02, 0.08]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={skinTone} roughness={0.65} />
      </mesh>

      {/* Rosy Cheeks */}
      <mesh position={[-0.09, -0.02, 0.1]}>
        <circleGeometry args={[0.025, 16]} />
        <meshBasicMaterial color="#fb7185" transparent opacity={0.65} />
      </mesh>
      <mesh position={[0.09, -0.02, 0.1]}>
        <circleGeometry args={[0.025, 16]} />
        <meshBasicMaterial color="#fb7185" transparent opacity={0.65} />
      </mesh>

      {/* Left Obsidian Anime Eye */}
      <group ref={leftEyeRef} position={[-0.05, 0.02, 0.115]}>
        <mesh scale={[1, 1.2, 0.5]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshBasicMaterial color="#090d16" />
        </mesh>
        {/* Diamond Catchlight */}
        <mesh position={[0.007, 0.008, 0.01]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.005, -0.006, 0.008]}>
          <sphereGeometry args={[0.004, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Right Obsidian Anime Eye */}
      <group ref={rightEyeRef} position={[0.05, 0.02, 0.115]}>
        <mesh scale={[1, 1.2, 0.5]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshBasicMaterial color="#090d16" />
        </mesh>
        {/* Diamond Catchlight */}
        <mesh position={[-0.007, 0.008, 0.01]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.005, -0.006, 0.008]}>
          <sphereGeometry args={[0.004, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Mouth (Smile by default, O-shaped gasp during SHOCKED) */}
      <group ref={mouthRef} position={[0, -0.042, 0.12]}>
        {state === 'SHOCKED' ? (
          <mesh scale={[1, 1.3, 0.6]}>
            <torusGeometry args={[0.015, 0.004, 8, 16]} />
            <meshBasicMaterial color="#451a03" />
          </mesh>
        ) : (
          <mesh rotation={[Math.PI, 0, 0]}>
            <torusGeometry args={[0.014, 0.0025, 8, 16, Math.PI]} />
            <meshBasicMaterial color="#7c2d12" />
          </mesh>
        )}
      </group>
    </group>
  );
}
