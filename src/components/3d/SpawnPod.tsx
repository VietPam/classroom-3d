import { useRef } from 'react';
import type * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface SpawnPodProps {
  position: [number, number, number];
  accentColor?: string;
}

export function SpawnPod({
  position,
  accentColor = '#38bdf8',
}: SpawnPodProps) {
  const glowRingRef = useRef<THREE.Mesh>(null);

  // Subtle breathing pulse for the spawn pad
  useFrame(({ clock }) => {
    if (!glowRingRef.current) return;
    const time = clock.getElapsedTime();
    const pulse = 0.5 + Math.sin(time * 2.5 + position[0]) * 0.25;
    if (glowRingRef.current.material) {
      (glowRingRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
  });

  return (
    <group position={position}>
      {/* Base Beveled Floor Plate */}
      <mesh position={[0, 0.006, 0]} receiveShadow>
        <cylinderGeometry args={[0.38, 0.40, 0.012, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Outer Metallic Dark Rim */}
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.01, 8, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Glowing Cyber Accent Ring */}
      <mesh
        ref={glowRingRef}
        position={[0, 0.013, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.32, 0.35, 32]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Inner Non-slip Texture Pad */}
      <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.30, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.85} metalness={0.2} />
      </mesh>

      {/* Center Small Marker Dot */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.06, 16]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}
