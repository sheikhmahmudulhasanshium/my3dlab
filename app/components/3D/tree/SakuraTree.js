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

// --- 2. Unified Procedural Sakura Branch & Blossom Generator ---
function generateProceduralSakuraTree(colorOverride) {
  const branchList = [];
  const leafList = [];
  const GOLDEN_ANGLE = 137.5 * (Math.PI / 180);

  const trunkHeight = 1.2;

  // A. Slender seamless lower trunk segment
  branchList.push({
    position: new THREE.Vector3(0, trunkHeight * 0.5, 0),
    quaternion: new THREE.Quaternion(),
    length: trunkHeight,
    radius: 0.08,
    depth: 6,
  });

  // B. Elegant Sakura Branch Generation
  const growBranch = (start, direction, length, radius, depth) => {
    if (depth === 0 || length < 0.04) return;

    const randAngle = Math.random() * 0.38 - 0.19;
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
      const angle = Math.random() * (45 - 20) * (Math.PI / 180) + (20 * Math.PI / 180);
      let newDir = rotateVector(dir, angle);

      newDir.y += (Math.random() * 0.18 + 0.04);
      newDir.normalize();

      const newLength = length * (Math.random() * (0.88 - 0.75) + 0.75);
      const newRadius = radius * (Math.random() * (0.78 - 0.62) + 0.62);

      const t = Math.random() * (0.95 - 0.65) + 0.65;
      const branchStart = start.clone().add(dir.clone().multiplyScalar(length * t));

      growBranch(branchStart, newDir, newLength, newRadius, depth - 1);
    }
  };

  const branchingOrigin = new THREE.Vector3(0, trunkHeight, 0);
  growBranch(branchingOrigin, new THREE.Vector3(0, 1, 0), 1.4, 0.065, 6);
  growBranch(branchingOrigin, new THREE.Vector3(-0.35, 0.88, 0.18).normalize(), 1.15, 0.05, 5);
  growBranch(branchingOrigin, new THREE.Vector3(0.35, 0.85, -0.22).normalize(), 1.1, 0.045, 5);
  growBranch(branchingOrigin, new THREE.Vector3(-0.15, 0.82, -0.38).normalize(), 1.05, 0.04, 5);

  // Split palettes
  const whiteTones = ["#ffffff", "#fffdfd", "#fff5f5", "#fff0f0"];
  const pinkTones = ["#fda4af", "#fecdd3", "#fae8ff"];

  // Generate Blossoms
  branchList.forEach((b) => {
    if (b.depth > 2) return;

    const start = b.position.clone().sub(
      new THREE.Vector3(0, b.length / 2, 0).applyQuaternion(b.quaternion)
    );
    const end = b.position.clone().add(
      new THREE.Vector3(0, b.length / 2, 0).applyQuaternion(b.quaternion)
    );
    const dir = new THREE.Vector3().subVectors(end, start).normalize();

    const baseCount = b.depth === 1 ? 22 : 10;
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

      const droopAngle = (Math.random() * (22 - 5) + 5) * (Math.PI / 180);
      normal.y -= Math.sin(droopAngle);
      normal.normalize();

      const heightFactor = Math.max(0.5, 1.3 - leafPos.y * 0.3);
      
      const leafRadius = (Math.random() * (0.04 - 0.02) + 0.02) * heightFactor * 4.0; 
      const leafLength = (Math.random() * (0.10 - 0.05) + 0.05) * heightFactor * 2.0;

      const defaultNormal = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultNormal, normal);

      const rollAngle = (Math.random() * 30 - 15) * (Math.PI / 180);
      const rollQuaternion = new THREE.Quaternion().setFromAxisAngle(normal, rollAngle);
      quaternion.premultiply(rollQuaternion);

      // 80% pink tones, 20% white tones
      const isPink = Math.random() < 0.80;
      const chosenColor = colorOverride || (isPink
        ? pinkTones[Math.floor(Math.random() * pinkTones.length)]
        : whiteTones[Math.floor(Math.random() * whiteTones.length)]);

      leafList.push({
        position: leafPos,
        quaternion: quaternion,
        radiusX: leafRadius,
        radiusY: leafLength,
        radiusZ: leafRadius,
        color: chosenColor,
      });
    }
  });

  return { branches: branchList, leaves: leafList };
}

// --- 3. Root Generator ---
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
    0.45,
    0.07 * 0.5,
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
      1.15 * 1.2 * 0.85, 
      0.07 * 0.5 * 1.0,  
      4
    );
  }

  return rootList;
}

// --- 4. Main Exported Component ---
export default function SakuraTree({ color, windSpeed = 1.0 }) {
  const treeRef = useRef(null);
  const branchMeshRef = useRef(null);
  const leafMeshRef = useRef(null);
  const rootMeshRef = useRef(null);

  const blossomShaderRef = useRef(null);

  const { branches, leaves } = useMemo(() => generateProceduralSakuraTree(color), [color]);
  const roots = useMemo(() => generateProceduralRoots(), []);

  // Custom blossom material
  const customBlossomMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.9,
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uWindSpeed = { value: windSpeed };
      blossomShaderRef.current = shader;

      shader.vertexShader = `
        uniform float uTime;
        uniform float uWindSpeed;
      ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        #include <begin_vertex>
        
        float waveX = sin(uTime * 5.0 * uWindSpeed + position.x * 14.0 + position.y * 7.0) * 0.09 * uWindSpeed;
        float waveZ = cos(uTime * 4.2 * uWindSpeed + position.z * 11.0) * 0.09 * uWindSpeed;
        float waveY = sin(uTime * 5.5 * uWindSpeed + position.y * 9.0) * 0.04 * uWindSpeed;

        transformed.x += waveX;
        transformed.y += waveY;
        transformed.z += waveZ;
        `
      );
    };

    return material;
  }, [windSpeed]);

  // Update instance matrices and blossom colors on mount
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

    // 2. Spherical Blossom Clumps (Mixed pink and white colors)
    if (leafMeshRef.current) {
      leaves.forEach((leaf, idx) => {
        tempObject.position.copy(leaf.position);
        tempObject.quaternion.copy(leaf.quaternion);
        tempObject.scale.set(leaf.radiusX, leaf.radiusY, leaf.radiusZ);
        tempObject.updateMatrix();
        leafMeshRef.current.setMatrixAt(idx, tempObject.matrix);
        
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

    // Structural branches sway
    if (treeRef.current) {
      const swayX = Math.sin(elapsed * 1.3 * windSpeed) * 0.015 * windSpeed;
      const swayZ = Math.cos(elapsed * 1.0 * windSpeed) * 0.015 * windSpeed;
      treeRef.current.rotation.x = swayX;
      treeRef.current.rotation.z = swayZ;
    }

    // Update blossom wind wave uniform
    if (blossomShaderRef.current) {
      blossomShaderRef.current.uniforms.uTime.value = elapsed;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      
      {/* Central Trunk Collar Ring */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.085, 0.085, 0.04, 12]} />
        <meshStandardMaterial color="#2d1500" roughness={0.9} />
      </mesh>

      {/* Roots System */}
      <instancedMesh 
        ref={rootMeshRef} 
        args={[null, null, roots.length]} 
        castShadow
      >
        <cylinderGeometry args={[0.72, 1, 1, 8]} />
        <meshStandardMaterial color="#1a0c00" roughness={0.95} />
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
          <meshStandardMaterial color="#2d1500" roughness={0.9} />
        </instancedMesh>

        {/* Sphere Blossom Canopy */}
        <instancedMesh 
          ref={leafMeshRef} 
          args={[null, null, leaves.length]} 
          material={customBlossomMaterial}
          castShadow
        >
          <sphereGeometry args={[1, 8, 8]} />
        </instancedMesh>

      </group>

    </group>
  );
}