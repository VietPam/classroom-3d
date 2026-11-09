import { useRef } from 'react';
import type * as THREE from 'three';
import { useDeskGLTF } from './DeskGLTF';

interface StudentDeskProps {
  position: [number, number, number];
  seatId: string;
}

export function StudentDesk({
  position,
}: StudentDeskProps) {
  const deskRef = useRef<THREE.Group>(null);
  const { nodes, materials } = useDeskGLTF();

  return (
    <group ref={deskRef} position={position} scale={[0.38, 0.45, 0.38]}>
      {/* Desk Top Wood Plate */}
      <mesh
        geometry={nodes.Plate.geometry}
        material={materials.Plate}
        castShadow
        receiveShadow
      />

      {/* Metal Legs */}
      <mesh
        geometry={nodes.Legs01Left.geometry}
        material={materials.Metal}
        position={[-1.5, 0, 0]}
        castShadow
      />
      <mesh
        geometry={nodes.Legs01Right.geometry}
        material={materials.Metal}
        position={[1.5, 0, 0]}
        castShadow
      />
      <mesh
        geometry={nodes.Legs02Left.geometry}
        material={materials.Metal}
        position={[-1.5, 0, 0]}
        castShadow
      />
      <mesh
        geometry={nodes.Legs02Right.geometry}
        material={materials.Metal}
        position={[1.5, 0, 0]}
        castShadow
      />
    </group>
  );
}
