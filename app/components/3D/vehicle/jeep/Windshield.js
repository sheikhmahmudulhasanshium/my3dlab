"use client";


export default function Windshield({ cfg, materials }) {
  return (
    <group position={[0, 1.25, cfg.windshieldZ]} rotation={[-Math.PI / 10, 0, 0]}>
      {/* High-Refraction Clear Glass */}
      <mesh>
        <boxGeometry args={[1.32, 0.44, 0.02]} />
        <meshStandardMaterial 
          color="#dceef2" 
          transparent 
          opacity={0.24} 
          roughness={0.01} 
          metalness={0.9} 
          depthWrite={false} 
        />
      </mesh>

      {/* Hollow Frame Struts */}
      <mesh position={[0, -0.24, -0.01]} castShadow><boxGeometry args={[1.4, 0.04, 0.03]} />{materials.bodyPaint}</mesh>
      <mesh position={[0, 0.24, -0.01]} castShadow><boxGeometry args={[1.4, 0.04, 0.03]} />{materials.bodyPaint}</mesh>
      <mesh position={[-0.68, 0, -0.01]} castShadow><boxGeometry args={[0.04, 0.44, 0.03]} />{materials.bodyPaint}</mesh>
      <mesh position={[0.68, 0, -0.01]} castShadow><boxGeometry args={[0.04, 0.44, 0.03]} />{materials.bodyPaint}</mesh>
    </group>
  );
}