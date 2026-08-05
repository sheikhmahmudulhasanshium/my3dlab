"use client";


export default function RollCage({ 
  cfg, 
  materials, 
  cageWidth, 
  rearLength, 
  rearPitch 
}) {
  // Baseline matching physical body panels
  const bodyTopY = 1.02; 

  // Lowered cage top height to reduce gap with windshield top (1.48)
  const cageTopY = 1.50; 

  // 1. Align A-Pillars to match the Windshield's exact 18-degree backward tilt
  const windshieldPitch = Math.PI / 10; // Matches windshield frame rotation [-Math.PI / 10, 0, 0]
  const pillarHeight = cageTopY - bodyTopY; // Calculated vertical height (1.50 - 1.02 = 0.48)
  
  // Calculate A-pillar length and tilt parallel to the windshield
  const alignedAPillarLength = pillarHeight / Math.cos(windshieldPitch);
  
  // Calculate the vertical midpoint of the A-pillar
  const aPillarMidpointY = (bodyTopY + cageTopY) / 2;
  
  // Align the Z midpoint dynamically using the windshield center (Y = 1.25, Z = windshieldZ) as reference
  const aPillarMidpointZ = cfg.windshieldZ - (aPillarMidpointY - 1.25) * Math.tan(windshieldPitch);

  // 2. Calculate the exact Z-coordinate at the top of the A-pillar (Y = cageTopY)
  const aPillarTopZ = cfg.windshieldZ - (cageTopY - 1.25) * Math.tan(windshieldPitch);

  // 3. Dynamic Side Rail dimensions connecting A-Pillar (top) to B-Pillar
  const sideRailLength = Math.abs(aPillarTopZ - cfg.bPillarZ);
  const sideRailMidpointZ = (aPillarTopZ + cfg.bPillarZ) / 2;

  // 4. Dynamic rear crossbar and kick-back tube calculations
  const rearCrossbarY = (bodyTopY + cageTopY) / 2;
  const rearCrossbarZ = (cfg.bPillarZ + cfg.tailgateZ) / 2;

  return (
    <group>
      {/* --- 1. Symmetrical Side Tubular Pillars (Left & Right Sides) --- */}
      {[-1, 1].map((xSign) => (
        <group key={xSign}>
          {/* Slanted Front A-Pillar Tubing (Flush with Windshield Frame struts) */}
          <mesh 
            position={[xSign * cfg.pillarOffset, aPillarMidpointY, aPillarMidpointZ]} 
            rotation={[-windshieldPitch, 0, 0]} 
            castShadow
          >
            <cylinderGeometry args={[0.025, 0.025, alignedAPillarLength, 8]} />
            {materials.cageSteel}
          </mesh>

          {/* Upper Side Connecting Rails (A-Pillar to B-Pillar) */}
          <mesh 
            position={[xSign * cfg.pillarOffset, cageTopY, sideRailMidpointZ]} 
            rotation={[Math.PI / 2, 0, 0]} 
            castShadow
          >
            <cylinderGeometry args={[0.025, 0.025, sideRailLength, 8]} />
            {materials.cageSteel}
          </mesh>

          {/* B-Pillar Vertical Upright Tubes */}
          <mesh 
            position={[xSign * cfg.pillarOffset, (bodyTopY + cageTopY) / 2, cfg.bPillarZ]} 
            castShadow
          >
            <cylinderGeometry args={[0.03, 0.03, cageTopY - bodyTopY, 8]} />
            {materials.cageSteel}
          </mesh>

          {/* Slanted Rear Kick-Back Tubing (Tied to tailgate top) */}
          <mesh 
            position={[xSign * cfg.pillarOffset, rearCrossbarY, rearCrossbarZ]} 
            rotation={[rearPitch, 0, 0]} 
            castShadow
          >
            <cylinderGeometry args={[0.025, 0.025, rearLength, 8]} />
            {materials.cageSteel}
          </mesh>
        </group>
      ))}

      {/* --- 2. Transverse Overhead Crossbars --- */}
      {/* Front Overhead Crossbar */}
      <mesh position={[0, cageTopY, aPillarTopZ]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, cageWidth, 8]} />
        {materials.cageSteel}
      </mesh>

      {/* Center Overhead Crossbar */}
      <mesh position={[0, cageTopY, cfg.bPillarZ]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, cageWidth, 8]} />
        {materials.cageSteel}
      </mesh>

      {/* Rear Crossbar */}
      <mesh position={[0, rearCrossbarY, rearCrossbarZ]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, cageWidth, 8]} />
        {materials.cageSteel}
      </mesh>
    </group>
  );
}