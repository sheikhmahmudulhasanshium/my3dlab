"use client";

import { useMemo, useState, useEffect } from "react";
import * as THREE from "three";

export default function BodyPanels({
  cfg,
  materials,
  isBraking = false,
  areLightsOn = false,
  indicator = "off", // 'off' | 'left' | 'right' | 'hazard'
  isReversing = false,
}) {
  const [blinkOn, setBlinkOn] = useState(false);

  // Blinker interval timer (without synchronous setState calls in the effect body)
  useEffect(() => {
    if (indicator === "off") return;

    const interval = setInterval(() => {
      setBlinkOn((prev) => !prev);
    }, 330); // ~180 BPM blink rate

    return () => {
      clearInterval(interval);
    };
  }, [indicator]);

  // --- Side Skin Shape & Extrusion Settings ---
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

  return (
    <group>
      {[-1, 1].map((xSign) => {
        const isLeft = xSign === -1;

        return (
          <group key={`side-skin-assembly-${xSign}`}>
            {/* Unified Extruded Side Skin */}
            <mesh 
              position={[xSign * (cfg.bodyHalfWidth - 0.05), 0, 0]} 
              rotation={[0, -Math.PI / 2, 0]} 
              scale={[1, 1, isLeft ? 1 : -1]} 
              castShadow 
              receiveShadow
            >
              <extrudeGeometry args={[sideSkinShape, sideSkinSettings]} />
              {materials.bodyPaint}
            </mesh>

            {/* Inner Wheel House / Mudguards */}
            <group position={[xSign * (cfg.innerWheelWellX - 0.03), cfg.axleY, cfg.rearAxleZ]}>
              <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.16, 0.04, 0.27]} />
                {materials.innerWheelWell}
              </mesh>
              <mesh position={[0, 0.38, 0.17]} rotation={[Math.PI / 8, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.16, 0.04, 0.17]} />
                {materials.innerWheelWell}
              </mesh>
              <mesh position={[0, 0.38, -0.17]} rotation={[-Math.PI / 8, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.16, 0.04, 0.17]} />
                {materials.innerWheelWell}
              </mesh>
              <mesh position={[0, 0.20, 0.26]} rotation={[Math.PI / 3, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.16, 0.04, 0.19]} />
                {materials.innerWheelWell}
              </mesh>
              <mesh position={[0, 0.20, -0.26]} rotation={[-Math.PI / 3, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.16, 0.04, 0.19]} />
                {materials.innerWheelWell}
              </mesh>
            </group>

            {/* Static Side-View Mirrors */}
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

            {/* Amber Side Indicator Lights */}
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

            {/* Static Front Door Hinges */}
            <mesh position={[xSign * (cfg.bodyHalfWidth + 0.02), 0.85, 0.9]} castShadow>
              <boxGeometry args={[0.015, 0.05, 0.025]} />
              {materials.darkPlastic}
            </mesh>
            <mesh position={[xSign * (cfg.bodyHalfWidth + 0.02), 0.58, 0.9]} castShadow>
              <boxGeometry args={[0.015, 0.05, 0.025]} />
              {materials.darkPlastic}
            </mesh>

            {/* Front Wheel Well Interior Shielding */}
            <mesh position={[xSign * (cfg.bodyHalfWidth - 0.12), 0.62, cfg.frontAxleZ]} castShadow>
              <boxGeometry args={[0.12, 0.16, 0.52]} />
              {materials.innerWheelWell}
            </mesh>
          </group>
        );
      })}

      {/* --- STATIONARY REAR PLATES WITH TAIL-LIGHT CLUSTERS --- */}
      {[-1, 1].map((xSign) => {
        const isLeft = xSign === -1;

        // Determine if this specific side blinker is active and flashing
        const isBlinkerActive = 
          ((isLeft && indicator === "left") || 
           (!isLeft && indicator === "right") || 
           indicator === "hazard") && 
          blinkOn;

        return (
          <group 
            key={`stationary-plate-${xSign}`} 
            position={[xSign * 0.62, 0.81, cfg.tailgateZ - 0.025]}
          >
            {/* Stationary Plate Panel */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.12, 0.35, 0.05]} />
              {materials.bodyPaint}
            </mesh>

            {/* Tail Light Housing Base */}
            <mesh position={[0, 0, -0.026]} castShadow>
              <boxGeometry args={[0.08, 0.24, 0.006]} />
              <meshStandardMaterial color="#0c0d10" roughness={0.9} />
            </mesh>

            {/* Indicator Light (Top Segment) */}
            <mesh position={[0, 0.07, -0.03]} castShadow>
              <boxGeometry args={[0.06, 0.05, 0.005]} />
              <meshStandardMaterial 
                color={isBlinkerActive ? "#ffaa00" : "#3d2500"} 
                emissive={isBlinkerActive ? "#ff9900" : "#000000"} 
                emissiveIntensity={isBlinkerActive ? 3.5 : 0.0} 
                roughness={0.2} 
              />
            </mesh>

            {/* Brake / Tail Light (Middle Segment) */}
            <mesh position={[0, 0.0, -0.03]} castShadow>
              <boxGeometry args={[0.06, 0.07, 0.005]} />
              <meshStandardMaterial 
                color={isBraking ? "#ff0000" : areLightsOn ? "#b30000" : "#440000"} 
                emissive={isBraking ? "#ff0000" : areLightsOn ? "#ff0000" : "#000000"} 
                emissiveIntensity={isBraking ? 5.0 : areLightsOn ? 1.5 : 0.0} 
                roughness={0.2} 
              />
            </mesh>

            {/* Reverse Light (Bottom Segment) */}
            <mesh position={[0, -0.065, -0.03]} castShadow>
              <boxGeometry args={[0.06, 0.04, 0.005]} />
              <meshStandardMaterial 
                color={isReversing ? "#ffffff" : "#333333"} 
                emissive={isReversing ? "#ffffff" : "#000000"} 
                emissiveIntensity={isReversing ? 3.0 : 0.0} 
                roughness={0.2} 
              />
            </mesh>
          </group>
        );
      })}

      {/* Static Rear Hinge Mounts for Tailgate */}
      <mesh position={[-0.56, 0.87, cfg.tailgateZ - 0.045]} castShadow>
        <boxGeometry args={[0.03, 0.04, 0.03]} />
        {materials.darkPlastic}
      </mesh>
      <mesh position={[-0.56, 0.65, cfg.tailgateZ - 0.045]} castShadow>
        <boxGeometry args={[0.03, 0.04, 0.03]} />
        {materials.darkPlastic}
      </mesh>
    </group>
  );
}