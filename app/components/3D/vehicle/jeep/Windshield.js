"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Windshield({ cfg, materials, engineOn }) {
  const windshieldGroupRef = useRef(null);
  const leftWiperRef = useRef(null);
  const rightWiperRef = useRef(null);

  // Dragging state tracking
  const [activeDrag, setActiveDrag] = useState(null); 

  // Windshield layout limits
  const leftPivot = new THREE.Vector2(-0.32, -0.22);
  const rightPivot = new THREE.Vector2(0.28, -0.22);

  const restAngle = -Math.PI / 2.3; 
  const maxAngle = Math.PI / 10;     

  // Helper to calculate rotation angle based on world hit point
  const calculateAngle = (worldPoint, pivot) => {
    if (!windshieldGroupRef.current) return restAngle;
    const localPoint = windshieldGroupRef.current.worldToLocal(worldPoint.clone());
    const angle = Math.atan2(localPoint.y - pivot.y, localPoint.x - pivot.x);
    return THREE.MathUtils.clamp(angle, restAngle, maxAngle);
  };

  const handlePointerDown = (e, side) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    setActiveDrag(side);
  };

  const handlePointerMove = (e) => {
    if (!activeDrag) return;
    e.stopPropagation();

    const pivot = activeDrag === "left" ? leftPivot : rightPivot;
    const targetRef = activeDrag === "left" ? leftWiperRef : rightWiperRef;

    if (targetRef.current) {
      const targetAngle = calculateAngle(e.point, pivot);
      targetRef.current.rotation.z = targetAngle;
    }
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    try {
      e.target.releasePointerCapture(e.pointerId);
    } catch (err) {}
    setActiveDrag(null);
  };

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const limitDelta = Math.min(0.1, delta);

    if (engineOn) {
      const sweepFactor = (Math.sin(time * 4.5) + 1) / 2;
      const targetSweepAngle = restAngle + sweepFactor * (maxAngle - restAngle);

      if (activeDrag !== "left" && leftWiperRef.current) {
        leftWiperRef.current.rotation.z = THREE.MathUtils.lerp(
          leftWiperRef.current.rotation.z,
          targetSweepAngle,
          15 * limitDelta
        );
      }
      if (activeDrag !== "right" && rightWiperRef.current) {
        rightWiperRef.current.rotation.z = THREE.MathUtils.lerp(
          rightWiperRef.current.rotation.z,
          targetSweepAngle,
          15 * limitDelta
        );
      }
    } else {
      if (activeDrag !== "left" && leftWiperRef.current) {
        leftWiperRef.current.rotation.z = THREE.MathUtils.lerp(
          leftWiperRef.current.rotation.z,
          restAngle,
          8 * limitDelta
        );
      }
      if (activeDrag !== "right" && rightWiperRef.current) {
        rightWiperRef.current.rotation.z = THREE.MathUtils.lerp(
          rightWiperRef.current.rotation.z,
          restAngle,
          8 * limitDelta
        );
      }
    }
  });

  return (
    <group 
      ref={windshieldGroupRef} 
      position={[0, 1.25, cfg.windshieldZ]} 
      rotation={[-Math.PI / 10, 0, 0]}
    >
      {/* High-Refraction Clear Glass */}
      <mesh>
        <boxGeometry args={[1.32, 0.44, 0.02]} />
        <meshStandardMaterial 
          color="#38bdf8" 
          transparent 
          opacity={0.05} 
          roughness={0.1} 
          metalness={0.1} 
          emissive="#0ea5e9" 
          emissiveIntensity={0.2} 
          depthWrite={false} 
        />
      </mesh>

      {/* Hollow Frame Struts */}
      <mesh position={[0, -0.24, -0.01]} castShadow><boxGeometry args={[1.4, 0.04, 0.03]} />{materials.bodyPaint}</mesh>
      <mesh position={[0, 0.24, -0.01]} castShadow><boxGeometry args={[1.4, 0.04, 0.03]} />{materials.bodyPaint}</mesh>
      <mesh position={[-0.68, 0, -0.01]} castShadow><boxGeometry args={[0.04, 0.44, 0.03]} />{materials.bodyPaint}</mesh>
      <mesh position={[0.68, 0, -0.01]} castShadow><boxGeometry args={[0.04, 0.44, 0.03]} />{materials.bodyPaint}</mesh>

      {/* --- Interior Rearview Mirror (Positioned near the top-center frame of the windshield) --- */}
      <group position={[0, 0.18, -0.04]} rotation={[Math.PI / 10, 0, 0]}>
        {/* Mounting stalk */}
        <mesh rotation={[0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.007, 0.007, 0.06, 8]} />
          <meshStandardMaterial color="#1a1c22" roughness={0.7} />
        </mesh>
        {/* Mirror casing */}
        <mesh position={[0, -0.03, 0.012]} castShadow>
          <boxGeometry args={[0.22, 0.065, 0.016]} />
          <meshStandardMaterial color="#0c0d10" roughness={0.8} />
        </mesh>
        {/* Reflective mirror glass (facing backwards towards passenger area) */}
        <mesh position={[0, -0.03, -0.009]}>
          <boxGeometry args={[0.21, 0.055, 0.002]} />
          <meshStandardMaterial color="#dddddd" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* --- High-Visibility Wipers --- */}

      {/* Left Wiper */}
      <group 
        ref={leftWiperRef} 
        position={[leftPivot.x, leftPivot.y, 0.018]} 
        rotation={[0, 0, restAngle]}
      >
        {/* Invisible collider mesh for easy grabbing */}
        <mesh 
          visible={false} 
          position={[0, 0.12, 0.01]}
          onPointerDown={(e) => handlePointerDown(e, "left")}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <boxGeometry args={[0.15, 0.26, 0.04]} />
        </mesh>

        {/* Pivot Cap (Bright Chrome) */}
        <mesh castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.015, 8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Wiper Arm */}
        <mesh position={[0, 0.12, 0.005]} castShadow>
          <boxGeometry args={[0.012, 0.24, 0.008]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Wiper Blade */}
        <mesh position={[0.008, 0.12, 0.01]} castShadow>
          <boxGeometry args={[0.006, 0.22, 0.004]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.2} />
        </mesh>
      </group>

      {/* Right Wiper */}
      <group 
        ref={rightWiperRef} 
        position={[rightPivot.x, rightPivot.y, 0.018]} 
        rotation={[0, 0, restAngle]}
      >
        {/* Invisible collider mesh for easy grabbing */}
        <mesh 
          visible={false} 
          position={[0, 0.12, 0.01]}
          onPointerDown={(e) => handlePointerDown(e, "right")}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <boxGeometry args={[0.15, 0.26, 0.04]} />
        </mesh>

        {/* Pivot Cap */}
        <mesh castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.015, 8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Wiper Arm */}
        <mesh position={[0, 0.12, 0.005]} castShadow>
          <boxGeometry args={[0.012, 0.24, 0.008]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Wiper Blade */}
        <mesh position={[0.008, 0.12, 0.01]} castShadow>
          <boxGeometry args={[0.006, 0.22, 0.004]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.2} />
        </mesh>
      </group>
    </group>
  );
}