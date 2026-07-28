"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 1. Static Extrude Settings (Declared outside of render)
const EXTRUDE_SETTINGS = {
  depth: 0.02, // Thickness of the semilunar core
  bevelEnabled: false,
};

// 2. Semilunar Crescent Core Shape (OpenGL style polygon, wide at base, tapering to a point)
const CORE_SHAPE = (() => {
  const shape = new THREE.Shape();
  // Starts wide at origin base (Y: -0.03 to +0.03)
  shape.moveTo(0, 0.03);
  // Curves downward along the top edge to a sharp tip at X: 1.0, Y: -0.25
  shape.quadraticCurveTo(0.5, 0.02, 1.0, -0.25);
  // Tapers back along the bottom edge to the lower base origin
  shape.quadraticCurveTo(0.5, -0.06, 0, -0.03);
  shape.closePath();
  return shape;
})();

// 3. Procedural Pinnate Palm Frond with Tapered Semilunar Core
function PinnateFrond({ color, scale = 1 }) {
  // Generate 6 pairs of leaflets positioned exactly along the curved path of the semilunar core
  const leaflets = useMemo(() => {
    const arr = [];
    const count = 6;
    for (let i = 0; i < count; i++) {
      const progress = i / count;

      // Spacing along the X-axis (Core length)
      const xPos = 0.15 + progress * 0.8; 

      // Matches the downward quadratic curve of the core shape
      const yPos = xPos * -0.15 - Math.pow(xPos, 2) * 0.1; 

      // Tapered leaflet blade length
      const leafletLength = 0.15 + Math.sin(progress * Math.PI) * 0.25;
      
      // Inverted angles to sweep leaflets OUTWARD/FORWARD (^) toward the tip (+X)
      const angleLeft = 0.45 + progress * 0.22;   // Positive sweeps left leaflet forward (+X)
      const angleRight = -0.45 - progress * 0.22; // Negative sweeps right leaflet forward (+X)

      // 3D Roll/Flaring angle to form a V-channel shape
      const rollLeft = 0.35 - progress * 0.1;   
      const rollRight = -0.35 + progress * 0.1; 

      arr.push({ xPos, yPos, leafletLength, angleLeft, angleRight, rollLeft, rollRight });
    }
    return arr;
  }, []);

  const scaleVector = Array.isArray(scale) ? scale : [scale, scale, scale];

  return (
    <group scale={scaleVector}>
      {/* A. Tapered Semilunar Core (Extruded Crescent Polygon) */}
      <mesh castShadow position={[0, 0, -0.01]}>
        <extrudeGeometry args={[CORE_SHAPE, EXTRUDE_SETTINGS]} />
        <meshStandardMaterial color="#4a2c11" roughness={0.9} />
      </mesh>

      {/* B. Spaced-out Leaflet Blades attached to the Core */}
      {leaflets.map((leaflet, idx) => (
        <group key={idx} position={[leaflet.xPos, leaflet.yPos, 0]}>
          {/* Left Leaflet (Swept forward ^, flared upward) */}
          <mesh rotation={[leaflet.rollLeft, leaflet.angleLeft, 0]} position={[0, 0, leaflet.leafletLength / 2]} castShadow>
            <boxGeometry args={[0.024, 0.003, leaflet.leafletLength]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
          {/* Right Leaflet (Swept forward ^, flared upward) */}
          <mesh rotation={[leaflet.rollRight, leaflet.angleRight, 0]} position={[0, 0, -leaflet.leafletLength / 2]} castShadow>
            <boxGeometry args={[0.024, 0.003, leaflet.leafletLength]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 4. Main Exported Component
export default function CoconutTree({ color, windSpeed = 1.0 }) {
  const leafColor = color || "#00ff3e"; // OpenGL Green

  const trunkGroupRef = useRef(null); // Ref to sway the entire trunk structure
  const crownRef = useRef(null);      // Ref to wobble the leaves independently

  // Calculate standard angle values in radians for nesting layers
  const COPIED_ROTATION_1 = (300 * Math.PI) / 180; 
  const COPIED_ROTATION_2 = (240 * Math.PI) / 180; 

  // Generate 12 curved trunk segments (S-curve left -> right -> left)
  const trunkSegments = useMemo(() => {
    const arr = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const progress = i / count;
      const yPos = i * 0.22;
      const xPos = Math.sin(progress * Math.PI * 1.8) * 0.22;
      const tilt = Math.cos(progress * Math.PI * 1.8) * 0.15; 
      const scale = 1 - progress * 0.22;
      arr.push({ yPos, xPos, tilt, scale });
    }
    return arr;
  }, []);

  // Calculate the precise mathematical top of the curved trunk to pivot the crown
  const crownPivot = useMemo(() => {
    const height = 12 * 0.22;
    const xOffset = Math.sin(1.0 * Math.PI * 1.8) * 0.22;
    const tilt = Math.cos(1.0 * Math.PI * 1.8) * 0.15;
    return { x: xOffset, y: height, tilt };
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // 1. Heavy Slower Trunk Sway (Fades completely to 0 if wind is deactivated)
    if (trunkGroupRef.current) {
      const swayX = Math.sin(elapsed * 1.4 * windSpeed) * 0.024 * windSpeed;
      const swayZ = Math.cos(elapsed * 1.1 * windSpeed) * 0.018 * windSpeed;
      trunkGroupRef.current.rotation.x = swayX;
      trunkGroupRef.current.rotation.z = swayZ;
    }

    // 2. High-Frequency Leaf Rustle/Crown Wobble (Creates a realistic independent foliage breeze)
    if (crownRef.current) {
      const wobbleX = Math.sin(elapsed * 4.2 * windSpeed) * 0.015 * windSpeed;
      const wobbleZ = Math.cos(elapsed * 3.6 * windSpeed) * 0.015 * windSpeed;
      crownRef.current.rotation.x = wobbleX;
      crownRef.current.rotation.z = wobbleZ;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      
      {/* --- Static Flared Buttress Roots Base (/www\) --- */}
      {/* Kept outside the trunkGroupRef so they stay firmly planted in the soil grid */}
      {[...Array(4)].map((_, i) => {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const rootX = Math.cos(angle) * 0.08;
        const rootZ = Math.sin(angle) * 0.08;
        return (
          <mesh 
            key={`root-${i}`} 
            position={[rootX, 0.05, rootZ]} 
            rotation={[0.38, angle, 0]} 
            castShadow
          >
            <coneGeometry args={[0.065, 0.35, 5]} />
            <meshStandardMaterial color="#5c3815" roughness={0.95} />
          </mesh>
        );
      })}

      {/* --- Dynamic Wind-Responsive Trunk Group --- */}
      <group ref={trunkGroupRef}>
        
        {/* S-Curved Segmented Trunk */}
        {trunkSegments.map((segment, idx) => (
          <mesh 
            key={idx} 
            position={[segment.xPos, segment.yPos, 0]} 
            rotation={[0, 0, -segment.tilt]} 
            castShadow
          >
            <cylinderGeometry args={[0.07 * segment.scale, 0.1 * segment.scale, 0.26, 10]} />
            <meshStandardMaterial color="#8b4513" roughness={0.9} />
          </mesh>
        ))}

        {/* Crown Pivot (Aligned to the top of the curved trunk) */}
        <group position={[crownPivot.x, crownPivot.y, 0]} rotation={[0, 0, -crownPivot.tilt]}>
          
          {/* Dynamic Rustling Crown Group */}
          <group ref={crownRef}>
            
            {/* Coconuts nestled tightly under the crown */}
            <mesh position={[0.04, -0.1, 0.04]} castShadow>
              <sphereGeometry args={[0.075, 12, 12]} />
              <meshStandardMaterial color="#00ff3e" roughness={0.4} />
            </mesh>
            <mesh position={[-0.05, -0.09, -0.04]} castShadow>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="#00ff3e" roughness={0.4} />
            </mesh>

            {/* --- Open, Elegant Double-Layered Canopy --- */}
            
            {/* Layer 1: Upper Leaves */}
            {[...Array(4)].map((_, i) => {
              const yaw = (i / 4) * Math.PI * 2;
              const originalScale = 1.25;
              const copiedScale1 = originalScale * 0.6;
              const copiedScale2 = copiedScale1 * 0.5;

              return (
                <group key={`up-${i}`} rotation={[0, yaw, 0]}>
                  {/* Set 1: Original Leaf (^) - Curves Down */}
                  <group rotation={[0, 0, 0.1]}> 
                    <PinnateFrond color={leafColor} scale={originalScale} />
                  </group>
                  
                  {/* Set 2: Copied Leaf (v) - Rotated 300 deg, Curves Down */}
                  <group position={[0, 0.05, 0]} rotation={[0, COPIED_ROTATION_1, 0.1]}>
                    <PinnateFrond color={leafColor} scale={copiedScale1} />
                  </group>

                  {/* Set 3: New Copied Leaf (v) - 50% of Set 2, Curves UP (Facing Sun) */}
                  <group position={[0, 0.1, 0]} rotation={[0, COPIED_ROTATION_2, 0.1]}>
                    <PinnateFrond color={leafColor} scale={[copiedScale2, -copiedScale2, copiedScale2]} />
                  </group>
                </group>
              );
            })}

            {/* Layer 2: Lower Leaves */}
            {[...Array(4)].map((_, i) => {
              const yaw = (i / 4) * Math.PI * 2 + Math.PI / 4; 
              const originalScale = 1.35;
              const copiedScale1 = originalScale * 0.6;
              const copiedScale2 = copiedScale1 * 0.5;

              return (
                <group key={`low-${i}`} rotation={[0, yaw, 0]}>
                  {/* Set 1: Original Leaf (^) - Curves Down */}
                  <group rotation={[0, 0, -0.2]}> 
                    <PinnateFrond color={leafColor} scale={originalScale} />
                  </group>
                  
                  {/* Set 2: Copied Leaf (v) - Rotated 300 deg, Curves Down */}
                  <group position={[0, 0.05, 0]} rotation={[0, COPIED_ROTATION_1, -0.2]}>
                    <PinnateFrond color={leafColor} scale={copiedScale1} />
                  </group>

                  {/* Set 3: New Copied Leaf (v) - 50% of Set 2, Curves UP (Facing Sun) */}
                  <group position={[0, 0.1, 0]} rotation={[0, COPIED_ROTATION_2, -0.2]}>
                    <PinnateFrond color={leafColor} scale={[copiedScale2, -copiedScale2, copiedScale2]} />
                  </group>
                </group>
              );
            })}

          </group>
        </group>
      </group>

    </group>
  );
}