"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WheelAsset({ 
  isFront, 
  steeringAngleRef, 
  rotationRef, 
  isStatic = false,
  engineOn = false // Added engineOn prop
}) {
  const steerRef = useRef(null);
  const rollRef = useRef(null);
  const tireGroupRef = useRef(null); 

  // Black Rubber Tire (Radius: 0.22 to 0.38)
  const tireShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.38, 0, Math.PI * 2, false); 

    const rimHole = new THREE.Path();
    rimHole.absarc(0, 0, 0.22, 0, Math.PI * 2, true);
    shape.holes.push(rimHole);
    return shape;
  }, []);

  // Silver Spokes (Radius: 0.06 to 0.22)
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

  // Generate 32 low-profile off-road treads
  const treads = useMemo(() => {
    const arr = [];
    const count = 32;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * 0.381; 
      const y = Math.sin(angle) * 0.381;
      const tilt = i % 2 === 0 ? 0.3 : -0.3; 
      arr.push({ x, y, angle: angle + Math.PI / 2, tilt });
    }
    return arr;
  }, []);

  // Generate 5 mounting bolts coordinates
  const bolts = useMemo(() => {
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

    // Apply rotation around the Z-axis to roll
    if (rollRef.current && rotationRef) {
      rollRef.current.rotation.z = rotationRef.current;
    }

    // Apply steering angle around the Y-axis to steer
    if (isFront && steerRef.current && steeringAngleRef) {
      steerRef.current.rotation.y = steeringAngleRef.current;
    }

    // Tire Bounciness & Squish suspension emulation (Runs only when engine is ON)
    if (tireGroupRef.current) {
      if (engineOn && rotationRef) {
        const rollValue = rotationRef.current;
        
        // Idle vibration if stationary, transitioning to rolling vibration when moving
        const speedFactor = Math.abs(rollValue) < 0.05 ? 0.12 : Math.min(1.5, Math.abs(rollValue)); 
        
        // Toned down frequency (22) and amplitude (0.002) for smooth bounciness
        const bounceOffset = Math.sin(state.clock.getElapsedTime() * 22) * 0.002 * speedFactor;

        // Apply vertical bounce & scaling squish
        tireGroupRef.current.scale.y = 1 - Math.max(0, bounceOffset * 0.4);
        tireGroupRef.current.scale.x = 1 + Math.max(0, bounceOffset * 0.15);
        tireGroupRef.current.position.y = bounceOffset;
      } else {
        // Reset to normal shape when engine is off
        tireGroupRef.current.scale.set(1, 1, 1);
        tireGroupRef.current.position.set(0, 0, 0);
      }
    }
  });

  return (
    <group ref={steerRef}>
      <group ref={tireGroupRef}>
        <group ref={rollRef}>
          
          {/* A. Outer Matte Black Rubber Tire */}
          <mesh position={[0, 0, -0.09]} castShadow>
            <extrudeGeometry args={[tireShape, tireSettings]} />
            <meshStandardMaterial color="#1a1b1f" roughness={0.9} metalness={0.02} />
          </mesh>

          {/* B. Crisscross Tire Gripper Treads */}
          {treads.map((tread, i) => (
            <mesh 
              key={i} 
              position={[tread.x, tread.y, 0]} 
              rotation={[tread.tilt, 0, tread.angle]}
              castShadow
            >
              <boxGeometry args={[0.05, 0.015, 0.17]} />
              <meshStandardMaterial color="#111215" roughness={0.95} />
            </mesh>
          ))}

          {/* C. Outer Rim Barrel Lip */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.222, 0.222, 0.18, 32, 1, true]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* D. Silver Steel Spokes */}
          <mesh position={[0, 0, -0.07]} castShadow>
            <extrudeGeometry args={[spokeShape, spokeSettings]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
          </mesh>

          {/* E. Symmetrical Rim Mounting Lug Bolts */}
          {bolts.map((bolt, i) => (
            <mesh key={i} position={[bolt.x, bolt.y, 0.072]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, 0.02, 6]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
            </mesh>
          ))}

          {/* F. Rusty Outer Rim Ring Lip */}
          <mesh position={[0, 0, 0.065]} castShadow>
            <torusGeometry args={[0.22, 0.015, 8, 24]} />
            <meshStandardMaterial color="#52321a" roughness={0.85} metalness={0.4} />
          </mesh>

          {/* G. Golden Brass Center Hub Cap */}
          <mesh position={[0, 0, 0.072]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
            <meshStandardMaterial color="#c5a012" roughness={0.3} metalness={0.8} />
          </mesh>

        </group>
      </group>
    </group>
  );
}