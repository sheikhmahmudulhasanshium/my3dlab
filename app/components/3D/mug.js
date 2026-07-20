"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Mug = () => {
  const mugRef = useRef(null);

  // Smooth floating and rotating animations
  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    if (mugRef.current) {
      // Gentle floating up and down
      mugRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.08 - 0.1;
      // 360-degree rotation
      mugRef.current.rotation.y = elapsedTime * 0.45;
      // Soft organic tilting wobble
      mugRef.current.rotation.x = Math.sin(elapsedTime * 0.8) * 0.04;
    }
  });

  // Edible Organic Palette (Baked wheat bran & dark chocolate)
  const bakedWheatColor = "#854d0e";    // Toasted wheat, bran, and cellulose fiber color
  const darkChocolateColor = "#270e00"; // Rich dark chocolate protective inner lining

  return (
    <group ref={mugRef}>
      
      {/* --- THE HOLLOW EDIBLE HYBRID CUP/MUG --- */}
      <group position={[0, 0, 0]}>
        
        {/* Tapered Hollow Wall (Flares outward at the top, narrows at the base) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.74, 0.58, 1.2, 32, 1, true]} />
          <meshStandardMaterial 
            color={bakedWheatColor} 
            side={THREE.DoubleSide} 
            roughness={0.98}      // Extremely matte, dry, and porous like baked bran biscuit
            metalness={0.0}       // Edible/organic materials have zero metalness
          />
        </mesh>

        {/* Inner Base Floor (Dark chocolate protective coating) */}
        <mesh position={[0, -0.58, 0]}>
          <cylinderGeometry args={[0.57, 0.56, 0.02, 32]} />
          <meshStandardMaterial 
            color={darkChocolateColor} 
            roughness={0.4}      // Slightly smoother, semi-glossy like set melted chocolate
            metalness={0.0}       // Non-metallic
          />
        </mesh>

        {/* Flared Top Rim Lip (Baked wheat) */}
        <mesh position={[0, 0.59, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.71, 0.03, 8, 32]} />
          <meshStandardMaterial 
            color={bakedWheatColor} 
            roughness={0.98} 
            metalness={0.0}
          />
        </mesh>

        {/* Proportioned Handle (Toasted baked wheat) */}
        {/* User-confirmed optimal handle coordinates applied below */}
        <mesh position={[0.65000, -0.03, 0]} rotation={[0, 0, -1.72]}>
          <torusGeometry args={[0.32, 0.08, 16, 100, Math.PI]} />
          <meshStandardMaterial 
            color={bakedWheatColor} 
            roughness={0.98} 
            metalness={0.0} 
          />
        </mesh>

      </group>

    </group>
  );
};

export default Mug;