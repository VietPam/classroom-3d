import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { StudentData } from '../../types/classroom';
import { useCapybaraGLTF } from './CapybaraGLTF';
import { CapybaraAccessories } from './CapybaraAccessories';

interface StudentAvatarProps {
  data: StudentData;
}

export function StudentAvatar({ data }: StudentAvatarProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const { nodes, materials } = useCapybaraGLTF();

  const [dx, , dz] = data.deskPosition;
  const seatPos: [number, number, number] = [dx, 0.05, dz - 0.28];

  // Unique custom materials per student for custom fur / clothing tone
  const furColor = data.capybaraTone || data.skinTone || '#9d633b';
  const customFurMaterial = useMemo(() => {
    const mat = materials.zoo_capybara.clone();
    mat.color = new THREE.Color(furColor);
    mat.roughness = 0.8;
    return mat;
  }, [furColor, materials.zoo_capybara]);

  const customShirtMaterial = useMemo(() => {
    const mat = materials.zoo_capybara.clone();
    mat.color = new THREE.Color(data.shirtColor);
    mat.roughness = 0.6;
    return mat;
  }, [data.shirtColor, materials.zoo_capybara]);

  useFrame(({ clock }) => {
    if (!rootGroupRef.current) return;
    const time = clock.getElapsedTime();
    const studentSeed = parseInt(data.id.replace('student-', '').replace('s', ''), 10) * 1.37;

    // Peaceful idle breathing & head bobbing
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(time * 1.6 + studentSeed) * 0.04;
      headRef.current.rotation.y = Math.cos(time * 1.2 + studentSeed) * 0.05;
    }
    if (rootGroupRef.current) {
      rootGroupRef.current.position.y = seatPos[1] + Math.sin(time * 2 + studentSeed) * 0.005;
    }
  });

  return (
    <group
      ref={rootGroupRef}
      position={seatPos}
      rotation={[0, Math.PI / 2, 0]}
      scale={[0.7, 0.7, 0.7]}
    >
      {/* GLTF Model hierarchy */}
      <group name="animal_root">
        {/* Head with dynamic idle rotation */}
        <group ref={headRef} position={[0.56, 0.68, 0]}>
          <mesh
            name="head"
            geometry={nodes.head.geometry}
            material={customFurMaterial}
            castShadow
          >
            <mesh
              name="capybara_cheek_-1"
              geometry={nodes['capybara_cheek_-1'].geometry}
              material={customFurMaterial}
              position={[0.16, -0.03, 0.16]}
            />
            <mesh
              name="capybara_cheek_1"
              geometry={nodes.capybara_cheek_1.geometry}
              material={customFurMaterial}
              position={[0.16, -0.03, -0.16]}
            />
            <mesh
              name="ear_-1"
              geometry={nodes['ear_-1'].geometry}
              material={customFurMaterial}
              position={[0, 0.164, 0.144]}
            />
            <mesh
              name="ear_1"
              geometry={nodes.ear_1.geometry}
              material={customFurMaterial}
              position={[0, 0.164, -0.144]}
            />
            <mesh
              name="eye_left"
              geometry={nodes.eye_left.geometry}
              material={materials.zoo_black}
              position={[0.132, 0.05, 0.13]}
            />
            <mesh
              name="eye_right"
              geometry={nodes.eye_right.geometry}
              material={materials.zoo_black}
              position={[0.132, 0.05, -0.13]}
            />
            <mesh
              name="muzzle"
              geometry={nodes.muzzle.geometry}
              material={customFurMaterial}
              position={[0.197, -0.035, 0]}
            />
            <mesh
              name="nose"
              geometry={nodes.nose.geometry}
              material={materials.zoo_black}
              position={[0.3, -0.02, 0]}
            />
          </mesh>

          {/* Student Accessory on top of head */}
          <CapybaraAccessories accessory={data.accessory} />
        </group>

        {/* Body wearing colorful student sweater */}
        <mesh
          name="body"
          geometry={nodes.body.geometry}
          material={customShirtMaterial}
          position={[0, 0.68, 0]}
          castShadow
        />

        {/* Tail */}
        <mesh
          name="tail"
          geometry={nodes.tail.geometry}
          material={customFurMaterial}
          position={[-0.532, 0.72, 0]}
          rotation={[0, 0, -Math.PI / 2]}
        />

        {/* Seated / Resting legs */}
        <mesh
          name="leg_0"
          geometry={nodes.leg_0.geometry}
          material={customFurMaterial}
          position={[-0.38, 0.59, 0.22]}
          castShadow
        >
          <mesh
            name="hoof_0"
            geometry={nodes.hoof_0.geometry}
            material={materials.zoo_black}
            position={[0, -0.535, -0.025]}
          />
        </mesh>
        <mesh
          name="leg_1"
          geometry={nodes.leg_1.geometry}
          material={customFurMaterial}
          position={[-0.38, 0.59, -0.22]}
          castShadow
        >
          <mesh
            name="hoof_1"
            geometry={nodes.hoof_1.geometry}
            material={materials.zoo_black}
            position={[0, -0.535, -0.025]}
          />
        </mesh>
        <mesh
          name="leg_2"
          geometry={nodes.leg_2.geometry}
          material={customFurMaterial}
          position={[0.38, 0.59, 0.22]}
          castShadow
        >
          <mesh
            name="hoof_2"
            geometry={nodes.hoof_2.geometry}
            material={materials.zoo_black}
            position={[0, -0.535, -0.025]}
          />
        </mesh>
        <mesh
          name="leg_3"
          geometry={nodes.leg_3.geometry}
          material={customFurMaterial}
          position={[0.38, 0.59, -0.22]}
          castShadow
        >
          <mesh
            name="hoof_3"
            geometry={nodes.hoof_3.geometry}
            material={materials.zoo_black}
            position={[0, -0.535, -0.025]}
          />
        </mesh>
      </group>
    </group>
  );
}
