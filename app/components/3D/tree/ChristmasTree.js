"use client";

import { useMemo, useRef, useLayoutEffect } from "react";
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

// --- 2. Unified Procedural Pine Trunk, Branch & Needle Generator ---
function generateProceduralConifer(colorOverride) {
  const branchList = [];
  const leafList = [];

  const trunkHeight = 1.6; // Tall vertical central leader trunk

  // A. Seamless main trunk cylinder
  branchList.push({
    position: new THREE.Vector3(0, trunkHeight * 0.5, 0),
    quaternion: new THREE.Quaternion(),
    length: trunkHeight,
    radius: 0.08,
    depth: 6,
  });

  // B. Procedural Whorled Fir Branching (Conical layout)
  const whorlStep = 0.15;
  const startY = 0.3;
  const endY = 1.5;
  let level = 0;

  for (let y = startY; y <= endY; y += whorlStep) {
    level++;
    
    // Linearly decrease branch length with height to form a perfect cone
    const heightRatio = (trunkHeight - y) / trunkHeight;
    const maxBranchLength = heightRatio * 0.65; 
    
    // Number of horizontal branch arms per whorl level
    const branchCount = 6;

    for (let j = 0; j < branchCount; j++) {
      // Angular yaw offset for star-pattern distribution
      const yaw = (j / branchCount) * Math.PI * 2 + (level * 0.4); 
      
      // Slight upward tilt on the pine branches
      const branchDir = new THREE.Vector3(Math.cos(yaw), 0.15, Math.sin(yaw)).normalize();
      
      const startPos = new THREE.Vector3(0, y, 0);
      const endPos = startPos.clone().add(branchDir.clone().multiplyScalar(maxBranchLength));
      const midPoint = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
      
      const target = branchDir.clone();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), target);
      
      const branchRadius = 0.038 * heightRatio;

      branchList.push({
        position: midPoint,
        quaternion: quaternion,
        length: maxBranchLength,
        radius: branchRadius,
        depth: 2,
      });

      // C. Generate dense pine-needle clumps along each branch arm
      const needleClumpsCount = 12;
      for (let n = 0; n < needleClumpsCount; n++) {
        const t = 0.2 + (n / needleClumpsCount) * 0.8;
        const leafPos = startPos.clone().add(branchDir.clone().multiplyScalar(maxBranchLength * t));

        // Point needles outward with subtle organic deviation
        const normal = branchDir.clone().add(
          new THREE.Vector3(Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1)
        ).normalize();
        const leafQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

        // Dark evergreen pine color palette
        const coniferColors = ["#0f3d20", "#14532d", "#114726", "#1a5e34", "#0c3018"];
        const chosenColor = colorOverride || coniferColors[Math.floor(Math.random() * coniferColors.length)];

        // Enforce a safe minimum size near the top so foliage remains highly visible
        const needleScaleFactor = Math.max(0.35, heightRatio);

        // Scale parameters (600% thicker) to extend beyond branch cylinders
        const radiusX = 0.12 * needleScaleFactor;
        const radiusY = 0.26 * needleScaleFactor; // Elongated along the branch direction
        const radiusZ = 0.12 * needleScaleFactor;

        leafList.push({
          position: leafPos,
          quaternion: leafQuat,
          radiusX: radiusX,
          radiusY: radiusY,
          radiusZ: radiusZ,
          color: chosenColor,
        });
      }
    }
  }

  // D. Pointy Crown Leaves: Generate a dense pointed cluster of needles right at the very top (y = 1.6)
  const peakY = 1.6;
  const crownNeedleCount = 15;
  const coniferColors = ["#14532d", "#1a5e34", "#114726"];

  for (let c = 0; c < crownNeedleCount; c++) {
    const yaw = (c / crownNeedleCount) * Math.PI * 2;
    // Pitch angles oriented almost straight up (80 to 90 degrees) to form a sharp tip
    const pitch = (80 + Math.random() * 10) * (Math.PI / 180);
    
    const needleDir = new THREE.Vector3(
      Math.cos(yaw) * Math.cos(pitch),
      Math.sin(pitch),
      Math.sin(yaw) * Math.cos(pitch)
    ).normalize();
    
    const leafPos = new THREE.Vector3(0, peakY - 0.04 + Math.random() * 0.05, 0);
    const leafQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), needleDir);
    
    const chosenColor = colorOverride || coniferColors[Math.floor(Math.random() * coniferColors.length)];
    
    const radiusX = 0.05;
    const radiusY = 0.22;
    const radiusZ = 0.05;

    leafList.push({
      position: leafPos,
      quaternion: leafQuat,
      radiusX: radiusX,
      radiusY: radiusY,
      radiusZ: radiusZ,
      color: chosenColor,
    });
  }

  return { branches: branchList, leaves: leafList };
}

// --- 3. Reduced Sprawling Root Generator (Tighter cluster around trunk) ---
function generateProceduralRoots() {
  const rootList = [];

  const growRoot = (start, direction, length, radius, depth) => {
    if (depth === 0 || length < 0.02) return;

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

    let childrenCount = 3;
    if (depth === 5) childrenCount = 1;
    else if (depth === 4) childrenCount = 2;
    else childrenCount = 3;

    for (let i = 0; i < childrenCount; i++) {
      const angle = Math.random() * (40 - 18) * (Math.PI / 180) + (18 * Math.PI / 180);
      let newDir = rotateVector(dir, angle);

      newDir.y -= (Math.random() * 0.03 + 0.015); 
      newDir.x += Math.sign(newDir.x || (Math.random() - 0.5)) * 0.08; 
      newDir.z += Math.sign(newDir.z || (Math.random() - 0.5)) * 0.08;
      newDir.y = Math.min(-0.01, newDir.y);
      newDir.normalize();

      const newLength = length * (Math.random() * (0.82 - 0.65) + 0.65) * 1.2; 
      const newRadius = radius * (Math.random() * (0.78 - 0.62) + 0.62) * 0.5;

      const t = Math.random() * (0.95 - 0.65) + 0.65;
      const branchStart = start.clone().add(dir.clone().multiplyScalar(length * t));

      growRoot(branchStart, newDir, newLength, newRadius, depth - 1);
    }
  };

  // Straight down central root
  growRoot(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, -1, 0),
    0.4,
    0.07 * 0.5,
    3
  );

  // Angled surface spreading roots (steepened downward angle to 25 degrees)
  const angleUp65 = (65 * Math.PI) / 180; 
  const sin65 = Math.sin(angleUp65);
  const cos65 = Math.cos(angleUp65); // Generates more vertical depth down

  for (let i = 0; i < 4; i++) {
    const yaw = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const xDir = Math.cos(yaw) * sin65;
    const zDir = Math.sin(yaw) * sin65;
    const yDir = -cos65; // Angled steeper down

    const startDir = new THREE.Vector3(xDir, yDir, zDir).normalize();

    growRoot(
      new THREE.Vector3(0, 0, 0),
      startDir,
      0.35,              // Reduced initial root length (tighter horizontal spread)
      0.07 * 0.5 * 0.8,  // Adjusted root radius
      3                  // Reduced depth level
    );
  }

  return rootList;
}

// --- 4. Main Exported Component ---
export default function ChristmasTree({ color, windSpeed = 1.0 }) {
  const treeRef = useRef(null);
  const branchMeshRef = useRef(null);
  const leafMeshRef = useRef(null);
  const rootMeshRef = useRef(null);

  const needleShaderRef = useRef(null);

  const { branches, leaves } = useMemo(() => generateProceduralConifer(color), [color]);
  const roots = useMemo(() => generateProceduralRoots(), []);

  // Custom stiff needle material with tight high-frequency GPU wind ripple
  const customNeedleMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: "#ffffff", // Pure white base to keep instanceColor true
      roughness: 0.95,
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uWindSpeed = { value: windSpeed };
      needleShaderRef.current = shader;

      shader.vertexShader = `
        uniform float uTime;
        uniform float uWindSpeed;
      ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        #include <begin_vertex>
        
        // Stiff, tight conifer wave (high frequency, lower amplitude displacement)
        float waveX = sin(uTime * 5.8 * uWindSpeed + position.x * 16.0 + position.y * 8.0) * 0.04 * uWindSpeed;
        float waveZ = cos(uTime * 5.0 * uWindSpeed + position.z * 14.0) * 0.04 * uWindSpeed;
        float waveY = sin(uTime * 6.5 * uWindSpeed + position.y * 10.0) * 0.015 * uWindSpeed;

        transformed.x += waveX;
        transformed.y += waveY;
        transformed.z += waveZ;
        `
      );
    };

    return material;
  }, [windSpeed]);

  // Update instance matrices
  useLayoutEffect(() => {
    const tempObject = new THREE.Object3D();
    const tempColor = new THREE.Color();

    // 1. Branches
    if (branchMeshRef.current) {
      branches.forEach((branch, idx) => {
        tempObject.position.copy(branch.position);
        tempObject.quaternion.copy(branch.quaternion);
        tempObject.scale.set(branch.radius, branch.length, branch.radius);
        tempObject.updateMatrix();
        branchMeshRef.current.setMatrixAt(idx, tempObject.matrix);
      });
      branchMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. Needles (Highly elongated sphere ellipsoids)
    if (leafMeshRef.current) {
      leaves.forEach((leaf, idx) => {
        tempObject.position.copy(leaf.position);
        tempObject.quaternion.copy(leaf.quaternion);
        tempObject.scale.set(leaf.radiusX, leaf.radiusY, leaf.radiusZ);
        tempObject.updateMatrix();
        leafMeshRef.current.setMatrixAt(idx, tempObject.matrix);

        // Apply distinct forest green hues per instance
        tempColor.set(leaf.color);
        leafMeshRef.current.setColorAt(idx, tempColor);
      });
      leafMeshRef.current.instanceMatrix.needsUpdate = true;
      leafMeshRef.current.instanceColor.needsUpdate = true;
    }

    // 3. Roots
    if (rootMeshRef.current) {
      roots.forEach((root, idx) => {
        tempObject.position.copy(root.position);
        tempObject.quaternion.copy(root.quaternion);
        tempObject.scale.set(root.radius, root.length, root.radius);
        tempObject.updateMatrix();
        rootMeshRef.current.setMatrixAt(idx, tempObject.matrix);
      });
      rootMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [branches, leaves, roots]);

  // Frame animations
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // Conifer trunk sway
    if (treeRef.current) {
      const swayX = Math.sin(elapsed * 1.4 * windSpeed) * 0.012 * windSpeed;
      const swayZ = Math.cos(elapsed * 1.1 * windSpeed) * 0.012 * windSpeed;
      treeRef.current.rotation.x = swayX;
      treeRef.current.rotation.z = swayZ;
    }

    // Update needle flutter uniform
    if (needleShaderRef.current) {
      needleShaderRef.current.uniforms.uTime.value = elapsed;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      
      {/* Central Trunk Collar Ring */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.085, 0.085, 0.04, 12]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>

      {/* Roots System */}
      <instancedMesh 
        ref={rootMeshRef} 
        args={[null, null, roots.length]} 
        castShadow
      >
        <cylinderGeometry args={[0.72, 1, 1, 8]} />
        <meshStandardMaterial color="#2d1e16" roughness={0.95} />
      </instancedMesh>

      {/* Above Ground Structure */}
      <group ref={treeRef}>
        
        {/* Branches Structure */}
        <instancedMesh 
          ref={branchMeshRef} 
          args={[null, null, branches.length]} 
          castShadow
        >
          <cylinderGeometry args={[0.72, 1, 1, 8]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </instancedMesh>

        {/* Sphere Needles Canopy */}
        <instancedMesh 
          ref={leafMeshRef} 
          args={[null, null, leaves.length]} 
          material={customNeedleMaterial}
          castShadow
        >
          <sphereGeometry args={[1, 8, 8]} />
        </instancedMesh>

      </group>

    </group>
  );
}