"use client";


export default function FrontGrille({ cfg, materials }) {
  return (
    <group>
      {/* Grill Slit and Frame Assembly */}
      <group position={[0, 0.78, 1.83]}>
        <mesh castShadow><boxGeometry args={[1.36, 0.46, 0.04]} />{materials.grilleFrame}</mesh>
        <mesh position={[0, 0, 0.01]}><boxGeometry args={[1.24, 0.38, 0.015]} />{materials.darkPlastic}</mesh>
        {[-0.42, -0.28, -0.14, 0, 0.14, 0.28, 0.42].map((offset, i) => (
          <mesh key={i} position={[offset, 0, 0.02]} castShadow><boxGeometry args={[0.05, 0.32, 0.02]} />{materials.grilleSlits}</mesh>
        ))}
      </group>

      {/* Hood Assembly */}
      <mesh position={[0, 0.78, 1.35]} castShadow><boxGeometry args={[1.4, 0.48, 0.90]} />{materials.bodyPaint}</mesh>
      <mesh position={[0, 1.03, 1.32]} castShadow><boxGeometry args={[0.75, 0.04, 0.85]} />{materials.bodyPaint}</mesh>
    </group>
  );
}