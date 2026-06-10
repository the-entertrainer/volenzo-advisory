import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

/**
 * LEAKS 3D — Optimal location: next to / above the Problem section rows.
 * 
 * Three distinct "conduits" representing ADM / NDC / GDS leaks.
 * 
 * Scroll-driven (future):
 *   - When user scrolls a specific problem-row into view, the matching conduit's 
 *     particle emission drops, color shifts red → brand blue, "valve" rotates closed.
 *   - A central recovered accumulator mesh grows.
 *   - GSAP can scrub a timeline that moves lights / camera target to the active leak.
 *
 * Currently a clean visual stub with three elegant cylinders + subtle animation.
 * Ready to receive leakProgress[0|1|2] (0 = fully leaking, 1 = fully recovered).
 */

function Conduit({ index, leakProgress = 0 }: { index: number; leakProgress?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const color = leakProgress > 0.6 ? '#0055FF' : '#D41C2C';

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * (0.8 + index * 0.1);
      // "Leak intensity" visualized as slight scale pulse + rotation when still leaking
      const intensity = 1 - leakProgress * 0.85;
      meshRef.current.scale.y = 1 + Math.sin(t * 2.5) * 0.015 * intensity;
      meshRef.current.rotation.z = Math.sin(t * 0.6) * 0.04 * intensity;
    }
  });

  return (
    <group position={[index * 2.8 - 2.8, 0, 0]}>
      {/* Main conduit */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.38, 0.32, 4.2, 5]} />
        <meshPhongMaterial color={color} shininess={18} />
      </mesh>

      {/* "Leak particles" representation (simple spheres for now; real = Points + custom shader) */}
      {leakProgress < 0.75 && Array.from({ length: 3 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[0.6 * (i - 1), -1.8 - i * 0.9, 0.3]}
        >
          <sphereGeometry args={[0.09 + (1 - leakProgress) * 0.06]} />
          <meshBasicMaterial color="#D41C2C" transparent opacity={0.6 + (1 - leakProgress) * 0.3} />
        </mesh>
      ))}
    </group>
  );
}

interface Leaks3DProps {
  leakProgress?: [number, number, number]; // per-leak 0 (leaking) → 1 (recovered)
  scrollProgress?: number;
}

export function Leaks3D({ leakProgress = [0.1, 0.1, 0.1], scrollProgress: _scrollProgress = 0 }: Leaks3DProps & { scrollProgress?: number }) {
  return (
    <div style={{ width: '100%', height: 280, position: 'relative' }}>
      <Canvas
        frameloop="always"
        dpr={[1, 1.4]}
        camera={{ position: [0, 0.8, 7.5], fov: 48 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 8, -6]} intensity={1.2} />

        {[0, 1, 2].map((i) => (
          <Conduit key={i} index={i} leakProgress={leakProgress[i]} />
        ))}

        {/* Subtle recovered "collector" plane at bottom */}
        <mesh position={[0, -3.1, 0]} rotation={[0.6, 0, 0]}>
          <planeGeometry args={[9, 2.6]} />
          <meshPhongMaterial color="#0a2540" shininess={4} />
        </mesh>
      </Canvas>

      <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center', fontSize: 10, opacity: 0.5, letterSpacing: '1px' }}>
        SCROLL TO RECOVER THE LEAKS — 3D visualization (WIP)
      </div>
    </div>
  );
}
