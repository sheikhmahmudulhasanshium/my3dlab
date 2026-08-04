"use client";

import { useMemo } from "react";
import WheelAsset from "./WheelAsset";

// --- 1. Parametric Half-Width Offset System ---
const JEEP_CONFIG = {
  // Half-Width Offsets (Distance from center x = 0)
  bodyHalfWidth: 0.70,   // Side panels at x = ±0.70 (Total body width = 1.40)
  wheelX: 0.82,          // Wheels centered exactly at x = ±0.82
  fenderX: 0.73,         // Fender flares pulled flush against the body panels (0.70)
  railX: 0.50,           // Chassis rails centered at x = ±0.50
  springX: 0.50,         // Suspension coils aligned directly over chassis rails
  seatX: 0.36,           // Seats centered at x = ±0.36
  pillarOffset: 0.68,    // Roll cage vertical tubes centered at x = ±0.68
  innerWheelWellX: 0.59, // Center line of the inner cabin wheel houses
  
  // Longitudinal Spacing (Z-Axis)
  frontAxleZ: 1.10,      // Front axle center
  rearAxleZ: -0.75,      // Rear axle center
  windshieldZ: 0.88,     // Windshield base plane
  bPillarZ: -0.15,       // B-pillar center hoop
  tailgateZ: -1.25,      // Rear tailgate plane
  
  // Vertical Heights (Y-Axis)
  axleY: 0.38,           // Center line of axles/hubs
  tubFloorY: 0.43,       // Floorboard height
  tubTopY: 1.02,         // Top of body panels
  cageTopY: 1.48,        // Roll cage top rails
};

// --- Reusable 3D License Plate [ 5h!um ] ---
function LicensePlate({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Plate Base (Black) */}
      <mesh castShadow>
        <boxGeometry args={[0.34, 0.12, 0.015]} />
        <meshStandardMaterial color="#0b0c0e" roughness={0.5} metalness={0.8} />
      </mesh>
      {/* White Plate Border Outline */}
      <mesh position={[0, 0, 0.002]}>
        <boxGeometry args={[0.33, 0.11, 0.012]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* Inner Plate Face (Black) */}
      <mesh position={[0, 0, 0.003]}>
        <boxGeometry args={[0.31, 0.09, 0.011]} />
        <meshStandardMaterial color="#0c0e12" roughness={0.7} />
      </mesh>
      {/* 3D letters "5h!um" */}
      <group position={[-0.10, 0.002, 0.01]}>
        {/* Character '5' */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.022, 0]}><boxGeometry args={[0.024, 0.006, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[-0.009, 0.011, 0]}><boxGeometry args={[0.006, 0.016, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0, 0.001, 0]}><boxGeometry args={[0.024, 0.006, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0.009, -0.01, 0]}><boxGeometry args={[0.006, 0.016, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0, -0.02, 0]}><boxGeometry args={[0.024, 0.006, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
        </group>
        {/* Character 'h' */}
        <group position={[0.045, -0.005, 0]}>
          <mesh position={[-0.009, 0.012, 0]}><boxGeometry args={[0.006, 0.038, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0, 0.01, 0]}><boxGeometry args={[0.014, 0.006, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0.009, -0.004, 0]}><boxGeometry args={[0.006, 0.022, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
        </group>
        {/* Character '!' */}
        <group position={[0.082, 0, 0]}>
          <mesh position={[0, 0.01, 0]}><boxGeometry args={[0.006, 0.024, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0, -0.016, 0]}><boxGeometry args={[0.006, 0.006, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
        </group>
        {/* Character 'u' */}
        <group position={[0.12, -0.01, 0]}>
          <mesh position={[-0.009, 0.01, 0]}><boxGeometry args={[0.006, 0.022, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0, -0.008, 0]}><boxGeometry args={[0.018, 0.006, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0.009, 0.01, 0]}><boxGeometry args={[0.006, 0.022, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
        </group>
        {/* Character 'm' */}
        <group position={[0.165, -0.01, 0]}>
          <mesh position={[-0.015, 0.01, 0]}><boxGeometry args={[0.006, 0.022, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[-0.007, 0.018, 0]}><boxGeometry args={[0.012, 0.006, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0, 0.01, 0]}><boxGeometry args={[0.006, 0.022, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0.007, 0.018, 0]}><boxGeometry args={[0.012, 0.006, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0.015, 0.01, 0]}><boxGeometry args={[0.006, 0.022, 0.005]} /><meshStandardMaterial color="#ffffff" /></mesh>
        </group>
      </group>
    </group>
  );
}

export default function JeepAsset({ engineOn, steeringAngleRef, wheelRotationRef, color }) {
  const cfg = JEEP_CONFIG;

  // --- 2. Shared Performance Materials ---
  const materials = useMemo(() => ({
    bodyPaint: <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />,
    chassisMetal: <meshStandardMaterial color="#111317" roughness={0.9} metalness={0.8} />,
    silverMetallic: <meshStandardMaterial color="#cbd5e1" roughness={0.15} metalness={0.9} />,
    leatherSeats: <meshStandardMaterial color="#4a2a18" roughness={0.8} />,
    cageSteel: <meshStandardMaterial color="#0f1115" roughness={0.6} />,
    mirrorGlass: <meshStandardMaterial color="#1e293b" roughness={0.05} metalness={0.9} />,
    grilleFrame: <meshStandardMaterial color="#1a1d24" roughness={0.25} metalness={0.85} />,
    grilleSlits: <meshStandardMaterial color="#cbd5e1" roughness={0.1} metalness={0.95} emissive="#475569" emissiveIntensity={0.25} />,
    
    // Material separations
    bumperSteel: <meshStandardMaterial color="#2c3036" roughness={0.7} metalness={0.5} />,        
    fenderGuardPlastic: <meshStandardMaterial color="#454b54" roughness={0.4} metalness={0.1} />, 
    innerWheelWell: <meshStandardMaterial color="#090a0c" roughness={0.95} metalness={0.05} />,   
    darkPlastic: <meshStandardMaterial color="#1f2226" roughness={0.8} />,                        
  }), [color]);

  // --- 3. Calculated Roll Cage Geometries ---
  const cageGeometry = useMemo(() => {
    const calculatedBodyWidth = cfg.bodyHalfWidth * 2;
    const cageWidth = calculatedBodyWidth - 0.04;
    
    // Slanted A-pillar calculations
    const aPillarHeight = cfg.cageTopY - cfg.tubTopY;
    const aPillarZDelta = 0.07;
    const aPillarLength = Math.sqrt(aPillarHeight ** 2 + aPillarZDelta ** 2);
    const aPillarPitch = Math.atan2(aPillarZDelta, aPillarHeight);

    // Slanted Rear Kick-back calculations
    const rearHeight = cfg.cageTopY - cfg.tubTopY;
    const rearZDelta = Math.abs(cfg.bPillarZ - cfg.tailgateZ);
    const rearLength = Math.sqrt(rearHeight ** 2 + rearZDelta ** 2);
    const rearPitch = Math.atan2(rearZDelta, rearHeight);

    return {
      cageWidth,
      aPillarLength,
      aPillarPitch,
      rearLength,
      rearPitch,
    };
  }, [cfg]);

  const { cageWidth, aPillarLength, aPillarPitch, rearLength, rearPitch } = cageGeometry;

  return (
    <group>
      {/* --- 4. Scale body and chassis by 1.2x for massive realistic volume --- */}
      {/* Pivot positioned at y = -0.076 aligns the standard tire-to-body vertical gap */}
      <group scale={[1.2, 1.2, 1.2]} position={[0, -0.076, 0]}>
        
        {/* --- Left/Right Symmetrical Modules --- */}
        {[-1, 1].map((side) => {
          const xSign = side;
          return (
            <group key={side}>
              
              {/* Chassis Frame Rails */}
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

              {/* Vertical Joiners */}
              <mesh position={[xSign * cfg.railX, 0.39, 1.4]} castShadow><boxGeometry args={[0.082, 0.12, 0.1]} />{materials.chassisMetal}</mesh>
              <mesh position={[xSign * cfg.railX, 0.39, 0.8]} castShadow><boxGeometry args={[0.082, 0.12, 0.1]} />{materials.chassisMetal}</mesh>
              <mesh position={[xSign * cfg.railX, 0.39, -0.45]} castShadow><boxGeometry args={[0.082, 0.12, 0.1]} />{materials.chassisMetal}</mesh>
              <mesh position={[xSign * cfg.railX, 0.39, -1.05]} castShadow><boxGeometry args={[0.082, 0.12, 0.1]} />{materials.chassisMetal}</mesh>

              {/* Suspension Coil Springs */}
              <mesh position={[xSign * cfg.springX, 0.54, cfg.frontAxleZ]} castShadow>
                <cylinderGeometry args={[0.045, 0.045, 0.32, 10]} />
                <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.2} />
              </mesh>
              <mesh position={[xSign * cfg.springX, 0.54, cfg.rearAxleZ]} castShadow>
                <cylinderGeometry args={[0.045, 0.045, 0.32, 10]} />
                <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.2} />
              </mesh>

              {/* Outer Body Panels */}
              <mesh position={[xSign * (cfg.bodyHalfWidth - 0.025), 0.72, -0.225]} castShadow receiveShadow>
                <boxGeometry args={[0.05, 0.6, 0.45]} />
                {materials.bodyPaint}
              </mesh>
              <mesh position={[xSign * (cfg.bodyHalfWidth - 0.025), 0.72, -1.175]} castShadow receiveShadow>
                <boxGeometry args={[0.05, 0.6, 0.25]} />
                {materials.bodyPaint}
              </mesh>
              <mesh position={[xSign * (cfg.bodyHalfWidth - 0.025), 0.945, -0.75]} castShadow receiveShadow>
                <boxGeometry args={[0.05, 0.15, 0.6]} />
                {materials.bodyPaint}
              </mesh>

              {/* Watertight Inner Wheel House / Dirt Guards (Rear) */}
              <group position={[xSign * cfg.innerWheelWellX, cfg.axleY, cfg.rearAxleZ]}>
                <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.22, 0.04, 0.35]} />
                  {materials.innerWheelWell}
                </mesh>
                <mesh position={[0, 0.38, 0.22]} rotation={[Math.PI / 8, 0, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.22, 0.04, 0.22]} />
                  {materials.innerWheelWell}
                </mesh>
                <mesh position={[0, 0.38, -0.22]} rotation={[-Math.PI / 8, 0, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.22, 0.04, 0.22]} />
                  {materials.innerWheelWell}
                </mesh>
                <mesh position={[0, 0.20, 0.34]} rotation={[Math.PI / 3, 0, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.22, 0.04, 0.25]} />
                  {materials.innerWheelWell}
                </mesh>
                <mesh position={[0, 0.20, -0.34]} rotation={[-Math.PI / 3, 0, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.22, 0.04, 0.25]} />
                  {materials.innerWheelWell}
                </mesh>
              </group>

              {/* Cabin Doors */}
              <group position={[xSign * (cfg.bodyHalfWidth + 0.01), 0.72, 0.45]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.02, 0.56, 0.9]} />
                  {materials.bodyPaint}
                </mesh>
                <mesh position={[xSign * -0.011, 0, 0]}>
                  <boxGeometry args={[0.005, 0.58, 0.92]} />
                  {materials.darkPlastic}
                </mesh>
                <mesh position={[xSign * -0.012, 0, 0]}>
                  <boxGeometry args={[0.005, 0.5, 0.84]} />
                  {materials.darkPlastic}
                </mesh>
                <mesh position={[xSign * 0.011, 0.12, -0.28]} castShadow>
                  <boxGeometry args={[0.005, 0.05, 0.12]} />
                  <meshStandardMaterial color="#0a0b0d" />
                </mesh>
                <mesh position={[xSign * 0.018, 0.12, -0.28]} castShadow>
                  <boxGeometry args={[0.012, 0.02, 0.09]} />
                  <meshStandardMaterial color="#1a1c22" roughness={0.8} />
                </mesh>
              </group>

              {/* Door Hinges */}
              <mesh position={[xSign * (cfg.bodyHalfWidth + 0.02), 0.85, 0.9]} castShadow>
                <boxGeometry args={[0.015, 0.05, 0.025]} />
                {materials.darkPlastic}
              </mesh>
              <mesh position={[xSign * (cfg.bodyHalfWidth + 0.02), 0.58, 0.9]} castShadow>
                <boxGeometry args={[0.015, 0.05, 0.025]} />
                {materials.darkPlastic}
              </mesh>

              {/* Low-Profile Tire-Hugging Guards (Fender top lowered by 20% to y = 0.72) */}
              <group position={[xSign * cfg.fenderX, 0, cfg.frontAxleZ]}>
                <mesh position={[0, 0.72, 0]} castShadow>
                  <boxGeometry args={[0.22, 0.04, 0.52]} />
                  {materials.fenderGuardPlastic}
                </mesh>
                <mesh position={[0, 0.64, 0.398]} rotation={[Math.PI / 6, 0, 0]} castShadow>
                  <boxGeometry args={[0.22, 0.04, 0.32]} />
                  {materials.fenderGuardPlastic}
                </mesh>
                <mesh position={[0, 0.64, -0.398]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
                  <boxGeometry args={[0.22, 0.04, 0.32]} />
                  {materials.fenderGuardPlastic}
                </mesh>
              </group>

              <group position={[xSign * cfg.fenderX, 0, cfg.rearAxleZ]}>
                <mesh position={[0, 0.72, 0]} castShadow>
                  <boxGeometry args={[0.22, 0.04, 0.52]} />
                  {materials.fenderGuardPlastic}
                </mesh>
                <mesh position={[0, 0.64, 0.398]} rotation={[Math.PI / 6, 0, 0]} castShadow>
                  <boxGeometry args={[0.22, 0.04, 0.32]} />
                  {materials.fenderGuardPlastic}
                </mesh>
                <mesh position={[0, 0.64, -0.398]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
                  <boxGeometry args={[0.22, 0.04, 0.32]} />
                  {materials.fenderGuardPlastic}
                </mesh>
              </group>

              {/* Front Inner Fender Well Liners */}
              <mesh position={[xSign * (cfg.bodyHalfWidth - 0.12), 0.62, cfg.frontAxleZ]} castShadow>
                <boxGeometry args={[0.12, 0.16, 0.52]} />
                {materials.innerWheelWell}
              </mesh>

              {/* Seats */}
              <group position={[xSign * cfg.seatX, 0.53, 0.18]}>
                <mesh castShadow>
                  <boxGeometry args={[0.42, 0.14, 0.44]} />
                  {materials.leatherSeats}
                </mesh>
                <mesh position={[0, 0.3, -0.19]} rotation={[-0.1, 0, 0]} castShadow>
                  <boxGeometry args={[0.42, 0.52, 0.10]} />
                  {materials.leatherSeats}
                </mesh>
              </group>

              {/* Headlights */}
              <group position={[xSign * 0.48, 0.78, 1.85]}>
                <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.11, 0.11, 0.02, 12]} />
                  {materials.silverMetallic}
                </mesh>
                <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.09, 0.09, 0.02, 12]} />
                  <meshStandardMaterial 
                    color="#ffffff" 
                    emissive="#ffffff" 
                    emissiveIntensity={engineOn ? 2.0 : 0.0} 
                  />
                </mesh>
                {/* Spotlight Projectors */}
                {engineOn && (
                  <group>
                    <spotLight
                      position={[0, 0, 0.05]}
                      angle={Math.PI / 4.5}
                      penumbra={0.4}
                      intensity={25.0}
                      distance={22}
                      castShadow
                      shadow-mapSize-width={1024}
                      shadow-mapSize-height={1024}
                      shadow-bias={-0.0001}
                    >
                      <object3D attach="target" position={[0, -1.2, 6.0]} />
                    </spotLight>
                    <pointLight 
                      position={[0, -1.0, 5.0]} 
                      intensity={1.5} 
                      distance={5} 
                      color="#f1f5f9" 
                    />
                  </group>
                )}
              </group>

              {/* Rear Tail Lights */}
              <mesh position={[xSign * 0.56, 0.72, -1.31]}>
                <boxGeometry args={[0.14, 0.08, 0.02]} />
                <meshStandardMaterial 
                  color="#e11d48" 
                  emissive="#ff0000" 
                  emissiveIntensity={engineOn ? 2.5 : 0.0} 
                />
              </mesh>

              {/* Roll Cage Pillars */}
              <mesh 
                position={[xSign * cfg.pillarOffset, (cfg.tubTopY + cfg.cageTopY) / 2, cfg.windshieldZ - 0.035]} 
                rotation={[-aPillarPitch, 0, 0]} 
                castShadow
              >
                <cylinderGeometry args={[0.025, 0.025, aPillarLength, 8]} />
                {materials.cageSteel}
              </mesh>

              <mesh 
                position={[xSign * cfg.pillarOffset, cfg.cageTopY, (cfg.windshieldZ - 0.07 + cfg.bPillarZ) / 2]} 
                rotation={[Math.PI / 2, 0, 0]} 
                castShadow
              >
                <cylinderGeometry args={[0.025, 0.025, 0.96, 8]} />
                {materials.cageSteel}
              </mesh>

              <mesh position={[xSign * cfg.pillarOffset, (cfg.tubTopY + cfg.cageTopY) / 2, cfg.bPillarZ]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, cfg.cageTopY - cfg.tubTopY, 8]} />
                {materials.cageSteel}
              </mesh>

              <mesh 
                position={[xSign * cfg.pillarOffset, (cfg.tubTopY + cfg.cageTopY) / 2, (cfg.bPillarZ + cfg.tailgateZ) / 2]} 
                rotation={[rearPitch, 0, 0]} 
                castShadow
              >
                <cylinderGeometry args={[0.025, 0.025, rearLength, 8]} />
                {materials.cageSteel}
              </mesh>

              {/* Mirrors */}
              <group position={[xSign * (cfg.bodyHalfWidth + 0.12), 1.14, 0.82]}>
                <mesh position={[xSign * -0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
                  {materials.darkPlastic}
                </mesh>
                <mesh castShadow>
                  <boxGeometry args={[0.02, 0.18, 0.12]} />
                  {materials.darkPlastic}
                </mesh>
                <mesh position={[xSign * 0.011, 0, 0]}>
                  <boxGeometry args={[0.004, 0.16, 0.1]} />
                  {materials.mirrorGlass}
                </mesh>
              </group>

            </group>
          );
        })}

        {/* Tub Floor Plate */}
        <mesh position={[0, cfg.tubFloorY - 0.01, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[1.18, 0.03, 2.45]} />
          {materials.chassisMetal}
        </mesh>

        {/* Central Crossmembers */}
        <mesh position={[0, 0.35, 1.85]} castShadow receiveShadow>
          <boxGeometry args={[0.92, 0.06, 0.06]} />
          {materials.chassisMetal}
        </mesh>
        <mesh position={[0, 0.35, 1.4]} castShadow receiveShadow>
          <boxGeometry args={[0.92, 0.06, 0.06]} />
          {materials.chassisMetal}
        </mesh>
        <mesh position={[0, 0.28, 0.175]} castShadow receiveShadow>
          <boxGeometry args={[0.92, 0.04, 0.18]} />
          {materials.darkPlastic}
        </mesh>
        <mesh position={[0, 0.43, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[0.92, 0.06, 0.06]} />
          {materials.chassisMetal}
        </mesh>
        <mesh position={[0, 0.35, -1.25]} castShadow receiveShadow>
          <boxGeometry args={[0.92, 0.06, 0.06]} />
          {materials.chassisMetal}
        </mesh>

        {/* Axle Housings */}
        <group position={[0, cfg.axleY, cfg.frontAxleZ]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 1.52, 8]} />
            {materials.chassisMetal}
          </mesh>
          <mesh castShadow>
            <sphereGeometry args={[0.11, 10, 10]} />
            {materials.chassisMetal}
          </mesh>
        </group>

        <group position={[0, cfg.axleY, cfg.rearAxleZ]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 1.52, 8]} />
            {materials.chassisMetal}
          </mesh>
          <mesh castShadow>
            <sphereGeometry args={[0.11, 10, 10]} />
            {materials.chassisMetal}
          </mesh>
        </group>

        {/* Gearbox */}
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
        <mesh position={[0, 0.38, 0.6375]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.925, 6]} />
          {materials.silverMetallic}
        </mesh>
        <mesh position={[0, 0.38, -0.2875]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.925, 6]} />
          {materials.silverMetallic}
        </mesh>

        {/* Bumper */}
        <mesh position={[0, 0.44, 1.94]} castShadow>
          <boxGeometry args={[1.62, 0.16, 0.18]} />
          {materials.bumperSteel}
        </mesh>
        <mesh position={[-0.82, 0.44, 1.9]} rotation={[0, -Math.PI / 8, 0]} castShadow>
          <boxGeometry args={[0.2, 0.16, 0.12]} />
          {materials.bumperSteel}
        </mesh>
        <mesh position={[0.82, 0.44, 1.9]} rotation={[0, Math.PI / 8, 0]} castShadow>
          <boxGeometry args={[0.2, 0.16, 0.12]} />
          {materials.bumperSteel}
        </mesh>

        {/* Winch */}
        <group position={[0, 0.54, 1.92]}>
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.04, 0.14]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.7} />
          </mesh>
          <mesh position={[-0.1, 0.08, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.12, 10]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh position={[0.04, 0.08, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.042, 0.042, 0.14, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.04, 0.09]} castShadow>
            <boxGeometry args={[0.1, 0.05, 0.04]} />
            <meshStandardMaterial color="#ef4444" roughness={0.5} />
          </mesh>
        </group>

        {/* Shackles */}
        <mesh position={[-0.45, 0.38, 2.04]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.045, 0.012, 6, 12]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        <mesh position={[0.45, 0.38, 2.04]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.045, 0.012, 6, 12]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>

        {/* Front License Plate [ 5h!um ] */}
        <LicensePlate position={[0, 0.44, 2.04]} rotation={[0, 0, 0]} />

        {/* Grille */}
        <group position={[0, 0.78, 1.83]}>
          <mesh castShadow>
            <boxGeometry args={[1.36, 0.46, 0.04]} />
            {materials.grilleFrame}
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[1.24, 0.38, 0.015]} />
            {materials.darkPlastic}
          </mesh>
          {[-0.42, -0.28, -0.14, 0, 0.14, 0.28, 0.42].map((offset, i) => (
            <mesh key={i} position={[offset, 0, 0.02]} castShadow>
              <boxGeometry args={[0.05, 0.32, 0.02]} />
              {materials.grilleSlits}
            </mesh>
          ))}
        </group>

        {/* Hood */}
        <mesh position={[0, 0.78, 1.35]} castShadow>
          <boxGeometry args={[1.4, 0.48, 0.90]} />
          {materials.bodyPaint}
        </mesh>
        <mesh position={[0, 1.03, 1.32]} castShadow>
          <boxGeometry args={[0.75, 0.04, 0.85]} />
          {materials.bodyPaint}
        </mesh>

        {/* Windshield */}
        <group position={[0, 1.25, cfg.windshieldZ]} rotation={[-Math.PI / 10, 0, 0]}>
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
          <mesh position={[0, -0.24, -0.01]} castShadow>
            <boxGeometry args={[1.4, 0.04, 0.03]} />
            {materials.bodyPaint}
          </mesh>
          <mesh position={[0, 0.24, -0.01]} castShadow>
            <boxGeometry args={[1.4, 0.04, 0.03]} />
            {materials.bodyPaint}
          </mesh>
          <mesh position={[-0.68, 0, -0.01]} castShadow>
            <boxGeometry args={[0.04, 0.44, 0.03]} />
            {materials.bodyPaint}
          </mesh>
          <mesh position={[0.68, 0, -0.01]} castShadow>
            <boxGeometry args={[0.04, 0.44, 0.03]} />
            {materials.bodyPaint}
          </mesh>
        </group>

        {/* Tailgate */}
        <mesh position={[0, 0.595, cfg.tailgateZ - 0.025]} castShadow receiveShadow>
          <boxGeometry args={[1.36, 0.35, 0.05]} />
          {materials.bodyPaint}
        </mesh>
        <mesh position={[-0.45, 0.46, cfg.tailgateZ - 0.05]} castShadow>
          <boxGeometry args={[0.04, 0.03, 0.03]} />
          {materials.darkPlastic}
        </mesh>
        <mesh position={[0.45, 0.46, cfg.tailgateZ - 0.05]} castShadow>
          <boxGeometry args={[0.04, 0.03, 0.03]} />
          {materials.darkPlastic}
        </mesh>

        {/* Rear License Plate [ 5h!um ] */}
        <LicensePlate position={[0, 0.65, cfg.tailgateZ - 0.055]} rotation={[0, Math.PI, 0]} />

        {/* Dashboard */}
        <mesh position={[0, 0.98, 0.90]} castShadow>
          <boxGeometry args={[1.38, 0.18, 0.24]} />
          {materials.darkPlastic}
        </mesh>

        {/* Steering column */}
        <group position={[-0.35, 1.0, 0.80]}>
          <mesh rotation={[Math.PI / 4, 0, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.35, 8]} />
            {materials.darkPlastic}
          </mesh>
          <group position={[0, 0.12, -0.12]} rotation={[Math.PI / 4, 0, 0]}>
            <mesh castShadow>
              <torusGeometry args={[0.15, 0.02, 6, 20]} />
              {materials.darkPlastic}
            </mesh>
            <mesh position={[0, -0.07, 0]}>
              <boxGeometry args={[0.018, 0.14, 0.015]} />
              {materials.silverMetallic}
            </mesh>
            <mesh position={[-0.06, 0.04, 0]} rotation={[0, 0, Math.PI / 3]}>
              <boxGeometry args={[0.018, 0.14, 0.015]} />
              {materials.silverMetallic}
            </mesh>
            <mesh position={[0.06, 0.04, 0]} rotation={[0, 0, -Math.PI / 3]}>
              <boxGeometry args={[0.018, 0.14, 0.015]} />
              {materials.silverMetallic}
            </mesh>
          </group>
        </group>

        {/* Shifter */}
        <group position={[0, 0.58, 0.45]}>
          <mesh rotation={[-0.12, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.18, 6]} />
            {materials.silverMetallic}
          </mesh>
          <mesh position={[0, 0.09, -0.01]}>
            <sphereGeometry args={[0.026, 8, 8]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} />
          </mesh>
        </group>

        {/* Rear Seat */}
        <group position={[0, 0.53, -0.55]}>
          <mesh castShadow>
            <boxGeometry args={[1.0, 0.14, 0.44]} />
            {materials.leatherSeats}
          </mesh>
          <mesh position={[0, 0.3, -0.19]} rotation={[-0.1, 0, 0]} castShadow>
            <boxGeometry args={[1.0, 0.52, 0.10]} />
            {materials.leatherSeats}
          </mesh>
        </group>

        {/* Cage Overhead ties */}
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

        {/* Carrier Frame */}
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

      {/* --- 5. Active Driving Wheels --- */}
      {/* Spare Tire */}
      <group position={[0, 0.8 * 1.2 - 0.076, -1.48 * 1.2]} rotation={[0, Math.PI, 0]}>
        <WheelAsset isFront={false} isStatic={true} />
      </group>

      {/* Front Left Wheel */}
      <group position={[-cfg.wheelX * 1.2, cfg.axleY, cfg.frontAxleZ * 1.2]} rotation={[0, Math.PI / 2, 0]}>
        <WheelAsset 
          isFront={true} 
          side="left"
          steeringAngleRef={steeringAngleRef} 
          rotationRef={wheelRotationRef} 
          engineOn={engineOn}
        />
      </group>
      
      {/* Front Right Wheel */}
      <group position={[cfg.wheelX * 1.2, cfg.axleY, cfg.frontAxleZ * 1.2]} rotation={[0, -Math.PI / 2, 0]}>
        <WheelAsset 
          isFront={true} 
          side="right"
          steeringAngleRef={steeringAngleRef} 
          rotationRef={wheelRotationRef} 
          engineOn={engineOn}
        />
      </group>
      
      {/* Rear Left Wheel */}
      <group position={[-cfg.wheelX * 1.2, cfg.axleY, cfg.rearAxleZ * 1.2]} rotation={[0, Math.PI / 2, 0]}>
        <WheelAsset 
          isFront={false} 
          side="left"
          rotationRef={wheelRotationRef} 
          engineOn={engineOn}
        />
      </group>
      
      {/* Rear Right Wheel */}
      <group position={[cfg.wheelX * 1.2, cfg.axleY, cfg.rearAxleZ * 1.2]} rotation={[0, -Math.PI / 2, 0]}>
        <WheelAsset 
          isFront={false} 
          side="right"
          rotationRef={wheelRotationRef} 
          engineOn={engineOn}
        />
      </group>
    </group>
  );
}