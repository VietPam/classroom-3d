interface ChibiHairProps {
  hairStyle: 'short' | 'curly' | 'ponytail' | 'buzz';
  hairColor: string;
}

export function ChibiHair({ hairStyle, hairColor }: ChibiHairProps) {
  return (
    <group position={[0, 0.06, 0]}>
      {/* 1. SHORT HAIR */}
      {hairStyle === 'short' && (
        <group>
          {/* Main Hair Cap */}
          <mesh position={[0, 0.04, -0.01]} scale={[1.06, 1.05, 1.05]}>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
          {/* Front Bangs Fringe */}
          <mesh position={[0, 0.08, 0.09]} rotation={[0.4, 0, 0]}>
            <capsuleGeometry args={[0.04, 0.12, 10, 16]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
          {/* Sideburns */}
          <mesh position={[-0.12, 0, 0.02]} scale={[0.3, 1, 0.6]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
          <mesh position={[0.12, 0, 0.02]} scale={[0.3, 1, 0.6]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* 2. PONYTAIL HAIR */}
      {hairStyle === 'ponytail' && (
        <group>
          <mesh position={[0, 0.04, -0.01]} scale={[1.06, 1.05, 1.05]}>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
          {/* Front bangs */}
          <mesh position={[-0.04, 0.08, 0.09]} rotation={[0.4, 0, -0.2]}>
            <capsuleGeometry args={[0.035, 0.08, 8, 12]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
          <mesh position={[0.04, 0.08, 0.09]} rotation={[0.4, 0, 0.2]}>
            <capsuleGeometry args={[0.035, 0.08, 8, 12]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
          {/* Hair Tie */}
          <mesh position={[0, 0.08, -0.14]}>
            <torusGeometry args={[0.025, 0.008, 8, 16]} />
            <meshStandardMaterial color="#f43f5e" roughness={0.5} />
          </mesh>
          {/* High Ponytail Tail */}
          <mesh position={[0, 0.02, -0.19]} rotation={[0.6, 0, 0]} scale={[0.8, 1.4, 0.8]}>
            <capsuleGeometry args={[0.045, 0.12, 10, 16]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* 3. CURLY HAIR */}
      {hairStyle === 'curly' && (
        <group>
          <mesh position={[0, 0.05, -0.01]} scale={[1.08, 1.08, 1.08]}>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color={hairColor} roughness={0.9} />
          </mesh>
          {/* Puffy Side Curls */}
          {[-0.12, -0.07, 0, 0.07, 0.12].map((x, i) => (
            <mesh key={`curl-${i}`} position={[x, 0.1, 0.05]} scale={[1.1, 1.1, 1.1]}>
              <sphereGeometry args={[0.04, 10, 10]} />
              <meshStandardMaterial color={hairColor} roughness={0.9} />
            </mesh>
          ))}
          <mesh position={[-0.13, 0.02, 0.02]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color={hairColor} roughness={0.9} />
          </mesh>
          <mesh position={[0.13, 0.02, 0.02]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color={hairColor} roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* 4. BUZZ CUT */}
      {hairStyle === 'buzz' && (
        <group>
          <mesh position={[0, 0.04, 0]} scale={[1.03, 1.02, 1.03]}>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color={hairColor} roughness={0.95} />
          </mesh>
        </group>
      )}
    </group>
  );
}
