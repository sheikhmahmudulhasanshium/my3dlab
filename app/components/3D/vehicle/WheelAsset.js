"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WheelAsset({ 
  isFront, 
  steeringAngleRef, 
  rotationRef, 
  isStatic = false,
  engineOn = false,
  side = "left" // Added side prop to coordinate rolling direction
}) {
  const steerRef = useRef(null);
  const rollRef = useRef(null);
  const tireGroupRef = useRef(null); 

  // Black Rubber Tire (Radius: 0.22 to 0.4)
  const tireShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.40, 0, Math.PI * 2, false); 

    const rimHole = new THREE.Path();
    rimHole.absarc(0, 0, 0.23, 0, Math.PI * 2, true);
    shape.holes.push(rimHole);
    return shape;
  }, []);

  // Multi-Spoke Center Geometry
  const spokeShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.23, 0, Math.PI * 2, false);

    const hubHole = new THREE.Path();
    hubHole.absarc(0, 0, 0.07, 0, Math.PI * 2, true);
    shape.holes.push(hubHole);

    // 8 Spoke openings
    const totalCutouts = 8;
    const cutoutRadius = 0.035;
    const distanceToCenter = 0.15;

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
    depth: 0.22, 
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  }), []);

  const spokeSettings = useMemo(() => ({
    depth: 0.16,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.008,
    bevelThickness: 0.01,
  }), []);

  // Mud-Terrain Treads
  const treads = useMemo(() => {
    const arr = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * 0.401; 
      const y = Math.sin(angle) * 0.401;
      const tilt = i % 2 === 0 ? 0.35 : -0.35; 
      arr.push({ x, y, angle: angle + Math.PI / 2, tilt });
    }
    return arr;
  }, []);

  // Silver Beadlock Ring Bolts
  const beadlockBolts = useMemo(() => {
    const arr = [];
    const count = 16;
    const distance = 0.215;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      arr.push({ x, y });
    }
    return arr;
  }, []);

  // Central Hub Lug Bolts
  const centerHubBolts = useMemo(() => {
    const arr = [];
    const count = 5;
    const distance = 0.09;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      arr.push({ x, y });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (isStatic) return;

    if (rollRef.current && rotationRef) {
      // Invert left side rotation to match forward translation physics
      const directionFactor = side === "right" ? 1 : -1;
      rollRef.current.rotation.z = rotationRef.current * directionFactor;
    }

    if (isFront && steerRef.current && steeringAngleRef) {
      steerRef.current.rotation.y = steeringAngleRef.current;
    }

    if (tireGroupRef.current) {
      if (engineOn && rotationRef) {
        const rollValue = rotationRef.current;
        const speedFactor = Math.abs(rollValue) < 0.05 ? 0.12 : Math.min(1.5, Math.abs(rollValue)); 
        const bounceOffset = Math.sin(state.clock.getElapsedTime() * 24) * 0.002 * speedFactor;

        tireGroupRef.current.scale.y = 1 - Math.max(0, bounceOffset * 0.45);
        tireGroupRef.current.scale.x = 1 + Math.max(0, bounceOffset * 0.18);
        tireGroupRef.current.position.y = bounceOffset;
      } else {
        tireGroupRef.current.scale.set(1, 1, 1);
        tireGroupRef.current.position.set(0, 0, 0);
      }
    }
  });

  return (
    <group>
      <group ref={steerRef}>
        <group ref={tireGroupRef}>
          <group ref={rollRef}>
            
            {/* A. Outer Tire Wall (Clean Slate Black) */}
            <mesh position={[0, 0, -0.11]} castShadow>
              <extrudeGeometry args={[tireShape, tireSettings]} />
              <meshStandardMaterial color="#111214" roughness={0.92} metalness={0.01} />
            </mesh>

            {/* B. Mud-Terrain Treads (Weathered Dirt/Silt Mud Finish for Contrast) */}
            {treads.map((tread, i) => (
              <mesh 
                key={i} 
                position={[tread.x, tread.y, 0]} 
                rotation={[tread.tilt, 0, tread.angle]}
                castShadow
              >
                <boxGeometry args={[0.07, 0.018, 0.21]} />
                <meshStandardMaterial color="#4d463e" roughness={0.95} metalness={0.05} />
              </mesh>
            ))}

            {/* C. Outer Rim Barrel Lip (Silver Metallic) */}
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.232, 0.232, 0.22, 32, 1, true]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
            </mesh>

            {/* D. Center Wheel Spokes (Silver Metallic) */}
            <mesh position={[0, 0, -0.08]} castShadow>
              <extrudeGeometry args={[spokeShape, spokeSettings]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.95} />
            </mesh>

            {/* E. Outer Beadlock Clamp Ring (Silver Metallic) */}
            <mesh position={[0, 0, 0.08]} castShadow>
              <torusGeometry args={[0.228, 0.012, 12, 32]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.1} metalness={0.95} />
            </mesh>

            {/* F. Beadlock Locking Fasteners */}
            {beadlockBolts.map((bolt, i) => (
              <mesh key={i} position={[bolt.x, bolt.y, 0.086]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.008, 0.008, 0.015, 6]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
              </mesh>
            ))}

            {/* G. Central Lug Nuts */}
            {centerHubBolts.map((bolt, i) => (
              <mesh key={i} position={[bolt.x, bolt.y, 0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.01, 0.01, 0.02, 6]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
              </mesh>
            ))}

            {/* H. Machined Center Cap */}
            <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.022, 12]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.1} metalness={0.95} />
            </mesh>

          </group>
        </group>
      </group>
    </group>
  );
}