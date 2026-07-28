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

// --- 2. Procedural Oak Branch & Leaf Generator ---
function generateProceduralOakTree() {
  const branchList = [];
  const leafList = [];
  const GOLDEN_ANGLE = 137.5 * (Math.PI / 180);

  const trunkHeight = 1.0; // Sturdy, lower trunk characteristic of Oak trees

  // A. Thick continuous main trunk segment (smooth taper)
  branchList.push({
    position: new THREE.Vector3(0, trunkHeight * 0.5, 0),
    quaternion: new THREE.Quaternion(),
    length: trunkHeight,
    radius: 0.13, // Significantly thicker than Mango tree
    depth: 6,
  });

  // B. Winding Oak Branch Growth
  const growBranch = (start, direction, length, radius, depth) => {
    if (depth === 0 || length < 0.04) return;

    // Wider random deflection for rugged, winding oak limbs
    const randAngle = Math.random() * 0.46 - 0.23;
    const dir = rotateVector(direction, randAngle);

    const end = start.clone().add(dir.clone().multiplyScalar(length));
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dirVec = new THREE.Vector3().subVectors(end, start);
    const len = dirVec.length();
    
    const up = new THREE.Vector3(0, 1, 0);
    const target = dirVec.clone().normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, target);

    const currentBranch = {
      position: midPoint,
      quaternion: quaternion,
      length: len,
      radius: radius,
      depth: depth,
    };

    branchList.push(currentBranch);

    const choices = [3, 3, 3, 4];
    const childrenCount = choices[Math.floor(Math.random() * choices.length)];

    for (let i = 0; i < childrenCount; i++) {
      // Wider splitting angles for horizontal sprawling canopy
      const angle = Math.random() * (55 - 25) * (Math.PI / 180) + (25 * Math.PI / 180);
      let newDir = rotateVector(dir, angle);

      newDir.y += (Math.random() * 0.12 + 0.02); // Moderate upward bias (broader shape)
      newDir.normalize();

      const newLength = length * (Math.random() * (0.86 - 0.72) + 0.72);
      const newRadius = radius * (Math.random() * (0.80 - 0.65) + 0.65); // Branches stay thicker

      const t = Math.random() * (0.95 - 0.65) + 0.65;
      const branchStart = start.clone().add(dir.clone().multiplyScalar(length * t));

      growBranch(branchStart, newDir, newLength, newRadius, depth - 1);
    }
  };

  // Start five major scaffold limbs to distribute a wide, dense dome canopy
  const branchingOrigin = new THREE.Vector3(0, trunkHeight, 0);
  growBranch(branchingOrigin, new THREE.Vector3(0, 1, 0), 1.25, 0.09, 6);
  growBranch(branchingOrigin, new THREE.Vector3(-0.45, 0.8, 0.25).normalize(), 1.1, 0.075, 5);
  growBranch(branchingOrigin, new THREE.Vector3(0.45, 0.78, -0.25).normalize(), 1.1, 0.075, 5);
  growBranch(branchingOrigin, new THREE.Vector3(-0.2, 0.78, -0.45).normalize(), 1.05, 0.07, 5);
  growBranch(branchingOrigin, new THREE.Vector3(0.2, 0.75, 0.45).normalize(), 1.05, 0.07, 5);

  // Generate Oak Foliage
  branchList.forEach((b) => {
    if (b.depth > 2) return;

    const start = b.position.clone().sub(
      new THREE.Vector3(0, b.length / 2, 0).applyQuaternion(b.quaternion)
    );
    const end = b.position.clone().add(
      new THREE.Vector3(0, b.length / 2, 0).applyQuaternion(b.quaternion)
    );
    const dir = new THREE.Vector3().subVectors(end, start).normalize();

    const baseCount = b.depth === 1 ? 20 : 8;
    const leafCount = Math.floor(baseCount + Math.random() * 6);

    for (let i = 0; i < leafCount; i++) {
      const t = 0.35 + Math.pow(Math.random(), 1.5) * 0.6; 
      const pos = start.clone().add(dir.clone().multiplyScalar(b.length * t));

      const spiralAngle = i * GOLDEN_ANGLE;
      const perp = randomPerpendicular(dir);
      const leafOffset = perp.clone().applyAxisAngle(dir, spiralAngle).normalize().multiplyScalar(0.025);
      const leafPos = pos.clone().add(leafOffset);

      const outward = leafPos.clone().setY(0).normalize();
      const normal = new THREE.Vector3(outward.x * 0.4, 0.8, outward.z * 0.4).normalize();

      const droopAngle = (Math.random() * (18 - 5) + 5) * (Math.PI / 180);
      normal.y -= Math.sin(droopAngle);
      normal.normalize();

      const heightFactor = Math.max(0.5, 1.3 - leafPos.y * 0.3);
      
      const leafRadius = (Math.random() * (0.04 - 0.02) + 0.02) * heightFactor * 4.0; 
      const leafLength = (Math.random() * (0.09 - 0.05) + 0.05) * heightFactor * 2.0;

      const defaultNormal = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultNormal, normal);

      const rollAngle = (Math.random() * 30 - 15) * (Math.PI / 180);
      const rollQuaternion = new THREE.Quaternion().setFromAxisAngle(normal, rollAngle);
      quaternion.premultiply(rollQuaternion);

      leafList.push({
        position: leafPos,
        quaternion: quaternion,
        radiusX: leafRadius,
        radiusY: leafLength,
        radiusZ: leafRadius,
      });
    }
  });

  return { branches: branchList, leaves: leafList };
}

// --- 3. Thick Gnarly Root Generator ---
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

  growRoot(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, -1, 0),
    0.4,
    0.08 * 0.5,
    3
  );

  const angleUp85 = (85 * Math.PI) / 180; 
  const sin85 = Math.sin(angleUp85);
  const cos85 = Math.cos(angleUp85);

  for (let i = 0; i < 4; i++) {
    const yaw = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const xDir = Math.cos(yaw) * sin85;
    const zDir = Math.sin(yaw) * sin85;
    const yDir = -cos85;

    const startDir = new THREE.Vector3(xDir, yDir, zDir).normalize();

    growRoot(
      new THREE.Vector3(0, 0, 0),
      startDir,
      1.1 * 1.2 * 0.85, 
      0.08 * 0.5 * 1.1,  // Wider root collar
      4
    );
  }

  return rootList;
}

// --- 4. Main Exported Component ---
export default function OakTree({ color, windSpeed = 1.0 }) {
  const treeRef = useRef(null);
  const branchMeshRef = useRef(null);
  const leafMeshRef = useRef(null);
  const rootMeshRef = useRef(null);

  const leafColor = color || "#1b4332";
  const leafShaderRef = useRef(null);

  const { branches, leaves } = useMemo(() => generateProceduralOakTree(), []);
  const roots = useMemo(() => generateProceduralRoots(), []);

  // Custom leaf material with GPU vertex displacement for secondary wind flutter
  const customLeafMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: leafColor,
      roughness: 0.85,
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uWindSpeed = { value: windSpeed };
      leafShaderRef.current = shader;

      shader.vertexShader = `
        uniform float uTime;
        uniform float uWindSpeed;
      ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        #include <begin_vertex>
        
        // GPU vertex wave based on individual leaf geometry coordinates
        float waveX = sin(uTime * 4.0 * uWindSpeed + position.x * 10.0 + position.y * 5.0) * 0.07 * uWindSpeed;
        float waveZ = cos(uTime * 3.5 * uWindSpeed + position.z * 8.0) * 0.07 * uWindSpeed;
        float waveY = sin(uTime * 4.5 * uWindSpeed + position.y * 6.0) * 0.02 * uWindSpeed;

        transformed.x += waveX;
        transformed.y += waveY;
        transformed.z += waveZ;
        `
      );
    };

    return material;
  }, [leafColor, windSpeed]);

  // Update instance matrices
  useLayoutEffect(() => {
    const tempObject = new THREE.Object3D();

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

    // 2. Spherical Leaves
    if (leafMeshRef.current) {
      leaves.forEach((leaf, idx) => {
        tempObject.position.copy(leaf.position);
        tempObject.quaternion.copy(leaf.quaternion);
        tempObject.scale.set(leaf.radiusX, leaf.radiusY, leaf.radiusZ);
        tempObject.updateMatrix();
        leafMeshRef.current.setMatrixAt(idx, tempObject.matrix);
      });
      leafMeshRef.current.instanceMatrix.needsUpdate = true;
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

    // Structural trunk sway
    if (treeRef.current) {
      const swayX = Math.sin(elapsed * 1.5 * windSpeed) * 0.012 * windSpeed;
      const swayZ = Math.cos(elapsed * 1.1 * windSpeed) * 0.012 * windSpeed;
      treeRef.current.rotation.x = swayX;
      treeRef.current.rotation.z = swayZ;
    }

    // Push elapsed time to leaf shader
    if (leafShaderRef.current) {
      leafShaderRef.current.uniforms.uTime.value = elapsed;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      
      {/* Central Trunk Collar Ring */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.135, 0.135, 0.04, 12]} />
        <meshStandardMaterial color="#3e2723" roughness={0.95} />
      </mesh>

      {/* Roots System */}
      <instancedMesh 
        ref={rootMeshRef} 
        args={[null, null, roots.length]} 
        castShadow
      >
        <cylinderGeometry args={[0.72, 1, 1, 8]} />
        <meshStandardMaterial color="#2d1a12" roughness={0.95} />
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
          <meshStandardMaterial color="#3e2723" roughness={0.95} />
        </instancedMesh>

        {/* Sphere Leaf Structure with GPU Wind Flutter */}
        <instancedMesh 
          ref={leafMeshRef} 
          args={[null, null, leaves.length]} 
          material={customLeafMaterial}
          castShadow
        >
          <sphereGeometry args={[1, 8, 8]} />
        </instancedMesh>

      </group>

    </group>
  );
}