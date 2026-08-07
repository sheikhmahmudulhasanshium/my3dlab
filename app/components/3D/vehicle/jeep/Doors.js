"use client";

import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import WheelAsset from "./WheelAsset";

export default function Doors({ cfg, materials, spareWheelRef }) {
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

  // --- Cabin Door Shape & Extrusion Settings ---
  const frontDoorShape = useMemo(() => {
    const shape = new THREE.Shape();

    shape.moveTo(0.12, 1.02);     // Top/front corner slanted forward to align with windshield cowl
    shape.lineTo(-1.12, 1.02);    // Top/rear corner
    shape.lineTo(-1.12, 0.42);    // Bottom-rear edge
    shape.lineTo(-0.30, 0.42);    // Bottom horizontal edge up to wheel arch

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
      {/* --- Interactive Cabin Side Doors --- */}
      {[-1, 1].map((xSign) => {
        const isLeft = xSign === -1;
        const doorRef = isLeft ? leftDoorRef : rightDoorRef;
        const toggleDoor = isLeft ? toggleLeftDoor : toggleRightDoor;

        return (
          <group 
            key={`cabin-door-${xSign}`}
            ref={doorRef} 
            position={[xSign * cfg.bodyHalfWidth, 0, 0.9]} 
            onClick={toggleDoor}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            {/* Outer Door Skin */}
            <mesh 
              castShadow 
              receiveShadow
              rotation={[0, -Math.PI / 2, 0]}
              scale={[1, 1, isLeft ? 1 : -1]} 
              position={[isLeft ? 0.025 : -0.025, 0, 0]}
            >
              <extrudeGeometry args={[frontDoorShape, frontDoorSettings]} />
              {materials.bodyPaint}

              {/* Nested Door Handle Assembly */}
              <group position={[-1.0, 0.80, 0.026]}>
                <mesh castShadow>
                  <boxGeometry args={[0.12, 0.05, 0.006]} />
                  <meshStandardMaterial color="#0a0b0d" roughness={0.9} />
                </mesh>
                <mesh position={[0, 0, 0.014]} castShadow>
                  <boxGeometry args={[0.09, 0.022, 0.012]} />
                  <meshStandardMaterial color="#1f2229" roughness={0.7} metalness={0.5} />
                </mesh>
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
              {materials.darkPlastic}
            </mesh>
          </group>
        );
      })}

      {/* --- Rear Swing-Out Tailgate Door --- */}
      <group 
        ref={tailgateRef} 
        position={[-0.56, 0.81, cfg.tailgateZ - 0.025]}
        onClick={toggleTailgate}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Tailgate Panel */}
        <mesh position={[0.56, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.12, 0.35, 0.05]} />
          {materials.bodyPaint}
        </mesh>

        {/* Tailgate Hinge Straps */}
        <mesh position={[0.15, 0.06, 0.026]} castShadow>
          <boxGeometry args={[0.30, 0.03, 0.012]} />
          {materials.darkPlastic}
        </mesh>
        <mesh position={[0.15, -0.16, 0.026]} castShadow>
          <boxGeometry args={[0.30, 0.03, 0.012]} />
          {materials.darkPlastic}
        </mesh>

        {/* Grab Handle */}
        <group position={[0.98, 0.06, -0.03]}>
          <mesh castShadow>
            <boxGeometry args={[0.06, 0.16, 0.01]} />
            {materials.darkPlastic}
          </mesh>
          <mesh position={[0, 0, -0.02]} castShadow>
            <boxGeometry args={[0.03, 0.12, 0.03]} />
            <meshStandardMaterial color="#1a1c22" roughness={0.7} />
          </mesh>
        </group>

        {/* Spare Tire Carrier Frame */}
        <group position={[0.56, 0.265, 0.025]}>
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

        {/* Spare Wheel Asset */}
        <group ref={spareWheelRef}>
          <group position={[0.56, 0.265, -0.14]} rotation={[0, Math.PI, 0]} scale={[0.55, 0.55, 0.55]}>
            <WheelAsset isFront={false} isStatic={true} />
          </group>
        </group>
      </group>
    </group>
  );
}