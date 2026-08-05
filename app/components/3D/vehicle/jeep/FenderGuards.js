"use client";


export default function FenderGuards({ cfg, materials }) {
  return (
    <group>
      {[-1, 1].map((xSign) => (
        <group key={xSign}>
          {/* Front Fender Flare */}
          <group position={[xSign * cfg.fenderX, 0, cfg.frontAxleZ]}>
            <mesh position={[0, 0.72, 0]} castShadow><boxGeometry args={[0.22, 0.04, 0.52]} />{materials.fenderGuardPlastic}</mesh>
            <mesh position={[0, 0.64, 0.398]} rotation={[Math.PI / 6, 0, 0]} castShadow><boxGeometry args={[0.22, 0.04, 0.32]} />{materials.fenderGuardPlastic}</mesh>
            <mesh position={[0, 0.64, -0.398]} rotation={[-Math.PI / 6, 0, 0]} castShadow><boxGeometry args={[0.22, 0.04, 0.32]} />{materials.fenderGuardPlastic}</mesh>
          </group>

          {/* Rear Fender Flare */}
          <group position={[xSign * cfg.fenderX, 0, cfg.rearAxleZ]}>
            <mesh position={[0, 0.72, 0]} castShadow><boxGeometry args={[0.22, 0.04, 0.52]} />{materials.fenderGuardPlastic}</mesh>
            <mesh position={[0, 0.64, 0.398]} rotation={[Math.PI / 6, 0, 0]} castShadow><boxGeometry args={[0.22, 0.04, 0.32]} />{materials.fenderGuardPlastic}</mesh>
            <mesh position={[0, 0.64, -0.398]} rotation={[-Math.PI / 6, 0, 0]} castShadow><boxGeometry args={[0.22, 0.04, 0.32]} />{materials.fenderGuardPlastic}</mesh>
          </group>
        </group>
      ))}
    </group>
  );
}