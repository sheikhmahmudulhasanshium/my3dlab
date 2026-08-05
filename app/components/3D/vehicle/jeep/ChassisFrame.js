"use client";


export default function ChassisFrame({ cfg, materials }) {
  return (
    <group>
      {[-1, 1].map((xSign) => (
        <group key={xSign}>
          {/* Frame Rails */}
          <mesh position={[xSign * cfg.railX, 0.35, 1.67]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.08, 0.54]} />
            {materials.chassisMetal}
          </mesh>
          <mesh position={[xSign * cfg.railX, 0.43, cfg.frontAxleZ]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.08, 0.62]} />
            {materials.chassisMetal}
          </mesh>
          <mesh position={[xSign * cfg.railX, 0.35, 0.175]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.08, 1.27]} />
            {materials.chassisMetal}
          </mesh>
          <mesh position={[xSign * cfg.railX, 0.43, cfg.rearAxleZ]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.08, 0.62]} />
            {materials.chassisMetal}
          </mesh>
          <mesh position={[xSign * cfg.railX, 0.35, -1.185]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.08, 0.27]} />
            {materials.chassisMetal}
          </mesh>

          {/* Vertical Transition Joiners */}
          <mesh position={[xSign * cfg.railX, 0.39, 1.4]} castShadow><boxGeometry args={[0.082, 0.12, 0.1]} />{materials.chassisMetal}</mesh>
          <mesh position={[xSign * cfg.railX, 0.39, 0.8]} castShadow><boxGeometry args={[0.082, 0.12, 0.1]} />{materials.chassisMetal}</mesh>
          <mesh position={[xSign * cfg.railX, 0.39, -0.45]} castShadow><boxGeometry args={[0.082, 0.12, 0.1]} />{materials.chassisMetal}</mesh>
          <mesh position={[xSign * cfg.railX, 0.39, -1.05]} castShadow><boxGeometry args={[0.082, 0.12, 0.1]} />{materials.chassisMetal}</mesh>

          {/* Coil Springs */}
          <mesh position={[xSign * cfg.springX, 0.54, cfg.frontAxleZ]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.32, 10]} />
            <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.2} />
          </mesh>
          <mesh position={[xSign * cfg.springX, 0.54, cfg.rearAxleZ]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.32, 10]} />
            <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Tub Floor Plate */}
      <mesh position={[0, cfg.tubFloorY - 0.01, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.18, 0.03, 2.45]} />
        {materials.chassisMetal}
      </mesh>

      {/* Central Crossmembers */}
      <mesh position={[0, 0.35, 1.85]} castShadow receiveShadow><boxGeometry args={[0.92, 0.06, 0.06]} />{materials.chassisMetal}</mesh>
      <mesh position={[0, 0.35, 1.4]} castShadow receiveShadow><boxGeometry args={[0.92, 0.06, 0.06]} />{materials.chassisMetal}</mesh>
      <mesh position={[0, 0.28, 0.175]} castShadow receiveShadow><boxGeometry args={[0.92, 0.04, 0.18]} />{materials.darkPlastic}</mesh>
      <mesh position={[0, 0.43, -0.45]} castShadow receiveShadow><boxGeometry args={[0.92, 0.06, 0.06]} />{materials.chassisMetal}</mesh>
      <mesh position={[0, 0.35, -1.25]} castShadow receiveShadow><boxGeometry args={[0.92, 0.06, 0.06]} />{materials.chassisMetal}</mesh>

      {/* Solid Axle Tubes */}
      <group position={[0, cfg.axleY, cfg.frontAxleZ]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.045, 0.045, 1.52, 8]} />{materials.chassisMetal}</mesh>
        <mesh castShadow><sphereGeometry args={[0.11, 10, 10]} />{materials.chassisMetal}</mesh>
      </group>
      <group position={[0, cfg.axleY, cfg.rearAxleZ]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.045, 0.045, 1.52, 8]} />{materials.chassisMetal}</mesh>
        <mesh castShadow><sphereGeometry args={[0.11, 10, 10]} />{materials.chassisMetal}</mesh>
      </group>

      {/* Transmission Gearbox & Transfer Case */}
      <group position={[0, 0.38, 0.175]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.18, 0.42]} />
          <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.8} />
        </mesh>
        <mesh position={[0.04, -0.08, -0.06]} castShadow>
          <boxGeometry args={[0.12, 0.12, 0.14]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.85} />
        </mesh>
      </group>

      {/* Driveshafts */}
      <mesh position={[0, 0.38, 0.6375]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.015, 0.015, 0.925, 6]} />{materials.silverMetallic}</mesh>
      <mesh position={[0, 0.38, -0.2875]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.015, 0.015, 0.925, 6]} />{materials.silverMetallic}</mesh>
    </group>
  );
}