interface CapybaraAccessoriesProps {
  accessory?: 'orange' | 'lotus' | 'glasses' | 'scholar_hat' | 'red_bow' | 'none';
}

export function CapybaraAccessories({ accessory }: CapybaraAccessoriesProps) {
  if (!accessory || accessory === 'none') return null;

  return (
    <group position={[0.2, 0.22, 0]}>
      {/* 1. Iconic Yuzu Orange on Head */}
      {accessory === 'orange' && (
        <group position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
          <mesh castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#ea580c" roughness={0.35} />
          </mesh>
          {/* Stem */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.03, 8]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
          {/* Leaf */}
          <mesh position={[0.03, 0.085, 0]} rotation={[0.3, 0, 0.6]} scale={[1, 0.25, 1.8]}>
            <sphereGeometry args={[0.032, 10, 10]} />
            <meshStandardMaterial color="#22c55e" roughness={0.4} />
          </mesh>
        </group>
      )}

      {/* 2. Pink Lotus Flower on Head */}
      {accessory === 'lotus' && (
        <group position={[0, -0.02, 0]} scale={[0.8, 0.8, 0.8]}>
          <mesh>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#facc15" roughness={0.3} />
          </mesh>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <mesh
              key={deg}
              rotation={[0.4, (deg * Math.PI) / 180, 0]}
              position={[0, 0.015, 0]}
              scale={[0.8, 0.3, 1.4]}
            >
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshStandardMaterial color="#f472b6" roughness={0.4} />
            </mesh>
          ))}
        </group>
      )}

      {/* 3. Round Scholar Wire Glasses */}
      {accessory === 'glasses' && (
        <group position={[0.1, -0.15, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.8, 0.8, 0.8]}>
          <mesh position={[-0.09, 0, 0]}>
            <torusGeometry args={[0.046, 0.006, 12, 24]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.09, 0, 0]}>
            <torusGeometry args={[0.046, 0.006, 12, 24]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.015, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.005, 0.005, 0.09, 8]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* 4. Scholar / Graduation Mortarboard Hat */}
      {accessory === 'scholar_hat' && (
        <group position={[0, 0.02, 0]} scale={[0.75, 0.75, 0.75]}>
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.11, 0.12, 0.05, 16]} />
            <meshStandardMaterial color="#1e1b4b" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.28, 0.015, 0.28]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.035, 0]}>
            <sphereGeometry args={[0.018, 10, 10]} />
            <meshStandardMaterial color="#facc15" metalness={0.8} />
          </mesh>
          <mesh position={[0.1, -0.02, 0.1]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.006, 0.012, 0.1, 8]} />
            <meshStandardMaterial color="#facc15" roughness={0.4} />
          </mesh>
        </group>
      )}

      {/* 5. Red Ribbon Bow */}
      {accessory === 'red_bow' && (
        <group position={[0, -0.01, 0]} scale={[0.8, 0.8, 0.8]}>
          <mesh position={[-0.04, 0.01, 0]} rotation={[0, 0, 0.4]}>
            <torusGeometry args={[0.035, 0.014, 10, 20]} />
            <meshStandardMaterial color="#e11d48" roughness={0.4} />
          </mesh>
          <mesh position={[0.04, 0.01, 0]} rotation={[0, 0, -0.4]}>
            <torusGeometry args={[0.035, 0.014, 10, 20]} />
            <meshStandardMaterial color="#e11d48" roughness={0.4} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.022, 10, 10]} />
            <meshStandardMaterial color="#be123c" roughness={0.3} />
          </mesh>
        </group>
      )}
    </group>
  );
}
