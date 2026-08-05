"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import WheelAsset from "./WheelAsset";

// Sub-module Imports
import ChassisFrame from "./ChassisFrame";
import BodyPanels from "./BodyPanels";
import FenderGuards from "./FenderGuards";
import WinchBumper from "./WinchBumper";
import FrontGrille from "./FrontGrille";
import Windshield from "./Windshield";
import CabinInterior from "./CabinInterior";
import RollCage from "./RollCage";
import Headlights from "./Headlights";
import LicensePlate from "./LicensePlate";

// Parametric Height and Track Offsets
const JEEP_CONFIG = {
  bodyHalfWidth: 0.70,   
  wheelX: 0.85,          
  fenderX: 0.73,         
  railX: 0.50,           
  springX: 0.50,         
  seatX: 0.36,           
  pillarOffset: 0.68,    
  innerWheelWellX: 0.59, 
  
  frontAxleZ: 1.10,      
  rearAxleZ: -0.75,      
  windshieldZ: 0.88,     
  bPillarZ: -0.15,       
  tailgateZ: -1.25,      
  
  axleY: 0.46,           
  tubFloorY: 0.51,       
  tubTopY: 1.10,         
  cageTopY: 1.56,        
};

export default function JeepAsset({ engineOn, steeringAngleRef, wheelRotationRef, color }) {
  const cfg = JEEP_CONFIG;
  const [visibleStep, setVisibleStep] = useState(0);

  // References to directly update the 3D matrices of each module at 60fps
  const wheelsRef = useRef(null);
  const chassisRef = useRef(null);
  const bumperRef = useRef(null);
  const interiorRef = useRef(null);
  const bodyRef = useRef(null);
  const fenderRef = useRef(null);
  const grilleRef = useRef(null);
  const headlightsRef = useRef(null);
  const plateRef = useRef(null);
  const windshieldRef = useRef(null);
  const cageRef = useRef(null);
  const spareWheelRef = useRef(null);

  // GROUND-UP ASSEMBLY ORDER (12 Progressive Steps)
  const moduleRefs = useMemo(() => [
    wheelsRef,       // Step 1: Active Wheels land on ground
    chassisRef,      // Step 2: Chassis, Axles & Suspension mount onto wheels
    bumperRef,       // Step 3: Front Steel Bumper
    interiorRef,     // Step 4: Floorboards, Seats, Dashboard
    bodyRef,         // Step 5: Side Panels, Tailgate & Doors
    fenderRef,       // Step 6: Peaked Fender Flares (lowered near tires)
    grilleRef,       // Step 7: Grille & Engine Hood
    headlightsRef,   // Step 8: Headlamps & Spotlights
    plateRef,        // Step 9: Tailgate License Plate
    windshieldRef,   // Step 10: Clear Windshield & hollow frame
    cageRef,         // Step 11: Steel Tubing Safety Cage
    spareWheelRef    // Step 12: Spare Wheel drops onto tailgate carrier
  ], []);

  // Cascading drop timer (timed sequence in ms)
  useEffect(() => {
    const sequenceDelays = [
      350, // Step 1: Active Wheels land
      220, // Step 2: Chassis Frame drops
      180, // Step 3: Winch Bumper
      180, // Step 4: Cabin Interior
      180, // Step 5: Body Panels
      180, // Step 6: Fender Flares
      180, // Step 7: Front Grille
      180, // Step 8: Headlights
      150, // Step 9: License Plate
      180, // Step 10: Windshield
      200, // Step 11: Roll Cage
      250, // Step 12: Spare Wheel mounts on back
    ];

    let currentStep = 0;
    let timerId;

    const runAssembly = () => {
      if (currentStep < sequenceDelays.length) {
        timerId = setTimeout(() => {
          currentStep++;
          setVisibleStep(currentStep);
          runAssembly();
        }, sequenceDelays[currentStep]);
      }
    };

    runAssembly();

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  // Performance matrix frame loop
  useFrame((state, delta) => {
    const limitDelta = Math.min(0.1, delta); // Cap delta to prevent matrix overflow on lag spikes
    
    moduleRefs.forEach((ref, index) => {
      const group = ref.current;
      if (!group) return;

      const stepIndex = index + 1; // 1-based indexing for steps

      if (visibleStep >= stepIndex) {
        group.visible = true;
        group.scale.x = THREE.MathUtils.lerp(group.scale.x, 1, 8 * limitDelta);
        group.scale.y = THREE.MathUtils.lerp(group.scale.y, 1, 8 * limitDelta);
        group.scale.z = THREE.MathUtils.lerp(group.scale.z, 1, 8 * limitDelta);
        group.position.y = THREE.MathUtils.lerp(group.position.y, 0, 9 * limitDelta);
      } else {
        group.visible = false;
        group.scale.set(0, 0, 0);
        group.position.y = 3.5; // Starts at X units above ground
      }
    });
  });

  const materials = useMemo(() => ({
    bodyPaint: <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />,
    chassisMetal: <meshStandardMaterial color="#111317" roughness={0.9} metalness={0.8} />,
    silverMetallic: <meshStandardMaterial color="#cbd5e1" roughness={0.15} metalness={0.9} />,
    leatherSeats: <meshStandardMaterial color="#4a2a18" roughness={0.8} />,
    cageSteel: <meshStandardMaterial color="#0f1115" roughness={0.6} />,
    mirrorGlass: <meshStandardMaterial color="#1e293b" roughness={0.05} metalness={0.9} />,
    grilleFrame: <meshStandardMaterial color="#1a1d24" roughness={0.25} metalness={0.85} />,
    grilleSlits: <meshStandardMaterial color="#cbd5e1" roughness={0.1} metalness={0.95} emissive="#475569" emissiveIntensity={0.25} />,
    
    bumperSteel: <meshStandardMaterial color="#2c3036" roughness={0.7} metalness={0.5} />,        
    fenderGuardPlastic: <meshStandardMaterial color="#454b54" roughness={0.4} metalness={0.1} />, 
    innerWheelWell: <meshStandardMaterial color="#090a0c" roughness={0.95} metalness={0.05} />,   
    darkPlastic: <meshStandardMaterial color="#1f2226" roughness={0.8} />,                        
  }), [color]);

  const cageGeometry = useMemo(() => {
    const calculatedBodyWidth = cfg.bodyHalfWidth * 2;
    const cageWidth = calculatedBodyWidth - 0.04;
    
    const aPillarHeight = cfg.cageTopY - cfg.tubTopY;
    const aPillarZDelta = 0.07;
    const aPillarLength = Math.sqrt(aPillarHeight ** 2 + aPillarZDelta ** 2);
    const aPillarPitch = Math.atan2(aPillarZDelta, aPillarHeight);

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
      {/* CORRECTED: position.y adjusted from -0.167 to -0.067 to raise the body 10% vertically */}
      <group scale={[1.2, 1.44, 1.56]} position={[0, -0.067, 0]}>
        
        <group ref={chassisRef}>
          <ChassisFrame cfg={cfg} materials={materials} />
        </group>
        
        <group ref={bodyRef}>
          <BodyPanels cfg={cfg} materials={materials} spareWheelRef={spareWheelRef} />
        </group>
        
        <group ref={fenderRef}>
          <FenderGuards cfg={cfg} materials={materials} />
        </group>
        
        <group ref={bumperRef}>
          <WinchBumper cfg={cfg} materials={materials} />
        </group>
        
        <group ref={grilleRef}>
          <FrontGrille cfg={cfg} materials={materials} />
        </group>
        
        <group ref={windshieldRef}>
          <Windshield cfg={cfg} materials={materials} engineOn={engineOn} />
        </group>
        
        <group ref={interiorRef}>
          <CabinInterior cfg={cfg} materials={materials} engineOn={engineOn} steeringAngleRef={steeringAngleRef} />
        </group>
        
        <group ref={cageRef}>
          <RollCage 
            cfg={cfg} 
            materials={materials} 
            cageWidth={cageWidth}
            aPillarLength={aPillarLength}
            aPillarPitch={aPillarPitch}
            rearLength={rearLength}
            rearPitch={rearPitch}
          />
        </group>
        
        <group ref={headlightsRef}>
          <Headlights cfg={cfg} materials={materials} engineOn={engineOn} />
        </group>
        
        <group ref={plateRef}>
          <LicensePlate position={[0, 0.50, cfg.tailgateZ - 0.055]} rotation={[0, Math.PI, 0]} />
        </group>

      </group>

      {/* --- Active Wheels (Remain at ground level) --- */}
      <group ref={wheelsRef}>
        {/* Front Left Wheel */}
        <group position={[-cfg.wheelX * 1.2, cfg.axleY, cfg.frontAxleZ * 1.56]} rotation={[0, Math.PI / 2, 0]}>
          <WheelAsset 
            isFront={true} 
            side="left"
            steeringAngleRef={steeringAngleRef} 
            rotationRef={wheelRotationRef} 
            engineOn={engineOn}
          />
        </group>
        
        {/* Front Right Wheel */}
        <group position={[cfg.wheelX * 1.2, cfg.axleY, cfg.frontAxleZ * 1.56]} rotation={[0, -Math.PI / 2, 0]}>
          <WheelAsset 
            isFront={true} 
            side="right"
            steeringAngleRef={steeringAngleRef} 
            rotationRef={wheelRotationRef} 
            engineOn={engineOn}
          />
        </group>
        
        {/* Rear Left Wheel */}
        <group position={[-cfg.wheelX * 1.2, cfg.axleY, cfg.rearAxleZ * 1.56]} rotation={[0, Math.PI / 2, 0]}>
          <WheelAsset 
            isFront={false} 
            side="left"
            rotationRef={wheelRotationRef} 
            engineOn={engineOn}
          />
        </group>
        
        {/* Rear Right Wheel */}
        <group position={[cfg.wheelX * 1.2, cfg.axleY, cfg.rearAxleZ * 1.56]} rotation={[0, -Math.PI / 2, 0]}>
          <WheelAsset 
            isFront={false} 
            side="right"
            rotationRef={wheelRotationRef} 
            engineOn={engineOn}
          />
        </group>
      </group>

    </group>
  );
}