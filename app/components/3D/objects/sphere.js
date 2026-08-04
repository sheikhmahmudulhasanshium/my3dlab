"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function SphereMesh({ color }) {
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.8, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.15} 
        metalness={0.85} 
      />
    </mesh>
  );
}

export default function ThreeScene({ color = "#00d2ff" }) {
  return (
    // Fix: Removed 'h-screen' to resolve the height CSS conflict warning
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <SphereMesh color={color} />
      </Canvas>
    </div>
  );
}