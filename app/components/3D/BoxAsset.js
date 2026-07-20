"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function BoxAsset({ color }) {
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 1.2, 1.2]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.2} 
        metalness={0.7} 
      />
    </mesh>
  );
}