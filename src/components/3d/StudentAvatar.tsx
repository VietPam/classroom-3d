import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { StudentData, StudentState } from '../../types/classroom';
import { soundEngine } from '../../audio/SoundEngine';

interface StudentAvatarProps {
  data: StudentData;
  state: StudentState;
  isActive: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onStateAdvance: (newState: StudentState) => void;
}

export function StudentAvatar({
  data,
  state,
  isActive,
  isHovered,
  onSelect,
  onStateAdvance,
}: StudentAvatarProps) {
  // Master root group
  const rootGroupRef = useRef<THREE.Group>(null);

  // Limb pivot groups
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftKneeRef = useRef<THREE.Group>(null);
  const rightKneeRef = useRef<THREE.Group>(null);

  // Kinematic state trackers
  const progressRef = useRef(0);
  const lastFootstepRef = useRef(0);

  // Desk coordinates
  const [dx, , dz] = data.deskPosition;
  const seatPos: [number, number, number] = [dx, 0, dz - 0.38];
  const aislePos: [number, number, number] = [0, 0, dz - 0.38];
  const teacherDeskPos: [number, number, number] = [0, 0, 3.15];

  // Warm Stylized Capybara Color Palette
  const furColor = data.capybaraTone || data.skinTone || '#9d633b';
  const snoutColor = '#6d3c19';
  const nosePadColor = '#1f130b';
  const bellyColor = '#caa078';
  const innerEarColor = '#be8261';

  useFrame(({ clock }, delta) => {
    if (!rootGroupRef.current) return;
    const time = clock.getElapsedTime();

    // Subtle random seed per student so idle movements aren't synchronized
    const studentSeed = parseInt(data.id.replace('student-', ''), 10) * 1.37;

    // Helper to trigger footstep sound at gait peaks
    const checkFootstep = (gaitPhase: number) => {
      const step = Math.floor((gaitPhase / Math.PI) * 2);
      if (step !== lastFootstepRef.current) {
        lastFootstepRef.current = step;
        soundEngine.playFootstep();
      }
    };

    // ================= STATE 1: SEATED WRITING =================
    if (state === 'SEATED_WRITING') {
      rootGroupRef.current.position.set(seatPos[0], 0, seatPos[2]);
      rootGroupRef.current.rotation.set(0, 0, 0); // facing forward (+Z toward front/teacher)

      // Seated hips & thighs bent 90 deg forward
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = -Math.PI / 2;
        rightLegRef.current.rotation.x = -Math.PI / 2;
      }
      // Knees bent 90 deg down
      if (leftKneeRef.current && rightKneeRef.current) {
        leftKneeRef.current.rotation.x = Math.PI / 2;
        rightKneeRef.current.rotation.x = Math.PI / 2;
      }

      // Torso breathing & leaning slightly forward over desk
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.44;
        torsoRef.current.rotation.x = 0.12 + Math.sin(time * 1.5 + studentSeed) * 0.02;
        torsoRef.current.rotation.y = 0;
        torsoRef.current.rotation.z = 0;
      }

      // Head thinking, looking down at paper and nodding peacefully (facing teacher comfortably)
      if (headRef.current) {
        headRef.current.rotation.x = 0.08 + Math.cos(time * 1.1 + studentSeed) * 0.03;
        headRef.current.rotation.y = Math.sin(time * 0.6 + studentSeed) * 0.08;
      }

      // Left paw resting comfortably holding paper flat on desk
      if (leftArmRef.current) {
        leftArmRef.current.rotation.set(-0.62, 0, -0.25);
      }

      // Right paw actively scribbling pencil on test paper
      if (rightArmRef.current && rightForearmRef.current) {
        rightArmRef.current.rotation.set(
          -0.65 + Math.sin(time * 4 + studentSeed) * 0.04,
          0,
          0.2
        );
        rightForearmRef.current.rotation.set(
          -0.5 + Math.sin(time * 8 + studentSeed) * 0.05,
          0,
          0
        );
      }
    }

    // ================= STATE 2: STANDING UP =================
    else if (state === 'STANDING') {
      progressRef.current += delta * 1.2; // ~0.8s
      const t = Math.min(1, progressRef.current);

      // Thighs straighten from -PI/2 to 0
      const legAngle = (-Math.PI / 2) * (1 - t);
      const kneeAngle = (Math.PI / 2) * (1 - t);
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = legAngle;
        rightLegRef.current.rotation.x = legAngle;
      }
      if (leftKneeRef.current && rightKneeRef.current) {
        leftKneeRef.current.rotation.x = kneeAngle;
        rightKneeRef.current.rotation.x = kneeAngle;
      }

      // Torso shifts and rises to standing height (0.46)
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.44 + t * 0.02;
        torsoRef.current.rotation.x = Math.sin(t * Math.PI) * 0.15;
      }

      // Student steps back slightly as they stand
      rootGroupRef.current.position.set(seatPos[0], 0, seatPos[2] - t * 0.15);

      // Right paw lifts paper from desk
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(-0.4 * t, 0, 0.2);
      }

      if (t >= 1) {
        progressRef.current = 0;
        onStateAdvance('STEPPING_TO_AISLE');
      }
    }

    // ================= STATE 3: STEPPING TO AISLE =================
    else if (state === 'STEPPING_TO_AISLE') {
      progressRef.current += delta * 0.9;
      const t = Math.min(1, progressRef.current);

      // Interpolate from seat to aisle
      const curX = THREE.MathUtils.lerp(seatPos[0], aislePos[0], t);
      const curZ = seatPos[2] - 0.15;
      rootGroupRef.current.position.set(curX, 0, curZ);

      // Turn facing towards aisle center
      const targetAngle = seatPos[0] < 0 ? Math.PI / 2 : -Math.PI / 2;
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(0, targetAngle, Math.min(1, t * 2));

      // Side-step waddle walk cycle
      const gait = time * 7;
      checkFootstep(gait);
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(gait) * 0.45;
        rightLegRef.current.rotation.x = -Math.sin(gait) * 0.45;
      }
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.46 + Math.abs(Math.sin(gait)) * 0.025;
      }

      if (t >= 1) {
        progressRef.current = 0;
        onStateAdvance('WALKING_TO_TEACHER');
      }
    }

    // ================= STATE 4: WALKING TO TEACHER =================
    else if (state === 'WALKING_TO_TEACHER') {
      progressRef.current += delta * 0.35;
      const t = Math.min(1, progressRef.current);

      // Walk up center aisle (X = 0, Z from aislePos to teacher desk)
      const startZ = seatPos[2] - 0.15;
      const targetZ = teacherDeskPos[2];
      const curZ = THREE.MathUtils.lerp(startZ, targetZ, t);
      rootGroupRef.current.position.set(0, 0, curZ);

      // Face forward toward teacher (+Z is front)
      rootGroupRef.current.rotation.y = 0;

      // Cute energetic Capybara waddle walk cycle
      const gait = time * 8;
      checkFootstep(gait);

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(gait) * 0.55;
        rightLegRef.current.rotation.x = -Math.sin(gait) * 0.55;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(gait) * 0.4;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(-0.35, 0, 0.15); // holds test paper high
      }
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.46 + Math.abs(Math.sin(gait)) * 0.025;
        torsoRef.current.rotation.z = Math.sin(gait) * 0.06;
      }
      if (headRef.current) {
        headRef.current.rotation.x = Math.sin(gait * 2) * 0.05;
      }

      if (t >= 1) {
        progressRef.current = 0;
        onStateAdvance('HANDING_PAPER');
      }
    }

    // ================= STATE 5: HANDING PAPER =================
    else if (state === 'HANDING_PAPER') {
      progressRef.current += delta * 0.9;
      const t = Math.min(1, progressRef.current);

      rootGroupRef.current.position.set(0, 0, teacherDeskPos[2]);
      rootGroupRef.current.rotation.set(0, 0, 0);

      // Cute polite bow and extend paper to teacher
      const reachProgress = Math.sin(t * Math.PI);
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(-0.85 * reachProgress, 0, 0.05);
      }
      if (torsoRef.current) {
        torsoRef.current.rotation.x = reachProgress * 0.22;
        torsoRef.current.position.y = 0.46;
      }
      if (headRef.current) {
        headRef.current.rotation.x = reachProgress * 0.28;
      }

      if (t >= 1) {
        progressRef.current = 0;
        onStateAdvance('TURNING_AROUND');
      }
    }

    // ================= STATE 6: TURNING AROUND =================
    else if (state === 'TURNING_AROUND') {
      progressRef.current += delta * 1.5;
      const t = Math.min(1, progressRef.current);

      rootGroupRef.current.position.set(0, 0, teacherDeskPos[2]);
      // Smoothly rotate 180 degrees to face back toward desks (-Z)
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI, t);

      // Reset arm posture
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(0, 0, 0);
      }
      if (torsoRef.current) {
        torsoRef.current.rotation.set(0, 0, 0);
      }

      if (t >= 1) {
        progressRef.current = 0;
        onStateAdvance('WALKING_TO_SEAT');
      }
    }

    // ================= STATE 7: WALKING TO SEAT =================
    else if (state === 'WALKING_TO_SEAT') {
      progressRef.current += delta * 0.35;
      const t = Math.min(1, progressRef.current);

      // Walk back down aisle toward student row
      const startZ = teacherDeskPos[2];
      const targetZ = seatPos[2] - 0.15;
      const curZ = THREE.MathUtils.lerp(startZ, targetZ, t);
      rootGroupRef.current.position.set(0, 0, curZ);

      // Face back toward desk (-Z)
      rootGroupRef.current.rotation.y = Math.PI;

      // Relaxed, relieved happy walk waddle
      const gait = time * 7.5;
      checkFootstep(gait);

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(gait) * 0.45;
        rightLegRef.current.rotation.x = -Math.sin(gait) * 0.45;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(gait) * 0.35;
        rightArmRef.current.rotation.x = Math.sin(gait) * 0.35;
      }
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.46 + Math.abs(Math.sin(gait)) * 0.025;
        torsoRef.current.rotation.z = -Math.sin(gait) * 0.05;
      }
      if (headRef.current) {
        headRef.current.rotation.x = Math.sin(gait * 2) * 0.04;
      }

      if (t >= 1) {
        progressRef.current = 0;
        onStateAdvance('SITTING_DOWN');
      }
    }

    // ================= STATE 8: SITTING DOWN =================
    else if (state === 'SITTING_DOWN') {
      progressRef.current += delta * 1.0;
      const t = Math.min(1, progressRef.current);

      // Step back from aisle to chair seat
      const curX = THREE.MathUtils.lerp(aislePos[0], seatPos[0], t);
      const curZ = seatPos[2] - 0.15 * (1 - t);
      rootGroupRef.current.position.set(curX, 0, curZ);

      // Rotate to face forward again
      const startAngle = seatPos[0] < 0 ? Math.PI / 2 : -Math.PI / 2;
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(startAngle, 0, t);

      // Legs bend back to sitting -PI/2
      const legAngle = (-Math.PI / 2) * t;
      const kneeAngle = (Math.PI / 2) * t;
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = legAngle;
        rightLegRef.current.rotation.x = legAngle;
      }
      if (leftKneeRef.current && rightKneeRef.current) {
        leftKneeRef.current.rotation.x = kneeAngle;
        rightKneeRef.current.rotation.x = kneeAngle;
      }

      // Torso lowers smoothly to seated height (0.44)
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.46 - t * 0.02;
      }

      if (t >= 1) {
        progressRef.current = 0;
        onStateAdvance('COMPLETED');
      }
    }

    // ================= STATE 9: COMPLETED (DONE EXAM) =================
    else if (state === 'COMPLETED') {
      rootGroupRef.current.position.set(seatPos[0], 0, seatPos[2]);
      rootGroupRef.current.rotation.set(0, 0, 0);

      // Relaxed, happy, zen seated posture
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = -Math.PI / 2;
        rightLegRef.current.rotation.x = -Math.PI / 2;
      }
      if (leftKneeRef.current && rightKneeRef.current) {
        leftKneeRef.current.rotation.x = Math.PI / 2;
        rightKneeRef.current.rotation.x = Math.PI / 2;
      }
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.44;
        torsoRef.current.rotation.set(0, 0, 0);
      }
      if (headRef.current) {
        headRef.current.rotation.set(
          Math.sin(time * 0.7 + studentSeed) * 0.05,
          Math.cos(time * 0.5 + studentSeed) * 0.1,
          0
        );
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.set(-0.5, 0, 0.2);
        rightArmRef.current.rotation.set(-0.5, 0, -0.2);
      }
    }
  });

  const isCarryingPaper =
    state === 'STANDING' ||
    state === 'STEPPING_TO_AISLE' ||
    state === 'WALKING_TO_TEACHER' ||
    state === 'HANDING_PAPER';

  return (
    <group
      ref={rootGroupRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Selection / Hover Glow ring on ground */}
      {(isHovered || isActive) && (
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.32, 0.48, 32]} />
          <meshBasicMaterial
            color={isActive ? '#38bdf8' : '#facc15'}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}

      {/* Floating Name Badge when hovered or active */}
      {(isHovered || isActive) && (
        <group position={[0, 1.88, 0]}>
          <mesh>
            <boxGeometry args={[0.82, 0.22, 0.02]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.015]}>
            <planeGeometry args={[0.78, 0.18]} />
            <meshBasicMaterial color={isActive ? '#0284c7' : '#1e293b'} />
          </mesh>
        </group>
      )}

      {/* ================= TORSO & CAPYBARA BODY ================= */}
      <group ref={torsoRef} position={[0, 0.44, 0]}>
        {/* Chubby Pear-shaped Pelvis / Lower Body */}
        <mesh castShadow scale={[1.15, 0.95, 1.15]}>
          <sphereGeometry args={[0.22, 28, 28]} />
          <meshStandardMaterial color={furColor} roughness={0.75} />
        </mesh>

        {/* Cute stubby Capybara tail at back */}
        <mesh position={[0, -0.06, -0.22]} castShadow>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color={snoutColor} roughness={0.8} />
        </mesh>

        {/* Chest with Cozy Student Sweater / Robe */}
        <group position={[0, 0.22, 0]}>
          <mesh castShadow scale={[1.16, 1.0, 1.08]}>
            <capsuleGeometry args={[0.17, 0.16, 16, 28]} />
            <meshStandardMaterial
              color={isHovered ? '#fbbf24' : data.shirtColor}
              roughness={0.65}
            />
          </mesh>

          {/* Soft rounded sweater collar */}
          <mesh position={[0, 0.21, 0.03]} rotation={[Math.PI / 2 + 0.15, 0, 0]}>
            <torusGeometry args={[0.12, 0.028, 16, 32]} />
            <meshStandardMaterial color="#fef08a" roughness={0.5} />
          </mesh>

          {/* Cozy tummy patch under sweater */}
          <mesh position={[0, 0.02, 0.14]} scale={[0.85, 1.1, 0.35]}>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color={bellyColor} roughness={0.8} />
          </mesh>

          {/* Accessory: Red Ribbon Bow */}
          {data.accessory === 'red_bow' && (
            <group position={[0, 0.16, 0.21]}>
              {/* Left loop */}
              <mesh position={[-0.04, 0.01, 0]} rotation={[0, 0, 0.4]}>
                <torusGeometry args={[0.035, 0.014, 12, 24]} />
                <meshStandardMaterial color="#e11d48" roughness={0.4} />
              </mesh>
              {/* Right loop */}
              <mesh position={[0.04, 0.01, 0]} rotation={[0, 0, -0.4]}>
                <torusGeometry args={[0.035, 0.014, 12, 24]} />
                <meshStandardMaterial color="#e11d48" roughness={0.4} />
              </mesh>
              {/* Center knot */}
              <mesh>
                <sphereGeometry args={[0.022, 12, 12]} />
                <meshStandardMaterial color="#be123c" roughness={0.3} />
              </mesh>
              {/* Ribbon tails */}
              <mesh position={[-0.025, -0.04, -0.005]} rotation={[0, 0, 0.3]}>
                <capsuleGeometry args={[0.01, 0.05, 8, 12]} />
                <meshStandardMaterial color="#e11d48" />
              </mesh>
              <mesh position={[0.025, -0.04, -0.005]} rotation={[0, 0, -0.3]}>
                <capsuleGeometry args={[0.01, 0.05, 8, 12]} />
                <meshStandardMaterial color="#e11d48" />
              </mesh>
            </group>
          )}

          {/* ================= ICONIC ORGANIC CAPYBARA HEAD ================= */}
          <group ref={headRef} position={[0, 0.35, 0.06]}>
            {/* Neck */}
            <mesh position={[0, -0.10, -0.02]}>
              <cylinderGeometry args={[0.10, 0.13, 0.12, 24]} />
              <meshStandardMaterial color={furColor} roughness={0.8} />
            </mesh>

            {/* Main Capybara Organic Pear-shaped Head */}
            <mesh position={[0, 0.02, 0.02]} scale={[1.04, 1.16, 1.35]} castShadow>
              <sphereGeometry args={[0.20, 32, 32]} />
              <meshStandardMaterial color={furColor} roughness={0.75} />
            </mesh>

            {/* Chubby Cute Cheeks (Left & Right) */}
            <mesh position={[-0.11, -0.04, 0.08]} scale={[1.05, 0.95, 1.05]} castShadow>
              <sphereGeometry args={[0.11, 24, 24]} />
              <meshStandardMaterial color={furColor} roughness={0.75} />
            </mesh>
            <mesh position={[0.11, -0.04, 0.08]} scale={[1.05, 0.95, 1.05]} castShadow>
              <sphereGeometry args={[0.11, 24, 24]} />
              <meshStandardMaterial color={furColor} roughness={0.75} />
            </mesh>

            {/* Lower Chin / Throat warm tone */}
            <mesh position={[0, -0.10, 0.10]} scale={[1.1, 0.7, 1.2]} castShadow>
              <sphereGeometry args={[0.12, 20, 20]} />
              <meshStandardMaterial color={bellyColor} roughness={0.8} />
            </mesh>

            {/* Smooth Rounded Snout */}
            <mesh
              position={[0, -0.02, 0.22]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[1.12, 1.0, 0.95]}
              castShadow
            >
              <capsuleGeometry args={[0.09, 0.09, 16, 28]} />
              <meshStandardMaterial color={snoutColor} roughness={0.75} />
            </mesh>

            {/* Cute Rounded Black Button Nose Pad */}
            <mesh position={[0, 0.036, 0.315]} scale={[1.3, 0.85, 0.9]} castShadow>
              <sphereGeometry args={[0.034, 20, 20]} />
              <meshStandardMaterial color={nosePadColor} roughness={0.35} metalness={0.1} />
            </mesh>

            {/* Nostrils */}
            <mesh position={[-0.022, 0.032, 0.336]}>
              <sphereGeometry args={[0.007, 8, 8]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
            <mesh position={[0.022, 0.032, 0.336]}>
              <sphereGeometry args={[0.007, 8, 8]} />
              <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Sweet chill mouth line */}
            <mesh position={[0, -0.025, 0.306]} rotation={[Math.PI, 0, 0]}>
              <torusGeometry args={[0.026, 0.004, 8, 16, Math.PI]} />
              <meshBasicMaterial color="#2d1606" />
            </mesh>

            {/* ================= PROMINENT SPARKLING ANIME CAPYBARA EYES ================= */}
            {/* Positioned clearly on the front of the face, above snout, facing camera */}
            {/* Left Eye */}
            <group position={[-0.088, 0.076, 0.242]} rotation={[-0.08, -0.22, 0.06]}>
              {/* Eye Socket Contour Ring */}
              <mesh position={[0, 0, -0.006]} scale={[1.15, 1.18, 0.5]}>
                <sphereGeometry args={[0.038, 24, 24]} />
                <meshStandardMaterial color={snoutColor} roughness={0.8} />
              </mesh>
              {/* Glossy Obsidian Eyeball */}
              <mesh scale={[1.0, 1.08, 0.9]} castShadow>
                <sphereGeometry args={[0.036, 28, 28]} />
                <meshStandardMaterial color="#070a12" roughness={0.04} metalness={0.25} />
              </mesh>
              {/* Relaxed / Calm Zen Eyelid across top */}
              <mesh position={[0, 0.022, 0.016]} rotation={[-0.18, 0, -0.12]}>
                <boxGeometry args={[0.056, 0.018, 0.022]} />
                <meshStandardMaterial color={furColor} roughness={0.75} />
              </mesh>
              {/* Eyelid crease line */}
              <mesh position={[0, 0.031, 0.022]} rotation={[0, 0, -0.1]}>
                <boxGeometry args={[0.046, 0.003, 0.006]} />
                <meshBasicMaterial color="#3b1d08" />
              </mesh>
              {/* Primary Sparkling Diamond Catchlight */}
              <mesh position={[0.012, 0.012, 0.030]}>
                <sphereGeometry args={[0.012, 14, 14]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              {/* Secondary Soft Anime Catchlight */}
              <mesh position={[-0.010, -0.010, 0.028]}>
                <sphereGeometry args={[0.007, 10, 10]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
              </mesh>
              {/* Tertiary Tiny Sparkle */}
              <mesh position={[0.014, -0.006, 0.029]}>
                <sphereGeometry args={[0.0035, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>

            {/* Right Eye */}
            <group position={[0.088, 0.076, 0.242]} rotation={[-0.08, 0.22, -0.06]}>
              {/* Eye Socket Contour Ring */}
              <mesh position={[0, 0, -0.006]} scale={[1.15, 1.18, 0.5]}>
                <sphereGeometry args={[0.038, 24, 24]} />
                <meshStandardMaterial color={snoutColor} roughness={0.8} />
              </mesh>
              {/* Glossy Obsidian Eyeball */}
              <mesh scale={[1.0, 1.08, 0.9]} castShadow>
                <sphereGeometry args={[0.036, 28, 28]} />
                <meshStandardMaterial color="#070a12" roughness={0.04} metalness={0.25} />
              </mesh>
              {/* Relaxed / Calm Zen Eyelid across top */}
              <mesh position={[0, 0.022, 0.016]} rotation={[-0.18, 0, 0.12]}>
                <boxGeometry args={[0.056, 0.018, 0.022]} />
                <meshStandardMaterial color={furColor} roughness={0.75} />
              </mesh>
              {/* Eyelid crease line */}
              <mesh position={[0, 0.031, 0.022]} rotation={[0, 0, 0.1]}>
                <boxGeometry args={[0.046, 0.003, 0.006]} />
                <meshBasicMaterial color="#3b1d08" />
              </mesh>
              {/* Primary Sparkling Diamond Catchlight */}
              <mesh position={[-0.012, 0.012, 0.030]}>
                <sphereGeometry args={[0.012, 14, 14]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              {/* Secondary Soft Anime Catchlight */}
              <mesh position={[0.010, -0.010, 0.028]}>
                <sphereGeometry args={[0.007, 10, 10]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
              </mesh>
              {/* Tertiary Tiny Sparkle */}
              <mesh position={[-0.014, -0.006, 0.029]}>
                <sphereGeometry args={[0.0035, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>

            {/* Cute Rosy Cheeks (Soft Anime Blush) */}
            <mesh position={[-0.145, -0.012, 0.215]} rotation={[0, -0.52, 0]}>
              <circleGeometry args={[0.038, 24]} />
              <meshBasicMaterial color="#fb7185" transparent opacity={0.65} />
            </mesh>
            <mesh position={[0.145, -0.012, 0.215]} rotation={[0, 0.52, 0]}>
              <circleGeometry args={[0.038, 24]} />
              <meshBasicMaterial color="#fb7185" transparent opacity={0.65} />
            </mesh>

            {/* Cute Whisker Muzzle Freckles */}
            {[-0.018, 0, 0.018].map((offsetY, i) => (
              <group key={`whisker-dot-${i}`}>
                <mesh position={[-0.078, -0.02 + offsetY * 0.7, 0.292]}>
                  <sphereGeometry args={[0.003, 8, 8]} />
                  <meshBasicMaterial color="#3b1d08" />
                </mesh>
                <mesh position={[0.078, -0.02 + offsetY * 0.7, 0.292]}>
                  <sphereGeometry args={[0.003, 8, 8]} />
                  <meshBasicMaterial color="#3b1d08" />
                </mesh>
              </group>
            ))}

            {/* Cute Rounded Cupped Ears */}
            {/* Left Ear */}
            <group position={[-0.14, 0.14, -0.04]} rotation={[0.2, -0.3, -0.35]}>
              <mesh castShadow scale={[1.0, 1.25, 0.6]}>
                <capsuleGeometry args={[0.032, 0.03, 14, 20]} />
                <meshStandardMaterial color={snoutColor} roughness={0.8} />
              </mesh>
              <mesh position={[0, 0, 0.012]} scale={[0.85, 0.95, 0.5]}>
                <sphereGeometry args={[0.026, 16, 16]} />
                <meshStandardMaterial color={innerEarColor} roughness={0.7} />
              </mesh>
            </group>
            {/* Right Ear */}
            <group position={[0.14, 0.14, -0.04]} rotation={[0.2, 0.3, 0.35]}>
              <mesh castShadow scale={[1.0, 1.25, 0.6]}>
                <capsuleGeometry args={[0.032, 0.03, 14, 20]} />
                <meshStandardMaterial color={snoutColor} roughness={0.8} />
              </mesh>
              <mesh position={[0, 0, 0.012]} scale={[0.85, 0.95, 0.5]}>
                <sphereGeometry args={[0.026, 16, 16]} />
                <meshStandardMaterial color={innerEarColor} roughness={0.7} />
              </mesh>
            </group>

            {/* ================= MEME ACCESSORIES ================= */}
            {/* 1. Iconic Yuzu Orange on Head */}
            {data.accessory === 'orange' && (
              <group position={[0, 0.22, 0.04]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.08, 24, 24]} />
                  <meshStandardMaterial color="#ea580c" roughness={0.35} />
                </mesh>
                {/* Stem */}
                <mesh position={[0, 0.08, 0]}>
                  <cylinderGeometry args={[0.008, 0.008, 0.03, 12]} />
                  <meshStandardMaterial color="#15803d" />
                </mesh>
                {/* Cute curved green leaf */}
                <mesh
                  position={[0.03, 0.085, 0]}
                  rotation={[0.3, 0, 0.6]}
                  scale={[1, 0.25, 1.8]}
                >
                  <sphereGeometry args={[0.032, 14, 14]} />
                  <meshStandardMaterial color="#22c55e" roughness={0.4} />
                </mesh>
              </group>
            )}

            {/* 2. Pink Lotus Flower on Head */}
            {data.accessory === 'lotus' && (
              <group position={[0, 0.19, 0.04]}>
                {/* Golden pistil center */}
                <mesh>
                  <sphereGeometry args={[0.035, 16, 16]} />
                  <meshStandardMaterial color="#facc15" roughness={0.3} />
                </mesh>
                {/* Delicate curved petals */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <mesh
                    key={deg}
                    rotation={[0.4, (deg * Math.PI) / 180, 0]}
                    position={[0, 0.015, 0]}
                    scale={[0.8, 0.3, 1.4]}
                  >
                    <sphereGeometry args={[0.035, 12, 12]} />
                    <meshStandardMaterial color="#f472b6" roughness={0.4} />
                  </mesh>
                ))}
              </group>
            )}

            {/* 3. Round Scholar Wire Glasses */}
            {data.accessory === 'glasses' && (
              <group position={[0, 0.048, 0.22]}>
                {/* Left Lens ring */}
                <mesh position={[-0.09, 0, 0]}>
                  <torusGeometry args={[0.046, 0.006, 16, 32]} />
                  <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Right Lens ring */}
                <mesh position={[0.09, 0, 0]}>
                  <torusGeometry args={[0.046, 0.006, 16, 32]} />
                  <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Glasses Bridge */}
                <mesh position={[0, 0.015, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.005, 0.005, 0.09, 8]} />
                  <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
                </mesh>
              </group>
            )}

            {/* 4. Scholar / Graduation Mortarboard Hat */}
            {data.accessory === 'scholar_hat' && (
              <group position={[0, 0.21, 0.02]} rotation={[0.06, 0.12, -0.04]}>
                {/* Cap base */}
                <mesh position={[0, -0.02, 0]}>
                  <cylinderGeometry args={[0.11, 0.12, 0.05, 24]} />
                  <meshStandardMaterial color="#1e1b4b" roughness={0.5} />
                </mesh>
                {/* Flat square board */}
                <mesh position={[0, 0.02, 0]} castShadow>
                  <boxGeometry args={[0.28, 0.015, 0.28]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.5} />
                </mesh>
                {/* Golden button & tassel */}
                <mesh position={[0, 0.035, 0]}>
                  <sphereGeometry args={[0.018, 12, 12]} />
                  <meshStandardMaterial color="#facc15" metalness={0.8} />
                </mesh>
                <mesh position={[0.10, -0.02, 0.10]} rotation={[0, 0, 0.2]}>
                  <cylinderGeometry args={[0.006, 0.012, 0.1, 10]} />
                  <meshStandardMaterial color="#facc15" roughness={0.4} />
                </mesh>
              </group>
            )}
          </group>

          {/* ================= LEFT PAW / ARM ================= */}
          <group ref={leftArmRef} position={[-0.23, 0.14, 0]}>
            {/* Shoulder */}
            <mesh castShadow>
              <sphereGeometry args={[0.065, 20, 20]} />
              <meshStandardMaterial color={data.shirtColor} roughness={0.65} />
            </mesh>
            {/* Upper arm sleeve */}
            <mesh position={[0, -0.11, 0]} castShadow>
              <capsuleGeometry args={[0.048, 0.13, 14, 20]} />
              <meshStandardMaterial color={data.shirtColor} roughness={0.65} />
            </mesh>
            {/* Forearm & Furry Paw */}
            <group position={[0, -0.21, 0]}>
              <mesh position={[0, -0.07, 0]} castShadow>
                <capsuleGeometry args={[0.042, 0.12, 14, 20]} />
                <meshStandardMaterial color={furColor} roughness={0.75} />
              </mesh>
              {/* Chubby Cute Paw */}
              <mesh position={[0, -0.15, 0.03]} scale={[1.15, 0.85, 1.25]} castShadow>
                <sphereGeometry args={[0.048, 20, 20]} />
                <meshStandardMaterial color={snoutColor} roughness={0.7} />
              </mesh>
              {/* 3 Cute Paw Claws / Beans */}
              {[-0.028, 0, 0.028].map((px) => (
                <mesh key={`lpaw-${px}`} position={[px, -0.165, 0.07]}>
                  <sphereGeometry args={[0.012, 10, 10]} />
                  <meshStandardMaterial color={nosePadColor} roughness={0.5} />
                </mesh>
              ))}
            </group>
          </group>

          {/* ================= RIGHT PAW / ARM ================= */}
          <group ref={rightArmRef} position={[0.23, 0.14, 0]}>
            {/* Shoulder */}
            <mesh castShadow>
              <sphereGeometry args={[0.065, 20, 20]} />
              <meshStandardMaterial color={data.shirtColor} roughness={0.65} />
            </mesh>
            {/* Upper arm sleeve */}
            <mesh position={[0, -0.11, 0]} castShadow>
              <capsuleGeometry args={[0.048, 0.13, 14, 20]} />
              <meshStandardMaterial color={data.shirtColor} roughness={0.65} />
            </mesh>
            {/* Forearm & Furry Paw */}
            <group ref={rightForearmRef} position={[0, -0.21, 0]}>
              <mesh position={[0, -0.07, 0]} castShadow>
                <capsuleGeometry args={[0.042, 0.12, 14, 20]} />
                <meshStandardMaterial color={furColor} roughness={0.75} />
              </mesh>
              {/* Chubby Cute Paw */}
              <mesh position={[0, -0.15, 0.03]} scale={[1.15, 0.85, 1.25]} castShadow>
                <sphereGeometry args={[0.048, 20, 20]} />
                <meshStandardMaterial color={snoutColor} roughness={0.7} />
              </mesh>
              {/* 3 Cute Paw Claws / Beans */}
              {[-0.028, 0, 0.028].map((px) => (
                <mesh key={`rpaw-${px}`} position={[px, -0.165, 0.07]}>
                  <sphereGeometry args={[0.012, 10, 10]} />
                  <meshStandardMaterial color={nosePadColor} roughness={0.5} />
                </mesh>
              ))}

              {/* Exam Paper held in right paw while walking or handing in */}
              {isCarryingPaper && (
                <group position={[0.02, -0.15, 0.14]} rotation={[0.4, 0, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.22, 0.005, 0.28]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.5} />
                  </mesh>
                  {/* Red Exam Seal on paper */}
                  <mesh position={[0.06, 0.004, 0.08]}>
                    <cylinderGeometry args={[0.022, 0.022, 0.006, 16]} />
                    <meshBasicMaterial color="#e11d48" />
                  </mesh>
                  {/* Paper Header Lines */}
                  <mesh position={[-0.02, 0.004, -0.08]}>
                    <planeGeometry args={[0.14, 0.018]} />
                    <meshBasicMaterial color="#1e293b" />
                  </mesh>
                  <mesh position={[0, 0.004, -0.03]}>
                    <planeGeometry args={[0.18, 0.012]} />
                    <meshBasicMaterial color="#94a3b8" />
                  </mesh>
                  <mesh position={[0, 0.004, 0.01]}>
                    <planeGeometry args={[0.18, 0.012]} />
                    <meshBasicMaterial color="#94a3b8" />
                  </mesh>
                </group>
              )}
            </group>
          </group>
        </group>
      </group>

      {/* ================= HIND LEGS & FEET ================= */}
      {/* Left Hind Leg */}
      <group position={[-0.13, 0.44, 0]}>
        <group ref={leftLegRef}>
          {/* Chubby Thigh */}
          <mesh position={[0, -0.13, 0]} castShadow>
            <capsuleGeometry args={[0.068, 0.18, 16, 20]} />
            <meshStandardMaterial color={furColor} roughness={0.75} />
          </mesh>
          {/* Knee & Calf */}
          <group ref={leftKneeRef} position={[0, -0.28, 0]}>
            <mesh position={[0, -0.13, 0]} castShadow>
              <capsuleGeometry args={[0.058, 0.16, 16, 20]} />
              <meshStandardMaterial color={furColor} roughness={0.75} />
            </mesh>
            {/* Rounded Chubby Hind Paw */}
            <mesh position={[0, -0.28, 0.06]} scale={[1.1, 0.8, 1.35]} castShadow>
              <capsuleGeometry args={[0.052, 0.08, 14, 20]} />
              <meshStandardMaterial color={snoutColor} roughness={0.7} />
            </mesh>
            {/* Hind Toe Beans */}
            {[-0.03, 0, 0.03].map((px) => (
              <mesh key={`lhfoot-${px}`} position={[px, -0.31, 0.13]}>
                <sphereGeometry args={[0.014, 10, 10]} />
                <meshStandardMaterial color={nosePadColor} roughness={0.5} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* Right Hind Leg */}
      <group position={[0.13, 0.44, 0]}>
        <group ref={rightLegRef}>
          {/* Chubby Thigh */}
          <mesh position={[0, -0.13, 0]} castShadow>
            <capsuleGeometry args={[0.068, 0.18, 16, 20]} />
            <meshStandardMaterial color={furColor} roughness={0.75} />
          </mesh>
          {/* Knee & Calf */}
          <group ref={rightKneeRef} position={[0, -0.28, 0]}>
            <mesh position={[0, -0.13, 0]} castShadow>
              <capsuleGeometry args={[0.058, 0.16, 16, 20]} />
              <meshStandardMaterial color={furColor} roughness={0.75} />
            </mesh>
            {/* Rounded Chubby Hind Paw */}
            <mesh position={[0, -0.28, 0.06]} scale={[1.1, 0.8, 1.35]} castShadow>
              <capsuleGeometry args={[0.052, 0.08, 14, 20]} />
              <meshStandardMaterial color={snoutColor} roughness={0.7} />
            </mesh>
            {/* Hind Toe Beans */}
            {[-0.03, 0, 0.03].map((px) => (
              <mesh key={`rhfoot-${px}`} position={[px, -0.31, 0.13]}>
                <sphereGeometry args={[0.014, 10, 10]} />
                <meshStandardMaterial color={nosePadColor} roughness={0.5} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}
