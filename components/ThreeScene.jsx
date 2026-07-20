"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

// The AnimatedSphere component now accepts "color" as a prop
function AnimatedSphere({ color }) {
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
      {/* The color is dynamically driven by the prop */}
      <meshStandardMaterial 
        color={color} 
        roughness={0.15} 
        metalness={0.85} 
      />
    </mesh>
  );
}

// ThreeScene passes the color prop down to AnimatedSphere
export default function ThreeScene({ color = "#3b82f6" }) {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <AnimatedSphere color={color} />
      </Canvas>
    </div>
  );
}