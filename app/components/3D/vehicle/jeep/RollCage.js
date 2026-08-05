"use client";


export default function RollCage({ 
  cfg, 
  materials, 
  cageWidth, 
  aPillarLength, 
  aPillarPitch, 
  rearLength, 
  rearPitch 
}) {
  return (
    <group>
      {/* --- 1. Symmetrical Side Tubular Pillars (Left & Right Sides) --- */}
      {[-1, 1].map((xSign) => (
        <group key={xSign}>
          {/* Slanted Front A-Pillar Tubing */}
          <mesh 
            position={[xSign * cfg.pillarOffset, (cfg.tubTopY + cfg.cageTopY) / 2, cfg.windshieldZ - 0.035]} 
            rotation={[-aPillarPitch, 0, 0]} 
            castShadow
          >
            <cylinderGeometry args={[0.025, 0.025, aPillarLength, 8]} />
            {materials.cageSteel}
          </mesh>

          {/* Upper Side Connecting Rails (A-Pillar to B-Pillar) */}
          <mesh 
            position={[xSign * cfg.pillarOffset, cfg.cageTopY, (cfg.windshieldZ - 0.07 + cfg.bPillarZ) / 2]} 
            rotation={[Math.PI / 2, 0, 0]} 
            castShadow
          >
            <cylinderGeometry args={[0.025, 0.025, 0.96, 8]} />
            {materials.cageSteel}
          </mesh>

          {/* B-Pillar Vertical Upright Tubes */}
          <mesh 
            position={[xSign * cfg.pillarOffset, (cfg.tubTopY + cfg.cageTopY) / 2, cfg.bPillarZ]} 
            castShadow
          >
            <cylinderGeometry args={[0.03, 0.03, cfg.cageTopY - cfg.tubTopY, 8]} />
            {materials.cageSteel}
          </mesh>

          {/* Slanted Rear Kick-Back Tubing (B-Pillar to Tailgate) */}
          <mesh 
            position={[xSign * cfg.pillarOffset, (cfg.tubTopY + cfg.cageTopY) / 2, (cfg.bPillarZ + cfg.tailgateZ) / 2]} 
            rotation={[rearPitch, 0, 0]} 
            castShadow
          >
            <cylinderGeometry args={[0.025, 0.025, rearLength, 8]} />
            {materials.cageSteel}
          </mesh>
        </group>
      ))}

      {/* --- 2. Transverse Overhead Crossbars --- */}
      <mesh position={[0, cfg.cageTopY, cfg.windshieldZ - 0.07]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, cageWidth, 8]} />
        {materials.cageSteel}
      </mesh>
      <mesh position={[0, cfg.cageTopY, cfg.bPillarZ]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, cageWidth, 8]} />
        {materials.cageSteel}
      </mesh>
      <mesh position={[0, 1.25, -0.70]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, cageWidth, 8]} />
        {materials.cageSteel}
      </mesh>

      {/* --- 3. Rear Spare Tire Carrier Frame --- */}
      <group position={[0, 0.8, cfg.tailgateZ]}>
        <mesh position={[-0.12, -0.12, -0.06]} rotation={[0.4, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.28, 6]} />
          {materials.cageSteel}
        </mesh>
        <mesh position={[0.12, -0.12, -0.06]} rotation={[0.4, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.28, 6]} />
          {materials.cageSteel}
        </mesh>
        <mesh position={[0, 0.12, -0.06]} rotation={[-0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.28, 6]} />
          {materials.cageSteel}
        </mesh>
        <mesh position={[0, 0, -0.11]} castShadow>
          <boxGeometry args={[0.16, 0.16, 0.04]} />
          {materials.chassisMetal}
        </mesh>
        <mesh position={[0, 0, -0.13]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
          {materials.silverMetallic}
        </mesh>
      </group>
    </group>
  );
}