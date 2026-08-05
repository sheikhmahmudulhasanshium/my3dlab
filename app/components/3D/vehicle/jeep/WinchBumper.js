"use client";

import LicensePlate from "./LicensePlate";

export default function WinchBumper({ cfg, materials }) {
  return (
    <group>
      {/* Front Bumper Steel Block */}
      <mesh position={[0, 0.44, 1.94]} castShadow><boxGeometry args={[1.62, 0.16, 0.18]} />{materials.bumperSteel}</mesh>
      <mesh position={[-0.82, 0.44, 1.9]} rotation={[0, -Math.PI / 8, 0]} castShadow><boxGeometry args={[0.2, 0.16, 0.12]} />{materials.bumperSteel}</mesh>
      <mesh position={[0.82, 0.44, 1.9]} rotation={[0, Math.PI / 8, 0]} castShadow><boxGeometry args={[0.2, 0.16, 0.12]} />{materials.bumperSteel}</mesh>

      {/* Recovery Winch Motor */}
      <group position={[0, 0.54, 1.92]}>
        <mesh castShadow><boxGeometry args={[0.34, 0.04, 0.14]} />{materials.bumperSteel}</mesh>
        <mesh position={[-0.1, 0.08, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.12, 10]} /><meshStandardMaterial color="#1e293b" metalness={0.8} /></mesh>
        <mesh position={[0.04, 0.08, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.042, 0.042, 0.14, 12]} /><meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} /></mesh>
        <mesh position={[0, 0.04, 0.09]} castShadow><boxGeometry args={[0.1, 0.05, 0.04]} /><meshStandardMaterial color="#ef4444" roughness={0.5} /></mesh>
      </group>

      {/* Red Recovery D-Rings */}
      <mesh position={[-0.45, 0.38, 2.04]} rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[0.045, 0.012, 6, 12]} /><meshStandardMaterial color="#dc2626" roughness={0.4} /></mesh>
      <mesh position={[0.45, 0.38, 2.04]} rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[0.045, 0.012, 6, 12]} /><meshStandardMaterial color="#dc2626" roughness={0.4} /></mesh>

      {/* Mounted Front Plate */}
      <LicensePlate position={[0, 0.44, 2.04]} rotation={[0, 0, 0]} />
    </group>
  );
}