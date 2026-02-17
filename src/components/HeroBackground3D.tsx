'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTheme } from './ThemeProvider'; // Assume this export exists or I'll create it if needed
import { MeshDistortMaterial, Stars, Text, Float } from '@react-three/drei';

function NeoBackground() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh position={[2, 0, 0]} scale={1.5}>
                    <icosahedronGeometry args={[1, 0]} />
                    <MeshDistortMaterial
                        color="#ccff00" // Neon Lime
                        speed={3}
                        distort={0.4}
                        radius={1}
                        wireframe
                    />
                </mesh>
            </Float>
             <Float speed={3} rotationIntensity={1.5} floatIntensity={1}>
                <mesh position={[-2, -1, -2]} scale={1}>
                    <torusKnotGeometry args={[0.8, 0.2, 100, 16]} />
                    <MeshDistortMaterial
                        color="#ff00ff" // Neon Magenta
                        speed={5}
                        distort={0.3}
                         wireframe
                    />
                </mesh>
            </Float>
             <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </>
    );
}

function LuxuryBackground() {
    return (
        <>
             <ambientLight intensity={0.2} />
             <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffd700" />
             <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[2, 64, 64]} />
                    <meshStandardMaterial
                        color="#111"
                        roughness={0.1}
                        metalness={0.8}
                        emissive="#333"
                        emissiveIntensity={0.2}
                    />
                </mesh>
             </Float>
             <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />
        </>
    )
}

function MinimalBackground() {
     return (
        <>
             <ambientLight intensity={0.8} />
             <mesh position={[0, 0, -5]} rotation={[-Math.PI / 4, 0, 0]}>
                 <planeGeometry args={[20, 20, 32, 32]} />
                 <meshBasicMaterial color="#f0f0f0" wireframe />
             </mesh>
        </>
     )
}

function PopBackground() {
      return (
        <>
            <ambientLight intensity={0.8} />
             <directionalLight position={[5, 10, 7]} intensity={1} />
             <Float speed={5} rotationIntensity={2} floatIntensity={2}>
                 <mesh position={[0, 0, 0]}>
                     <boxGeometry args={[2, 2, 2]} />
                     <meshNormalMaterial />
                 </mesh>
             </Float>
        </>
      )
}


function RetroBackground() {
      // Simple grid moving logic could go here, for now a static grid
       return (
        <>
             <ambientLight intensity={0.5} />
             <gridHelper args={[50, 50, 0xff0000, 0x0000ff]} position={[0, -2, 0]} />
             <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={2} />
        </>
      )
}


export default function HeroBackground3D() {
    const { theme } = useTheme();

    const renderScene = () => {
        switch (theme) {
            case 'luxury': return <LuxuryBackground />;
            case 'minimal': return <MinimalBackground />;
            case 'pop': return <PopBackground />;
            case 'retro': return <RetroBackground />;
            case 'neo':
            default: return <NeoBackground />;
        }
    }

    return (
        <div className="absolute inset-0 -z-10 h-full w-full bg-black">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                {renderScene()}
            </Canvas>
        </div>
    );
}
