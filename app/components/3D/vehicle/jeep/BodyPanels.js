"use client";

import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import WheelAsset from "./WheelAsset";

export default function BodyPanels({ cfg, materials, spareWheelRef }) {
  const leftDoorRef = useRef(null);
  const rightDoorRef = useRef(null);
  const tailgateRef = useRef(null);

  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [tailgateOpen, setTailgateOpen] = useState(false);

  // Smooth door & tailgate animation loop
  useFrame((state, delta) => {
    const limitDelta = Math.min(0.1, delta);

    const targetLeftAngle = leftOpen ? Math.PI / 3 : 0;
    const targetRightAngle = rightOpen ? -Math.PI / 3 : 0;
    const targetTailgateAngle = tailgateOpen ? Math.PI / 1.8 : 0;

    if (leftDoorRef.current) {
      leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        leftDoorRef.current.rotation.y,
        targetLeftAngle,
        8 * limitDelta
      );
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        rightDoorRef.current.rotation.y,
        targetRightAngle,
        8 * limitDelta
      );
    }
    if (tailgateRef.current) {
      tailgateRef.current.rotation.y = THREE.MathUtils.lerp(
        tailgateRef.current.rotation.y,
        targetTailgateAngle,
        8 * limitDelta
      );
    }
  });

  // --- 1. Custom Front Door Shape & Extrusion Settings ---
  const frontDoorShape = useMemo(() => {
    const shape = new THREE.Shape();

    shape.moveTo(0.12, 1.02);     // Top/front corner slanted forward to align with windshield cowl (Z = 1.02)
    shape.lineTo(-1.12, 1.02);    // Top/rear corner
    shape.lineTo(-1.12, 0.42);    // Bottom-rear edge aligned to side skins (Z = -0.22)
    shape.lineTo(-0.30, 0.42);    // Bottom horizontal edge up to start of front wheel arch

    // Concave quarter-circle wheelwell cutout:
    shape.absarc(0.00, 0.42, 0.30, Math.PI, Math.PI / 2, true);

    shape.lineTo(0.12, 1.02);    
    shape.closePath();

    return shape;
  }, []);

  const frontDoorSettings = useMemo(() => ({
    depth: 0.025,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.003,
    bevelThickness: 0.003,
  }), []);

  // --- 2. Unified 2D Shape definition for the rear side panel ---
  const sideSkinShape = useMemo(() => {
    const shape = new THREE.Shape();
    
    shape.moveTo(-0.22, 1.02); 
    shape.lineTo(-0.22, 0.42); 
    shape.lineTo(-0.42, 0.42); 
    
    shape.absarc(-0.75, 0.42, 0.33, 0, Math.PI, false);
    
    shape.lineTo(-1.30, 0.42); 
    shape.lineTo(-1.30, 1.02); 
    
    shape.closePath();
    return shape;
  }, []);

  const sideSkinSettings = useMemo(() => ({
    depth: 0.05, 
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.005,
    bevelThickness: 0.005,
  }), []);

  const toggleLeftDoor = (e) => {
    e.stopPropagation();
    setLeftOpen((prev) => !prev);
  };

  const toggleRightDoor = (e) => {
    e.stopPropagation();
    setRightOpen((prev) => !prev);
  };

  const toggleTailgate = (e) => {
    e.stopPropagation();
    setTailgateOpen((prev) => !prev);
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
  };

  return (
    <group>
      {[-1, 1].map((xSign) => {
        const isLeft = xSign === -1;
        const doorRef = isLeft ? leftDoorRef : rightDoorRef;
        const toggleDoor = isLeft ? toggleLeftDoor : toggleRightDoor;

        return (
          <group key={xSign}>
            {/* --- Unified Extruded Side Skin --- */}
            <mesh 
              position={[xSign * (cfg.bodyHalfWidth - 0.05), 0, 0]} 
              rotation={[0, -Math.PI / 2, 0]} 
              scale={[1, 1, isLeft ? 1 : -1]} 
              castShadow 
              receiveShadow
            >
              <extrudeGeometry args={[sideSkinShape, sideSkinSettings]} />
              <meshStandardMaterial 
                color={materials.bodyPaint.props.color} 
                roughness={0.4} 
                metalness={0.3} 
                side={THREE.DoubleSide} 
              />
            </mesh>

            {/* Inner Wheel House / Mudguards */}
            <group position={[xSign * (cfg.innerWheelWellX - 0.03), cfg.axleY, cfg.rearAxleZ]}>
              <mesh position={[0, 0.45, 0]} castShadow receiveShadow><boxGeometry args={[0.16, 0.04, 0.27]} />{materials.innerWheelWell}</mesh>
              <mesh position={[0, 0.38, 0.17]} rotation={[Math.PI / 8, 0, 0]} castShadow receiveShadow><boxGeometry args={[0.16, 0.04, 0.17]} />{materials.innerWheelWell}</mesh>
              <mesh position={[0, 0.38, -0.17]} rotation={[-Math.PI / 8, 0, 0]} castShadow receiveShadow><boxGeometry args={[0.16, 0.04, 0.17]} />{materials.innerWheelWell}</mesh>
              <mesh position={[0, 0.20, 0.26]} rotation={[Math.PI / 3, 0, 0]} castShadow receiveShadow><boxGeometry args={[0.16, 0.04, 0.19]} />{materials.innerWheelWell}</mesh>
              <mesh position={[0, 0.20, -0.26]} rotation={[-Math.PI / 3, 0, 0]} castShadow receiveShadow><boxGeometry args={[0.16, 0.04, 0.19]} />{materials.innerWheelWell}</mesh>
            </group>

            {/* --- Static Side-View Mirrors (Mounted to Front Body Cowl) --- */}
            <group position={[xSign * (cfg.bodyHalfWidth + 0.015), 0.88, 1.02]}>
              {/* Mirror Base Plate */}
              <mesh castShadow>
                <boxGeometry args={[0.012, 0.05, 0.08]} />
                <meshStandardMaterial color="#0c0d10" roughness={0.9} />
              </mesh>

              {/* Angled Mounting Bracket Arm */}
              <mesh 
                position={[xSign * 0.05, 0.05, 0]} 
                rotation={[0, 0, isLeft ? Math.PI / 4 : -Math.PI / 4]} 
                castShadow
              >
                <cylinderGeometry args={[0.012, 0.012, 0.14, 8]} />
                <meshStandardMaterial color="#1a1c22" roughness={0.7} />
              </mesh>

              {/* Mirror Head Assembly */}
              <group position={[xSign * 0.20, 0.10, 0]}>
                {/* Flat Mirror Casing */}
                <mesh castShadow>
                  <boxGeometry args={[0.20, 0.14, 0.05]} />
                  <meshStandardMaterial color="#0c0d10" roughness={0.8} />
                </mesh>
                {/* Mirror Reflective Face */}
                <mesh position={[0, 0, -0.026]}>
                  <boxGeometry args={[0.18, 0.12, 0.002]} />
                  <meshStandardMaterial color="#eeeeee" roughness={0.1} metalness={0.9} />
                </mesh>
              </group>
            </group>

            {/* --- Amber Side Indicator Lights (Prominent and Highly Visible) --- */}
            <group position={[xSign * (cfg.bodyHalfWidth + 0.025), 0.75, 1.12]}>
              <mesh castShadow>
                <boxGeometry args={[0.015, 0.04, 0.08]} />
                <meshStandardMaterial color="#111111" roughness={0.9} />
              </mesh>
              <mesh position={[xSign * 0.004, 0, 0]}>
                <boxGeometry args={[0.008, 0.03, 0.07]} />
                <meshStandardMaterial 
                  color="#ff7b00" 
                  emissive="#ff5100" 
                  emissiveIntensity={3.0} 
                  roughness={0.1} 
                />
              </mesh>
            </group>

            {/* --- Cabin Side Doors --- */}
            <group 
              ref={doorRef} 
              position={[xSign * cfg.bodyHalfWidth, 0, 0.9]} 
              onClick={toggleDoor}
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
            >
              {/* Outer Door Skin (Single extruded mesh) */}
              <mesh 
                castShadow 
                receiveShadow
                rotation={[0, -Math.PI / 2, 0]}
                scale={[1, 1, isLeft ? 1 : -1]} 
                position={[isLeft ? 0.025 : -0.025, 0, 0]}
              >
                <extrudeGeometry args={[frontDoorShape, frontDoorSettings]} />
                <meshStandardMaterial 
                  color={materials.bodyPaint.props.color} 
                  roughness={0.4} 
                  metalness={0.3} 
                  side={THREE.DoubleSide}
                />

                {/* --- Robust Nested Door Handle Assembly --- */}
                {/* Positioning handles relative to the door skin's coordinate frame ensures they align automatically on both sides */}
                <group position={[-1.0, 0.80, 0.026]}>
                  {/* Handle backing plate */}
                  <mesh castShadow>
                    <boxGeometry args={[0.12, 0.05, 0.006]} />
                    <meshStandardMaterial color="#0a0b0d" roughness={0.9} />
                  </mesh>
                  {/* Grab handle pull bar */}
                  <mesh position={[0, 0, 0.014]} castShadow>
                    <boxGeometry args={[0.09, 0.022, 0.012]} />
                    <meshStandardMaterial color="#1f2229" roughness={0.7} metalness={0.5} />
                  </mesh>
                  {/* Keyhole Cylinder */}
                  <mesh position={[0.045, 0, 0.003]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.004, 0.004, 0.006, 8]} />
                    <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.8} />
                  </mesh>
                </group>
              </mesh>

              {/* Inner Door Panel Trim */}
              <mesh 
                rotation={[0, -Math.PI / 2, 0]}
                scale={[1, 1, isLeft ? 1 : -1]}
                position={[isLeft ? 0.006 + 0.025 : -0.006 - 0.025, 0, 0]}
              >
                <extrudeGeometry args={[frontDoorShape, frontDoorSettings]} />
                <meshStandardMaterial 
                  color={materials.darkPlastic.props.color} 
                  roughness={0.8} 
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>

            {/* Exterior Front Hinges */}
            <mesh position={[xSign * (cfg.bodyHalfWidth + 0.02), 0.85, 0.9]} castShadow><boxGeometry args={[0.015, 0.05, 0.025]} />{materials.darkPlastic}</mesh>
            <mesh position={[xSign * (cfg.bodyHalfWidth + 0.02), 0.58, 0.9]} castShadow><boxGeometry args={[0.015, 0.05, 0.025]} />{materials.darkPlastic}</mesh>
            <mesh position={[xSign * (cfg.bodyHalfWidth - 0.12), 0.62, cfg.frontAxleZ]} castShadow><boxGeometry args={[0.12, 0.16, 0.52]} />{materials.innerWheelWell}</mesh>
          </group>
        );
      })}

      {/* --- Rear swing-out tailgate group --- */}
      <group 
        ref={tailgateRef} 
        position={[-0.68, 0.81, cfg.tailgateZ - 0.025]}
        onClick={toggleTailgate}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Tailgate panel */}
        <mesh position={[0.68, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.36, 0.35, 0.05]} />
          {materials.bodyPaint}
        </mesh>

        {/* Hinge Straps */}
        <mesh position={[0.15, 0.06, 0.026]} castShadow>
          <boxGeometry args={[0.30, 0.03, 0.012]} />
          {materials.darkPlastic}
        </mesh>
        <mesh position={[0.15, -0.16, 0.026]} castShadow>
          <boxGeometry args={[0.30, 0.03, 0.012]} />
          {materials.darkPlastic}
        </mesh>

        {/* Grab Handle */}
        <group position={[1.22, 0.06, -0.03]}>
          <mesh castShadow>
            <boxGeometry args={[0.06, 0.16, 0.01]} />
            {materials.darkPlastic}
          </mesh>
          <mesh position={[0, 0, -0.02]} castShadow>
            <boxGeometry args={[0.03, 0.12, 0.03]} />
            <meshStandardMaterial color="#1a1c22" roughness={0.7} />
          </mesh>
        </group>

        {/* --- Spare Tire Carrier Frame --- */}
        <group position={[0.68, 0.265, 0.025]}>
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

        {/* --- Spare Wheel --- */}
        <group ref={spareWheelRef}>
          <group position={[0.68, 0.265, -0.14]} rotation={[0, Math.PI, 0]} scale={[0.7, 0.7, 0.7]}>
            <WheelAsset isFront={false} isStatic={true} />
          </group>
        </group>
      </group>

      {/* Static Rear Hinge Mounts */}
      <mesh position={[-0.68, 0.87, cfg.tailgateZ - 0.045]} castShadow><boxGeometry args={[0.03, 0.04, 0.03]} />{materials.darkPlastic}</mesh>
      <mesh position={[-0.68, 0.65, cfg.tailgateZ - 0.045]} castShadow><boxGeometry args={[0.03, 0.04, 0.03]} />{materials.darkPlastic}</mesh>
    </group>
  );
}