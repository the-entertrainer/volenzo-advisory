import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { content } from '../../lib/content';

/**
 * HERO 3D SCENE — First encapsulated professional 3D component
 * 
 * Current (MVP): Procedural "commercial aircraft" metaphor + floating data cards.
 * Future (per OVERHAUL_PLAN):
 *   - Real .glb low-poly plane loaded via useGLTF + DRACO
 *   - Scroll-synced camera + object transforms (rotation, position, scale)
 *   - Material uniforms for "leak" shaders (red particles → blue recovered)
 *   - GSAP timeline scrubbing for complex cinematic sequences
 *   - Instanced data cards from terminalDataPool
 *   - Performance: frameloop="demand", low dpr, invalidate on scroll only
 *
 * Scroll integration pattern (to be wired in next step via useScrollProgress hook):
 *   const { progress } = useScrollProgress();
 *   useFrame(() => {
 *     // camera.position.z = THREE.MathUtils.lerp(9, 4.5, progress.hero);
 *     // planeGroup.current.rotation.y = progress.hero * Math.PI * 0.6;
 *     // material.uniforms.uLeakIntensity.value = 1 - progress.problem; // example
 *   });
 */

function ProceduralPlane({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!group.current) return;

    // Basic autonomous animation (will be replaced by scroll-driven values)
    const t = state.clock.elapsedTime * 0.6;
    group.current.rotation.y = t * 0.15 + scrollProgress * 1.8; // slight bank with simulated scroll
    group.current.position.y = Math.sin(t * 0.8) * 0.15;

    // Example of scroll influence on "leak" elements (scale a warning element)
    // group.current.scale.setScalar(1 + scrollProgress * 0.03);
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

      {/* Winglets / engines (simple) */}
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

      {/* Subtle "data leak" red accents (will become particle systems + shader driven) */}
      <mesh position={[-1.8, -0.3, 0.2]}>
        <sphereGeometry args={[0.18]} />
        <meshBasicMaterial color="#D41C2C" transparent opacity={0.7} />
      </mesh>
      <mesh position={[1.9, -0.25, 0.1]}>
        <sphereGeometry args={[0.15]} />
        <meshBasicMaterial color="#D41C2C" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

function FloatingDataCard({ data, index, scrollProgress = 0 }: { 
  data: (typeof content.terminalDataPool)[number]; 
  index: number; 
  scrollProgress?: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  const value = data.range[0] + (data.range[1] - data.range[0]) * 0.5; // static representative

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + index * 2;
    // Gentle autonomous float + scroll influence (replace with real progress)
    ref.current.position.y = Math.sin(t * 0.7) * 0.4 + scrollProgress * 1.2;
    ref.current.rotation.y = Math.sin(t * 0.3) * 0.15 + scrollProgress * 0.8;
  });

  const isDanger = data.type === 'danger';

  return (
    <group ref={ref} position={[
      (index % 2 === 0 ? -3.8 : 3.8) + (index - 2) * 0.4, 
      1.5 - index * 0.9, 
      -1 + (index % 3) * 0.6
    ]}>
      {/* Simple card plane (will become rounded + backface + real Text/Html) */}
      <mesh>
        <planeGeometry args={[2.8, 1.35]} />
        <meshPhongMaterial 
          color={isDanger ? '#3a1518' : '#0f253f'} 
          side={THREE.DoubleSide} 
          shininess={30} 
        />
      </mesh>

      {/* Label / value as Html for crisp text (drei Html portals over WebGL) */}
      <Html position={[0, 0.15, 0.02]} style={{ pointerEvents: 'none' }} transform>
        <div style={{
          width: '260px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '11px',
          color: '#fff',
          textAlign: 'center',
          lineHeight: 1.15,
          opacity: 0.95,
        }}>
          <div style={{ fontSize: '9px', letterSpacing: '1.5px', opacity: 0.6, marginBottom: 2 }}>
            {data.label}
          </div>
          <div style={{ fontSize: '17px', fontWeight: 600, color: isDanger ? '#ff6b6b' : '#7dd3fc' }}>
            {data.prefix}{value.toFixed(data.dec)}{data.suffix}
          </div>
          <div style={{ fontSize: '9px', opacity: 0.55, marginTop: 2 }}>
            {data.metas[0]}
          </div>
        </div>
      </Html>
    </group>
  );
}

function Scene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const { camera } = useThree();

  // Initial cinematic camera
  camera.position.set(0, 1.2, 9.5);
  camera.lookAt(0, 0.2, 0);

  return (
    <>
      {/* Lighting — professional, cinematic, low cost */}
      <ambientLight intensity={0.55} />
      <directionalLight 
        position={[-6, 12, -4]} 
        intensity={1.1} 
        castShadow={false}
      />
      <hemisphereLight 
        args={['#a8c9e8', '#0b1426', 0.6]} 
      />

      {/* The aircraft */}
      <ProceduralPlane scrollProgress={scrollProgress} />

      {/* Floating data cards — directly inspired by the original terminal.js POOL */}
      {content.terminalDataPool.slice(0, 6).map((entry, i) => (
        <FloatingDataCard 
          key={i} 
          data={entry} 
          index={i} 
          scrollProgress={scrollProgress} 
        />
      ))}

      {/* Subtle environment grid / data field (premium abstract feel) */}
      <gridHelper 
        args={[28, 14, '#1e3a5f', '#132a44']} 
        position={[0, -2.6, 0]} 
      />

      {/* Dev controls — remove or conditional in prod */}
      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={4} 
        maxDistance={18}
        enableDamping 
        dampingFactor={0.08}
      />
    </>
  );
}

interface Hero3DProps {
  scrollProgress?: number; // 0–1 driven by useScrollProgress (hero or overall early)
}

export function Hero3D({ scrollProgress = 0 }: Hero3DProps) {
  // This value now comes from the parent (scroll-synced). Perfect for driving 3D properties.
  // Next upgrades:
  // - GSAP timeline scrubbing inside a useGSAP hook
  // - Per-section values (problemProgress etc.)
  // - Switch frameloop to "demand" + manual invalidate on significant progress change for perf

  return (
    <div className="three-canvas-container" style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        frameloop="always"
        dpr={[1, 1.55]}
        camera={{ fov: 42, near: 0.5, far: 200 }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          preserveDrawingBuffer: false,
          powerPreference: 'high-performance' 
        }}
        style={{ background: 'transparent' }}
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
