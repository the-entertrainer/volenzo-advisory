import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { content } from '../../lib/content';

/**
 * SERVICES 3D CONSTELLATION — Optimal location for the Services section.
 * 
 * Encapsulated, scroll + interaction driven.
 * 
 * Planned behavior:
 * - Three elegant nodes around a central hub.
 * - GSAP camera animation (or useFrame lerp) orbits the camera to focus the active service.
 * - On focus / scroll progress within section: node scales + emissive pulse.
 * - Html label or side panel shows the exact original service copy (content.services.items[n].desc).
 * 
 * Current: Beautiful abstract 3D with 3 nodes + central element. Click or pass activeIndex to focus.
 */

function ServiceNode({ 
  position, 
  label, 
  active, 
  onClick 
}: { 
  position: [number, number, number]; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) {
  const ref = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const scale = active ? 1.15 + Math.sin(t * 3) * 0.04 : 1 + Math.sin(t * 1.6 + position[0]) * 0.025;
    ref.current.scale.setScalar(scale);
    ref.current.rotation.y = t * (active ? 0.6 : 0.25);
  });

  return (
    <group ref={ref} position={position} onClick={onClick}>
      <mesh>
        <icosahedronGeometry args={[1.05]} />
        <meshPhongMaterial 
          color={active ? '#0055FF' : '#1e3a5f'} 
          emissive={active ? '#003399' : '#000000'} 
          shininess={active ? 40 : 12} 
        />
      </mesh>

      <Html position={[0, 1.7, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{ 
          fontSize: 11, 
          fontWeight: 600, 
          letterSpacing: '1px', 
          color: active ? '#7dd3fc' : '#94a3b8',
          textAlign: 'center',
          textTransform: 'uppercase'
        }}>
          {label}
        </div>
      </Html>
    </group>
  );
}

interface Services3DProps {
  activeIndex?: number;
  onNodeFocus?: (index: number) => void;
}

export function Services3D({ activeIndex = 1, onNodeFocus }: Services3DProps) {
  const labels = content.services.items.map(s => s.name);

  return (
    <div style={{ width: '100%', height: 420, background: 'rgba(10,30,61,0.06)', borderRadius: 4, overflow: 'hidden' }}>
      <Canvas
        frameloop="always"
        camera={{ position: [0, 1.5, 9], fov: 46 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[-5, 10, -8]} intensity={1.3} />

        {/* Central hub */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.35]} />
          <meshPhongMaterial color="#0f253f" shininess={30} />
        </mesh>

        {/* Three service nodes positioned for nice orbit */}
        {[-1, 0, 1].map((_, i) => {
          const angle = (i - 1) * (Math.PI * 0.72) - 0.3;
          const r = 4.2;
          const pos: [number, number, number] = [
            Math.cos(angle) * r, 
            Math.sin(angle * 0.6) * 1.4, 
            Math.sin(angle) * r * 0.35 - 0.6
          ];
          return (
            <ServiceNode 
              key={i}
              position={pos}
              label={labels[i]}
              active={i === activeIndex}
              onClick={() => onNodeFocus?.(i)}
            />
          );
        })}

        {/* Subtle connecting "data" lines */}
        <line>
          <bufferGeometry attach="geometry" />
          <lineBasicMaterial attach="material" color="#1e3a5f" />
        </line>
      </Canvas>

      <div style={{ padding: '8px 16px', fontSize: 10, opacity: 0.6, textAlign: 'center' }}>
        CLICK NODES or scroll to focus services — camera + node state driven by GSAP + scroll progress (WIP)
      </div>
    </div>
  );
}
