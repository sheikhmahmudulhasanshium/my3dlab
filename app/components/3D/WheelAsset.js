// app/components/3D/WheelAsset.js
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WheelAsset({ isFront, steeringAngleRef, rotationRef, isStatic = false }) {
  const steerRef = useRef(null);
  const rollRef = useRef(null);

  // 1. Black Rubber Tire (Radius: 0.22 to 0.38 - scaled down for realism)
  const tireShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.38, 0, Math.PI * 2, false); 

    const rimHole = new THREE.Path();
    rimHole.absarc(0, 0, 0.22, 0, Math.PI * 2, true);
    shape.holes.push(rimHole);
    return shape;
  }, []);

  // 2. Silver Spokes (Radius: 0.06 to 0.22)
  const spokeShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.22, 0, Math.PI * 2, false);

    const hubHole = new THREE.Path();
    hubHole.absarc(0, 0, 0.06, 0, Math.PI * 2, true);
    shape.holes.push(hubHole);

    // 5 Spoke cutouts
    const totalCutouts = 5;
    const cutoutRadius = 0.04;
    const distanceToCenter = 0.13;

    for (let i = 0; i < totalCutouts; i++) {
      const angle = (i / totalCutouts) * Math.PI * 2;
      const x = Math.cos(angle) * distanceToCenter;
      const y = Math.sin(angle) * distanceToCenter;

      const spokeCutout = new THREE.Path();
      spokeCutout.absarc(x, y, cutoutRadius, 0, Math.PI * 2, true);
      shape.holes.push(spokeCutout);
    }
    return shape;
  }, []);

  const tireSettings = useMemo(() => ({
    depth: 0.18,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  }), []);

  const spokeSettings = useMemo(() => ({
    depth: 0.14,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.008,
    bevelThickness: 0.01,
  }), []);

  useFrame(() => {
    if (isStatic) return; // Prevent rotation on the rear spare tire

    if (rollRef.current && rotationRef) {
      rollRef.current.rotation.z = rotationRef.current;
    }
    if (isFront && steerRef.current && steeringAngleRef) {
      steerRef.current.rotation.y = steeringAngleRef.current;
    }
  });

  return (
    <group ref={steerRef}>
      <group ref={rollRef}>
        
        {/* A. Outer Matte Black Rubber Tire */}
        <mesh position={[0, 0, -0.09]} castShadow>
          <extrudeGeometry args={[tireShape, tireSettings]} />
          <meshStandardMaterial color="#111215" roughness={0.9} metalness={0.05} />
        </mesh>

        {/* B. Silver Steel Spokes */}
        <mesh position={[0, 0, -0.07]} castShadow>
          <extrudeGeometry args={[spokeShape, spokeSettings]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* C. Rusty Outer Rim Ring Lip */}
        <mesh position={[0, 0, 0.065]} castShadow>
          <torusGeometry args={[0.22, 0.015, 8, 24]} />
          <meshStandardMaterial color="#52321a" roughness={0.85} metalness={0.4} />
        </mesh>

        {/* D. Golden Brass Center Cap */}
        <mesh position={[0, 0, 0.075]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#c5a012" roughness={0.3} metalness={0.8} />
        </mesh>

      </group>
    </group>
  );
}