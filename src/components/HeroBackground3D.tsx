'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useTheme } from './ThemeProvider';

/**
 * Interactive architectural grid that deforms based on mouse position.
 * Creates a "wave" effect emanating from the cursor — tech-premium feel.
 */
function InteractiveGrid({ color, opacity }: { color: string; opacity: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const mouse = useRef([0, 0]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current[0] = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current[1] = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const pos = mesh.geometry.attributes.position;
    const t = clock.getElapsedTime();

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Distance from mouse-mapped position
      const dx = x / 12 - mouse.current[0];
      const dy = y / 12 - mouse.current[1];
      const d = Math.sqrt(dx * dx + dy * dy);

      // Wave emanating from cursor
      const wave = Math.sin(d * 3 - t * 2) * 0.35 * Math.exp(-d * 0.5);
      // Ambient slow undulation
      const ambient =
        Math.sin(x * 0.2 + t * 0.4) * Math.cos(y * 0.2 + t * 0.3) * 0.08;

      pos.setZ(i, wave + ambient);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[28, 28, 56, 56]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
    </mesh>
  );
}

/** Floating accent points — architectural "nodes" */
function GridNodes() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
  });

  const positions: [number, number, number][] = [
    [-3, 1, -2],
    [4, 0.5, -3],
    [-1, 2, -4],
    [2, 1.5, -1],
    [-4, 0, -5],
  ];

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroBackground3D() {
  const { theme } = useTheme();
  const isDark = theme !== 'light';

  return (
    <div className="absolute inset-0 -z-10 h-full w-full">
      <Canvas camera={{ position: [0, 4, 10], fov: 50 }}>
        <ambientLight intensity={isDark ? 0.1 : 0.6} />
        <InteractiveGrid
          color={isDark ? '#ffffff' : '#0a0a0a'}
          opacity={isDark ? 0.06 : 0.04}
        />
        {isDark && <GridNodes />}
      </Canvas>
    </div>
  );
}
