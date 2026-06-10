import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { content } from '../../lib/content';
import type { ScrollProgress } from '../../hooks/useScrollProgress';

/**
 * HERO 3D SCENE — Encapsulated, scroll-synced cinematic experience.
 *
 * - Procedural aircraft + floating holographic data cards (using original terminal data pool).
 * - progressRef (from useScrollProgress) is read every frame with zero React cost.
 * - Camera slowly dollies + plane banks as user scrolls the hero.
 * - Cards rise, rotate and "recover" influence based on scroll.
 *
 * Future upgrades (see OVERHAUL_PLAN.md):
 *   - Load real compressed .glb plane via useGLTF
 *   - Custom shaders for flowing data leaks (red → blue recovery)
 *   - Instanced cards + real particle systems
 *   - GSAP timeline scrubbing for complex sequences
 *   - frameloop="demand" + invalidate only on significant progress change
 */

function ProceduralPlane({ progressRef }: { progressRef?: React.MutableRefObject<ScrollProgress> }) {
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!group.current) return;

    const p = progressRef?.current?.hero ?? 0;
    const t = state.clock.elapsedTime * 0.55;

    // Scroll-driven cinematic motion
    group.current.rotation.y = t * 0.12 + p * 2.1;           // bank + slow spin with scroll
    group.current.position.y = Math.sin(t * 0.7) * 0.18 + p * -0.6;
    group.current.position.z = p * -0.8;

    group.current.scale.setScalar(1 + p * 0.015);
  });

  return (
    <group ref={group}>
      {/* Fuselage */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.48, 4.8, 5, 1, false]} />
        <meshPhongMaterial color="#1f2a44" shininess={12} specular="#222" />
      </mesh>

      {/* Nose cone */}
      <mesh position={[0, 0, -2.9]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.48, 1.6, 5]} />
        <meshPhongMaterial color="#111a2e" />
      </mesh>

      {/* Wings (main) */}
      <mesh position={[0, 0.05, -0.4]} rotation={[0, 0, 0]}>
        <boxGeometry args={[7.2, 0.12, 1.6]} />
        <meshPhongMaterial color="#0f172a" />
      </mesh>

      {/* Engines */}
      <mesh position={[-2.6, 0, -0.6]}>
        <cylinderGeometry args={[0.22, 0.22, 1.1, 6]} />
        <meshPhongMaterial color="#334155" />
      </mesh>
      <mesh position={[2.6, 0, -0.6]}>
        <cylinderGeometry args={[0.22, 0.22, 1.1, 6]} />
        <meshPhongMaterial color="#334155" />
      </mesh>

      {/* Tail */}
      <mesh position={[0, 0.9, 2.1]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.12, 1.6, 1.1]} />
        <meshPhongMaterial color="#111a2e" />
      </mesh>

      {/* Data leak accents (will evolve into proper particles/shaders) */}
      <mesh position={[-1.8, -0.3, 0.2]}>
        <sphereGeometry args={[0.18]} />
        <meshBasicMaterial color="#D41C2C" transparent opacity={0.65} />
      </mesh>
      <mesh position={[1.9, -0.25, 0.1]}>
        <sphereGeometry args={[0.15]} />
        <meshBasicMaterial color="#D41C2C" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function FloatingDataCard({ data, index, progressRef }: { 
  data: (typeof content.terminalDataPool)[number]; 
  index: number; 
  progressRef?: React.MutableRefObject<ScrollProgress>;
}) {
  const ref = useRef<THREE.Group>(null!);
  const value = data.range[0] + (data.range[1] - data.range[0]) * 0.5;

  useFrame((state) => {
    if (!ref.current) return;
    const p = progressRef?.current?.hero ?? 0;
    const t = state.clock.elapsedTime + index * 1.7;

    ref.current.position.y = Math.sin(t * 0.65) * 0.35 + p * 1.4 - index * 0.15;
    ref.current.rotation.y = Math.sin(t * 0.28) * 0.12 + p * 1.1;
    ref.current.position.x = ((index % 2 === 0 ? -3.6 : 3.6) + (index - 2) * 0.35) + p * (index % 2 === 0 ? 1.2 : -1.2);
  });

  const isDanger = data.type === 'danger';

  return (
    <group ref={ref} position={[
      (index % 2 === 0 ? -3.6 : 3.6) + (index - 2) * 0.35, 
      1.4 - index * 0.85, 
      -0.8 + (index % 3) * 0.55
    ]}>
      <mesh>
        <planeGeometry args={[2.7, 1.3]} />
        <meshPhongMaterial 
          color={isDanger ? '#3a1518' : '#0f253f'} 
          side={THREE.DoubleSide} 
          shininess={28} 
        />
      </mesh>

      <Html position={[0, 0.12, 0.02]} style={{ pointerEvents: 'none' }} transform>
        <div style={{
          width: '250px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '10.5px',
          color: '#fff',
          textAlign: 'center',
          lineHeight: 1.12,
          opacity: 0.92,
        }}>
          <div style={{ fontSize: '8.5px', letterSpacing: '1.6px', opacity: 0.55, marginBottom: 1 }}>
            {data.label}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: isDanger ? '#ff6b6b' : '#7dd3fc' }}>
            {data.prefix}{value.toFixed(data.dec)}{data.suffix}
          </div>
          <div style={{ fontSize: '8.5px', opacity: 0.5, marginTop: 1 }}>
            {data.metas[0]}
          </div>
        </div>
      </Html>
    </group>
  );
}

function Scene({ progressRef }: { progressRef?: React.MutableRefObject<ScrollProgress> }) {
  const { camera } = useThree();

  useFrame(() => {
    const p = progressRef?.current?.hero ?? 0;
    camera.position.z = 9.2 - p * 2.8;
    camera.position.y = 1.15 + p * 0.35;
    camera.lookAt(0, 0.1 + p * -0.4, 0);
  });

  return (
    <>
      <ambientLight intensity={0.52} />
      <directionalLight position={[-6, 12, -4]} intensity={1.15} />
      <hemisphereLight args={['#a8c9e8', '#0b1426', 0.55]} />

      <ProceduralPlane progressRef={progressRef} />

      {content.terminalDataPool.slice(0, 6).map((entry, i) => (
        <FloatingDataCard 
          key={i} 
          data={entry} 
          index={i} 
          progressRef={progressRef} 
        />
      ))}

      <gridHelper args={[26, 13, '#1e3a5f', '#132a44']} position={[0, -2.5, 0]} />

      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={3.5} 
        maxDistance={17}
        enableDamping 
        dampingFactor={0.1}
      />
    </>
  );
}

interface Hero3DProps {
  progressRef?: React.MutableRefObject<ScrollProgress>;
}

export function Hero3D({ progressRef }: Hero3DProps) {
  return (
    <div className="three-canvas-container" style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        frameloop="always"
        dpr={[1, 1.5]}
        camera={{ fov: 42, near: 0.5, far: 200, position: [0, 1.15, 9.2] }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          preserveDrawingBuffer: false,
          powerPreference: 'high-performance' 
        }}
        style={{ background: 'transparent' }}
      >
        <Scene progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
