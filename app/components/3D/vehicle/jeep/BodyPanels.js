"use client";


export default function BodyPanels({ cfg, materials }) {
  return (
    <group>
      {[-1, 1].map((xSign) => (
        <group key={xSign}>
          {/* Outer Side Skins */}
          <mesh position={[xSign * (cfg.bodyHalfWidth - 0.025), 0.72, -0.225]} castShadow receiveShadow><boxGeometry args={[0.05, 0.6, 0.45]} />{materials.bodyPaint}</mesh>
          <mesh position={[xSign * (cfg.bodyHalfWidth - 0.025), 0.72, -1.175]} castShadow receiveShadow><boxGeometry args={[0.05, 0.6, 0.25]} />{materials.bodyPaint}</mesh>
          <mesh position={[xSign * (cfg.bodyHalfWidth - 0.025), 0.945, -0.75]} castShadow receiveShadow><boxGeometry args={[0.05, 0.15, 0.6]} />{materials.bodyPaint}</mesh>

          {/* Inner Wheel House / Mudguards */}
          <group position={[xSign * cfg.innerWheelWellX, cfg.axleY, cfg.rearAxleZ]}>
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow><boxGeometry args={[0.22, 0.04, 0.35]} />{materials.innerWheelWell}</mesh>
            <mesh position={[0, 0.38, 0.22]} rotation={[Math.PI / 8, 0, 0]} castShadow receiveShadow><boxGeometry args={[0.22, 0.04, 0.22]} />{materials.innerWheelWell}</mesh>
            <mesh position={[0, 0.38, -0.22]} rotation={[-Math.PI / 8, 0, 0]} castShadow receiveShadow><boxGeometry args={[0.22, 0.04, 0.22]} />{materials.innerWheelWell}</mesh>
            <mesh position={[0, 0.20, 0.34]} rotation={[Math.PI / 3, 0, 0]} castShadow receiveShadow><boxGeometry args={[0.22, 0.04, 0.25]} />{materials.innerWheelWell}</mesh>
            <mesh position={[0, 0.20, -0.34]} rotation={[-Math.PI / 3, 0, 0]} castShadow receiveShadow><boxGeometry args={[0.22, 0.04, 0.25]} />{materials.innerWheelWell}</mesh>
          </group>

          {/* Cabin Side Doors */}
          <group position={[xSign * (cfg.bodyHalfWidth + 0.01), 0.72, 0.45]}>
            <mesh castShadow receiveShadow><boxGeometry args={[0.02, 0.56, 0.9]} />{materials.bodyPaint}</mesh>
            <mesh position={[xSign * -0.011, 0, 0]}><boxGeometry args={[0.005, 0.58, 0.92]} />{materials.darkPlastic}</mesh>
            <mesh position={[xSign * -0.012, 0, 0]}><boxGeometry args={[0.005, 0.5, 0.84]} />{materials.darkPlastic}</mesh>
            <mesh position={[xSign * 0.011, 0.12, -0.28]} castShadow><boxGeometry args={[0.005, 0.05, 0.12]} /><meshStandardMaterial color="#0a0b0d" /></mesh>
            <mesh position={[xSign * 0.018, 0.12, -0.28]} castShadow><boxGeometry args={[0.012, 0.02, 0.09]} /><meshStandardMaterial color="#1a1c22" roughness={0.8} /></mesh>
          </group>

          {/* Exterior Hinges */}
          <mesh position={[xSign * (cfg.bodyHalfWidth + 0.02), 0.85, 0.9]} castShadow><boxGeometry args={[0.015, 0.05, 0.025]} />{materials.darkPlastic}</mesh>
          <mesh position={[xSign * (cfg.bodyHalfWidth + 0.02), 0.58, 0.9]} castShadow><boxGeometry args={[0.015, 0.05, 0.025]} />{materials.darkPlastic}</mesh>
          <mesh position={[xSign * (cfg.bodyHalfWidth - 0.12), 0.62, cfg.frontAxleZ]} castShadow><boxGeometry args={[0.12, 0.16, 0.52]} />{materials.innerWheelWell}</mesh>
        </group>
      ))}

      {/* Rear Tailgate Panel */}
      <mesh position={[0, 0.595, cfg.tailgateZ - 0.025]} castShadow receiveShadow><boxGeometry args={[1.36, 0.35, 0.05]} />{materials.bodyPaint}</mesh>
      <mesh position={[-0.45, 0.46, cfg.tailgateZ - 0.05]} castShadow><boxGeometry args={[0.04, 0.03, 0.03]} />{materials.darkPlastic}</mesh>
      <mesh position={[0.45, 0.46, cfg.tailgateZ - 0.05]} castShadow><boxGeometry args={[0.04, 0.03, 0.03]} />{materials.darkPlastic}</mesh>
    </group>
  );
}