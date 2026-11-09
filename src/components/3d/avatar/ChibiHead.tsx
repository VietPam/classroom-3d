interface ChibiHeadProps {
  skinTone: string;
}

export function ChibiHead({ skinTone }: ChibiHeadProps) {
  return (
    <group position={[0, 0.46, 0]}>
      {/* Round Cute Chibi Head */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial color={skinTone} roughness={0.7} />
      </mesh>

      {/* Chubby Cheeks */}
      <mesh position={[-0.07, -0.02, 0.08]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={skinTone} roughness={0.7} />
      </mesh>
      <mesh position={[0.07, -0.02, 0.08]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={skinTone} roughness={0.7} />
      </mesh>

      {/* Rosy Anime Cheeks */}
      <mesh position={[-0.09, -0.02, 0.1]}>
        <circleGeometry args={[0.025, 16]} />
        <meshBasicMaterial color="#fb7185" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.09, -0.02, 0.1]}>
        <circleGeometry args={[0.025, 16]} />
        <meshBasicMaterial color="#fb7185" transparent opacity={0.6} />
      </mesh>

      {/* Left Obsidian Anime Eye */}
      <group position={[-0.05, 0.02, 0.115]}>
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
      <group position={[0.05, 0.02, 0.115]}>
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

      {/* Subtle Sweet Smile */}
      <mesh position={[0, -0.045, 0.12]} rotation={[Math.PI, 0, 0]}>
        <torusGeometry args={[0.014, 0.0025, 8, 16, Math.PI]} />
        <meshBasicMaterial color="#7c2d12" />
      </mesh>
    </group>
  );
}
