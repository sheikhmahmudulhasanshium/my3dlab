"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- 1. Procedural Vector Math Helpers ---

function randomPerpendicular(v) {
  const a = new THREE.Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  ).normalize();
  const dot = a.dot(v);
  a.sub(v.clone().multiplyScalar(dot)).normalize();
  return a;
}

function rotateVector(direction, angle) {
  const axis = randomPerpendicular(direction);
  const dir = direction.clone().normalize();
  const ax = axis.clone().normalize();

  const term1 = dir.clone().multiplyScalar(Math.cos(angle));
  const cross = new THREE.Vector3().crossVectors(ax, dir);
  const term2 = cross.multiplyScalar(Math.sin(angle));
  const term3 = ax.clone().multiplyScalar(ax.dot(dir) * (1 - Math.cos(angle)));

  return new THREE.Vector3()
    .addVectors(term1, term2)
    .add(term3)
    .normalize();
}

// --- 2. Above-Ground Branch Generator ---
function generateProceduralBranches() {
  const branchList = [];

  const growBranch = (start, direction, length, radius, depth) => {
    if (depth === 0 || length < 0.05) return;

    const randAngle = Math.random() * 0.36 - 0.18;
    const dir = rotateVector(direction, randAngle);

    const end = start.clone().add(dir.clone().multiplyScalar(length));

    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dirVec = new THREE.Vector3().subVectors(end, start);
    const len = dirVec.length();
    
    const up = new THREE.Vector3(0, 1, 0);
    const target = dirVec.clone().normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, target);

    branchList.push({
      position: midPoint,
      quaternion: quaternion,
      length: len,
      radius: radius,
    });

    const choices = [2, 2, 2, 3];
    const childrenCount = choices[Math.floor(Math.random() * choices.length)];

    for (let i = 0; i < childrenCount; i++) {
      const angle = Math.random() * (42 - 18) * (Math.PI / 180) + (18 * Math.PI / 180);
      let newDir = rotateVector(dir, angle);

      newDir.y += (Math.random() * 0.2 + 0.05); // Upward bias
      newDir.normalize();

      const newLength = length * (Math.random() * (0.82 - 0.65) + 0.65);
      const newRadius = radius * (Math.random() * (0.78 - 0.62) + 0.62);

      const t = Math.random() * (0.95 - 0.65) + 0.65;
      const branchStart = start.clone().add(dir.clone().multiplyScalar(length * t));

      growBranch(branchStart, newDir, newLength, newRadius, depth - 1);
    }
  };

  // Main upward trunk
  growBranch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 1.15, 0.07, 5);

  // Extra Base Branch (Adds 3D multi-trunk depth)
  growBranch(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-0.35, 0.9, 0.15).normalize(),
    0.9,
    0.055,
    4
  );

  return branchList;
}

// --- 3. Below-Ground Root Generator (Friction Clamped to stay underground) ---
function generateProceduralRoots() {
  const rootList = [];

  const growRoot = (start, direction, length, radius, depth) => {
    if (depth === 0 || length < 0.02) return;

    // Rule 6: Curvature (Smooth meandering curve using a wider random angle)
    const randAngle = Math.random() * 0.5 - 0.25; 
    const dir = rotateVector(direction, randAngle);

    const end = start.clone().add(dir.clone().multiplyScalar(length));

    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dirVec = new THREE.Vector3().subVectors(end, start);
    const len = dirVec.length();
    
    const up = new THREE.Vector3(0, 1, 0);
    const target = dirVec.clone().normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, target);

    rootList.push({
      position: midPoint,
      quaternion: quaternion,
      length: len,
      radius: radius,
    });

    // Rule 5: Architectural Density (Fewer branches near the trunk, more farther away)
    let childrenCount = 3;
    if (depth === 5) childrenCount = 1;      // No split directly at the trunk base (Y = 0)
    else if (depth === 4) childrenCount = 2; // Primary splitting close to trunk
    else childrenCount = 3;                  // High-density splits at outer root tips

    for (let i = 0; i < childrenCount; i++) {
      const angle = Math.random() * (40 - 18) * (Math.PI / 180) + (18 * Math.PI / 180);
      let newDir = rotateVector(dir, angle);

      // Rule 4: Direction (Downward -Y growth with horizontal crawl)
      newDir.y -= (Math.random() * 0.03 + 0.015); 
      newDir.x += Math.sign(newDir.x || (Math.random() - 0.5)) * 0.08; // Outward X push
      newDir.z += Math.sign(newDir.z || (Math.random() - 0.5)) * 0.08; // Outward Z push

      // Crucial Fix: Force Y to be strictly negative (downwards) so roots never penetrate ground upwards
      newDir.y = Math.min(-0.01, newDir.y);

      newDir.normalize();

      // Rule 1: Length (Roots are at least 20% longer than equivalent branches)
      const newLength = length * (Math.random() * (0.82 - 0.65) + 0.65) * 1.2; 
      
      // Rule 2: Width (Roots are at least 50% thinner than equivalent branches)
      const newRadius = radius * (Math.random() * (0.78 - 0.62) + 0.62) * 0.5;

      const t = Math.random() * (0.95 - 0.65) + 0.65;
      const branchStart = start.clone().add(dir.clone().multiplyScalar(length * t));

      growRoot(branchStart, newDir, newLength, newRadius, depth - 1);
    }
  };

  // A. Deep Center Anchor Root (直下/Straight Down - 20% longer, 50% thinner)
  growRoot(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, -1, 0),
    1.15 * 1.2,  // Base Length
    0.07 * 0.5,   // Base Radius
    5
  );

  // B. 4 Surface Roots (Angled at exactly -5 degrees in the ground relative to the horizontal plane)
  const angleUp85 = (85 * Math.PI) / 180; // 85 degrees upward from vertical = 5 degrees downward from horizontal
  const sin85 = Math.sin(angleUp85); // Horizontal push: 0.996
  const cos85 = Math.cos(angleUp85); // Vertical depth: 0.087

  for (let i = 0; i < 4; i++) {
    const yaw = (i / 4) * Math.PI * 2 + Math.PI / 4; // Diagonal distribution
    const xDir = Math.cos(yaw) * sin85;
    const zDir = Math.sin(yaw) * sin85;
    const yDir = -cos85; // Angled -5 degrees downward relative to ground level

    const startDir = new THREE.Vector3(xDir, yDir, zDir).normalize();

    growRoot(
      new THREE.Vector3(0, 0, 0),
      startDir,
      1.15 * 1.2 * 0.85, // 20% longer scaling applied
      0.07 * 0.5 * 1.0,  // 50% thinner scaling applied
      4
    );
  }

  return rootList;
}

// --- 4. Main Exported Component ---
export default function MangoTree({ color, windSpeed = 1.0 }) {
  const treeRef = useRef(null);

  // Generate the above-ground branch skeleton
  const branches = useMemo(() => generateProceduralBranches(), []);

  // Generate the below-ground root skeleton
  const roots = useMemo(() => generateProceduralRoots(), []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // Natural wind-responsive sway applied to the upper branch skeleton
    if (treeRef.current) {
      const swayX = Math.sin(elapsed * 1.3 * windSpeed) * 0.015 * windSpeed;
      const swayZ = Math.cos(elapsed * 1.0 * windSpeed) * 0.015 * windSpeed;
      treeRef.current.rotation.x = swayX;
      treeRef.current.rotation.z = swayZ;
    }
  });

  return (
    // Elevated by 20% to make roots fully visible above ground
    <group position={[0, -0.4, 0]}>
      
      {/* --- Central Trunk Collar Ring (Anchors origin) --- */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.04, 12]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.9} />
      </mesh>

      {/* --- "Below": Static, Procedurally Grown Root Web (Strictly Follows 6-Rules) --- */}
      <group>
        {roots.map((root, idx) => (
          <mesh 
            key={`root-${idx}`} 
            position={root.position} 
            quaternion={root.quaternion}
            castShadow
          >
            <cylinderGeometry args={[root.radius * 0.72, root.radius, root.length, 8]} />
            <meshStandardMaterial color="#3d2511" roughness={0.95} /> {/* Darker earthy root bark */}
          </mesh>
        ))}
      </group>

      {/* --- "Above": Dynamic, Wind-Responsive Procedural Branch Skeleton --- */}
      <group ref={treeRef}>
        {branches.map((branch, idx) => (
          <mesh 
            key={`branch-${idx}`} 
            position={branch.position} 
            quaternion={branch.quaternion}
            castShadow
          >
            <cylinderGeometry args={[branch.radius * 0.72, branch.radius, branch.length, 8]} />
            <meshStandardMaterial color="#5c3a21" roughness={0.9} />
          </mesh>
        ))}
      </group>

    </group>
  );
}