interface LaptopProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  screenColor?: string;
}

export function Laptop({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  screenColor = '#0284c7',
}: LaptopProps) {
  return (
    <group position={position} rotation={rotation} scale={[0.85, 0.85, 0.85]}>
      {/* ================= LAPTOP BASE ================= */}
      {/* Aluminum Bottom Chassis */}
      <mesh position={[0, 0.004, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.26, 0.008, 0.18]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Chiclet Keyboard Area */}
      <mesh position={[0, 0.0085, -0.015]}>
        <boxGeometry args={[0.22, 0.002, 0.09]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Touchpad */}
      <mesh position={[0, 0.0085, 0.05]}>
        <boxGeometry args={[0.08, 0.001, 0.05]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* ================= LAPTOP SCREEN LID (Opened 110 deg) ================= */}
      <group position={[0, 0.008, -0.09]} rotation={[0.35, 0, 0]}>
        {/* Aluminum Outer Lid Back */}
        <mesh position={[0, 0.085, -0.003]} castShadow>
          <boxGeometry args={[0.26, 0.17, 0.006]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Inner Screen Bezel */}
        <mesh position={[0, 0.085, 0.001]}>
          <planeGeometry args={[0.25, 0.16]} />
          <meshBasicMaterial color="#090d16" />
        </mesh>

        {/* Emissive Glowing Display (Coding / UI Screen Glow) */}
        <mesh position={[0, 0.085, 0.002]}>
          <planeGeometry args={[0.23, 0.14]} />
          <meshStandardMaterial
            color={screenColor}
            emissive={screenColor}
            emissiveIntensity={0.65}
            roughness={0.2}
          />
        </mesh>

        {/* Code Editor Mock Lines on Screen */}
        {[-0.04, -0.02, 0, 0.02, 0.04].map((y, i) => (
          <mesh key={`code-line-${i}`} position={[-0.03 + (i % 2) * 0.02, 0.085 + y, 0.003]}>
            <planeGeometry args={[0.12 - (i % 3) * 0.03, 0.006]} />
            <meshBasicMaterial color="#f8fafc" transparent opacity={0.75} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
