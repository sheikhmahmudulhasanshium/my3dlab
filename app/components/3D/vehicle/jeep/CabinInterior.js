"use client";


export default function CabinInterior({ cfg, materials }) {
  return (
    <group>
      {/* Dash Block */}
      <mesh position={[0, 0.98, 0.90]} castShadow><boxGeometry args={[1.38, 0.18, 0.24]} />{materials.darkPlastic}</mesh>

      {/* Steering column */}
      <group position={[-0.35, 1.0, 0.80]}>
        <mesh rotation={[Math.PI / 4, 0, 0]} castShadow><cylinderGeometry args={[0.018, 0.018, 0.35, 8]} />{materials.darkPlastic}</mesh>
        <group position={[0, 0.12, -0.12]} rotation={[Math.PI / 4, 0, 0]}>
          <mesh castShadow><torusGeometry args={[0.15, 0.02, 6, 20]} />{materials.darkPlastic}</mesh>
          <mesh position={[0, -0.07, 0]}><boxGeometry args={[0.018, 0.14, 0.015]} />{materials.silverMetallic}</mesh>
          <mesh position={[-0.06, 0.04, 0]} rotation={[0, 0, Math.PI / 3]}><boxGeometry args={[0.018, 0.14, 0.015]} />{materials.silverMetallic}</mesh>
          <mesh position={[0.06, 0.04, 0]} rotation={[0, 0, -Math.PI / 3]}><boxGeometry args={[0.018, 0.14, 0.015]} />{materials.silverMetallic}</mesh>
        </group>
      </group>

      {/* Shift stick */}
      <group position={[0, 0.58, 0.45]}>
        <mesh rotation={[-0.12, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.18, 6]} />{materials.silverMetallic}</mesh>
        <mesh position={[0, 0.09, -0.01]}><sphereGeometry args={[0.026, 8, 8]} /><meshStandardMaterial color="#ef4444" roughness={0.3} /></mesh>
      </group>

      {/* Rear Passenger Seat bench */}
      <group position={[0, 0.53, -0.55]}>
        <mesh castShadow><boxGeometry args={[1.0, 0.14, 0.44]} />{materials.leatherSeats}</mesh>
        <mesh position={[0, 0.3, -0.19]} rotation={[-0.1, 0, 0]} castShadow><boxGeometry args={[1.0, 0.52, 0.10]} />{materials.leatherSeats}</mesh>
      </group>
    </group>
  );
}