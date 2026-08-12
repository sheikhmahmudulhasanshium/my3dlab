/**
 *
 *                    SUV EXHAUST — DUAL OUTLET SYSTEM
 *
 *   ENGINE
 *     │
 *     ▼
 *   (Engine Manifold)
 *        ╲
 *         ╲
 *          ╲______[ CATALYTIC CONVERTER ]______[ RESONATOR ]______
 *                                                               │
 *                                                               ▼
 *                                                        [  MUFFLER  ]
 *                                                               │
 *                                                        [  SPLITTER ]
 *                                                           ╱       ╲
 *                                                          ╱         ╲
 *                                                         ▼           ▼
 *                                                   [ Tailpipe ] [ Tailpipe ]
 *                                                        │           │
 *                                                   [Chrome]     [Chrome]
 *                                                     Tip          Tip
 *                                                        │           │
 *                                                        ▼           ▼
 *                                                     ,, ,        ,, ,
 *                                                    '  ,        '  ,
 *                                                  (Vapor)      (Vapor)
 *
 *   ═══════════════════════════════════════════════════════════════════════►
 *                           EXHAUST FLOW
 *
 *   Components:
 *   ──────────
 *   Engine Manifold → Catalytic Converter → Resonator → Muffler
 *                   → Splitter → Tailpipes → Chrome Tips
 *
 */
"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SUV_CONFIG } from "./suv_config";

// Seeded random number generator for consistent particle offsets
function createSeededRandom(seed = 12345) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generates a soft, multi-lobed organic vapor texture dynamically
function createMultiLobedSmokeTexture() {
  if (typeof window === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, 256, 256);

  const lobes = [
    { x: 128, y: 128, r: 65, intensity: 1.0 },
    { x: 98,  y: 138, r: 48, intensity: 0.8 },
    { x: 158, y: 118, r: 52, intensity: 0.85 },
    { x: 120, y: 92,  r: 42, intensity: 0.72 },
    { x: 78,  y: 130, r: 35, intensity: 0.48 },
    { x: 178, y: 132, r: 38, intensity: 0.52 },
  ];

  lobes.forEach((lobe) => {
    const grad = ctx.createRadialGradient(lobe.x, lobe.y, 0, lobe.x, lobe.y, lobe.r);
    grad.addColorStop(0.0, `rgba(255, 255, 255, ${lobe.intensity})`);
    grad.addColorStop(0.2, `rgba(255, 255, 255, ${lobe.intensity * 0.85})`);
    grad.addColorStop(0.5, `rgba(255, 255, 255, ${lobe.intensity * 0.4})`);
    grad.addColorStop(0.8, `rgba(255, 255, 255, ${lobe.intensity * 0.08})`);
    grad.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lobe.x, lobe.y, lobe.r, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// Module-level cache to keep rendering idempotent across redraws
let cachedSmokeTexture = null;

function getSmokeTexture() {
  if (typeof window === "undefined") return null;
  if (!cachedSmokeTexture) {
    cachedSmokeTexture = createMultiLobedSmokeTexture();
  }
  return cachedSmokeTexture;
}

export default function Exhaust({ engineOn = true, materials = {} }) {
  const meshRef = useRef(null);
  const shaderRef = useRef(null);

  const totalPuffs = 24; // 12 left, 12 right
  const lifetime = 1.8;  // Duration of individual puff cycle in seconds

  const smokeTexture = useMemo(() => getSmokeTexture(), []);

  // Material settings for exhaust soot/water vapor
  const materialConfig = useMemo(() => {
    return {
      color: new THREE.Color("#cbd5e1"), // Soft light gray steam
      transparent: true,
      depthWrite: false,
      depthTest: true,
      alphaTest: 0.001,
      map: smokeTexture || undefined,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
      toneMapped: true,
    };
  }, [smokeTexture]);

  // Generates staggered properties for both left and right exit paths
  const puffsConfig = useMemo(() => {
    const list = [];
    const random = createSeededRandom(98765);
    
    for (let i = 0; i < totalPuffs; i++) {
      const isRightSide = i % 2 === 0;
      const streamIndex = Math.floor(i / 2);
      
      list.push({
        index: i,
        isRight: isRightSide,
        delay: (streamIndex / 12) * lifetime, // Linearly staggered per side
        speed: 0.75 + random() * 0.25,
        maxScale: 0.38 + random() * 0.22,
        dispersionX: 0.05 + random() * 0.25, // Moves outwards away from vehicle center
        riseY: 0.15 + random() * 0.25,
        driftZ: 1.5 + random() * 0.8,
        rotationSpeed: (random() - 0.5) * 1.8,
        baseOpacity: 0.12 + random() * 0.10,
      });
    }
    return list;
  }, [totalPuffs]);

  const opacities = useMemo(() => new Float32Array(totalPuffs), [totalPuffs]);
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  // Set up robust default fallback materials if the parent doesn't provide them
  const fallbackMaterials = useMemo(() => {
    return {
      hotMetal: materials.chassisMetal || new THREE.MeshStandardMaterial({
        color: "#334155",
        roughness: 0.6,
        metalness: 0.7,
      }),
      silverMetallic: materials.silverMetallic || new THREE.MeshStandardMaterial({
        color: "#cbd5e1",
        roughness: 0.25,
        metalness: 0.8,
      }),
      chromeTip: new THREE.MeshStandardMaterial({
        color: "#f8fafc",
        roughness: 0.05,
        metalness: 0.95,
      }),
    };
  }, [materials]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const elapsed = state.clock.getElapsedTime();
    const cameraRotation = state.camera.quaternion;

    puffsConfig.forEach((p) => {
      if (!engineOn) {
        opacities[p.index] = 0;
        tempObject.position.set(0, -100, 0); // Hide off-screen
        tempObject.scale.set(0, 0, 0);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(p.index, tempObject.matrix);
        return;
      }

      const progress = (elapsed * p.speed + p.delay) % lifetime;
      const t = progress / lifetime; // Normalized 0.0 -> 1.0

      // Coordinates corresponding to left/right chrome tips
      const exitX = p.isRight ? 0.42 : -0.42;
      const exitY = 0.34;
      const exitZ = -1.28;

      const sideSign = p.isRight ? 1 : -1;

      // Disperses outwards laterally, drifts back, and rises slightly
      const curZ = exitZ - (t * p.driftZ);
      const curY = exitY + (t * p.riseY) + Math.sin(t * 4 + p.index) * 0.03;
      const curX = exitX + (t * p.dispersionX * sideSign) + Math.cos(t * 3 + p.index) * 0.02;

      tempObject.position.set(curX, curY, curZ);

      // Align plane billboard-style to face camera
      tempObject.quaternion.copy(cameraRotation);

      // Spin the texture coordinate dynamically
      const localRoll = p.rotationSpeed * elapsed * 0.12;
      tempObject.rotateZ(localRoll);

      // Scale expansion
      const size = t * p.maxScale + 0.05;
      tempObject.scale.set(size, size, size);
      tempObject.updateMatrix();

      meshRef.current.setMatrixAt(p.index, tempObject.matrix);

      // Dynamic opacity ramp-up and gradual dissipation
      let calculatedOpacity = p.baseOpacity;
      if (t < 0.12) {
        calculatedOpacity *= (t / 0.12);
      } else {
        calculatedOpacity *= (1.0 - t);
      }
      opacities[p.index] = calculatedOpacity;
    });

    meshRef.current.instanceMatrix.needsUpdate = true;

    if (meshRef.current.geometry.attributes.aOpacity) {
      meshRef.current.geometry.attributes.aOpacity.needsUpdate = true;
    }

    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = elapsed;
    }
  });

  // Material modifier injecting custom vertex boiling-displacement code
  const customMaterial = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial(materialConfig);
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uBillowSpeed = { value: 1.2 };
      shader.uniforms.uBillowScale = { value: 0.45 };
      shaderRef.current = shader;

      shader.vertexShader = `
        uniform float uTime;
        uniform float uBillowSpeed;
        uniform float uBillowScale;
        attribute float aOpacity;
        varying float vOpacity;
      ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        #include <begin_vertex>
        vOpacity = aOpacity;
        
        // Simulates dynamic thermal turbulence within the vapor puffs
        float wave = sin(uTime * uBillowSpeed + position.x * 4.0 + position.y * 3.0) * 0.1 * uBillowScale;
        float waveY = cos(uTime * 0.9 * uBillowSpeed + position.y * 3.5) * 0.1 * uBillowScale;
        transformed.x += wave;
        transformed.y += waveY;
        `
      );

      shader.fragmentShader = `
        varying float vOpacity;
      ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        "vec4 diffuseColor = vec4( diffuse, opacity );",
        `
        vec4 diffuseColor = vec4( diffuse, vOpacity );
        `
      );
    };
    return mat;
  }, [materialConfig]);

  return (
    <group>
      {/* ================= 1. FRONT DOWNPIPES & MOUNT FLANGES ================= */}
      <group position={[-0.20, 0.54, 1.32]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 6]} />
          <primitive object={fallbackMaterials.hotMetal} attach="material" />
        </mesh>
        <mesh position={[0.04, -0.10, -0.12]} rotation={[0.4, 0, -0.2]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.26, 8]} />
          <primitive object={fallbackMaterials.hotMetal} attach="material" />
        </mesh>
      </group>

      <group position={[0.20, 0.54, 1.32]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 6]} />
          <primitive object={fallbackMaterials.hotMetal} attach="material" />
        </mesh>
        <mesh position={[-0.04, -0.10, -0.12]} rotation={[0.4, 0, 0.2]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.26, 8]} />
          <primitive object={fallbackMaterials.hotMetal} attach="material" />
        </mesh>
      </group>

      {/* Front Y-Pipe Collector */}
      <group position={[0, 0.38, 1.05]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.032, 0.032, 0.16, 8]} />
          <primitive object={fallbackMaterials.hotMetal} attach="material" />
        </mesh>
        <mesh position={[-0.08, 0.02, 0.06]} rotation={[0, -0.5, 0.3]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
          <primitive object={fallbackMaterials.hotMetal} attach="material" />
        </mesh>
        <mesh position={[0.08, 0.02, 0.06]} rotation={[0, 0.5, -0.3]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
          <primitive object={fallbackMaterials.hotMetal} attach="material" />
        </mesh>
      </group>

      {/* ================= 2. CATALYTIC CONVERTER ================= */}
      <group position={[-0.14, 0.36, 0.85]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.15, 0.08, 0.24]} />
          <primitive object={fallbackMaterials.hotMetal} attach="material" />
        </mesh>
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[0.18, 0.01, 0.26]} />
          <primitive object={fallbackMaterials.silverMetallic} attach="material" />
        </mesh>
      </group>

      {/* ================= 3. LONGITUDINAL INTERMEDIATE PIPE ================= */}
      <mesh position={[-0.14, 0.36, 0.20]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.022, 0.022, 1.06, 8]} />
        <primitive object={fallbackMaterials.hotMetal} attach="material" />
      </mesh>

      {/* ================= 4. OVER-AXLE KICK-UP PIPING ================= */}
      <group position={[-0.14, 0.36, -0.33]}>
        <mesh position={[0, 0.06, -0.08]} rotation={[Math.PI / 4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.18, 8]} />
          <primitive object={fallbackMaterials.hotMetal} attach="material" />
        </mesh>
        <mesh position={[0, 0.16, -0.42]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.54, 8]} />
          <primitive object={fallbackMaterials.hotMetal} attach="material" />
        </mesh>
        <mesh position={[0, 0.08, -0.74]} rotation={[-Math.PI / 4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.20, 8]} />
          <primitive object={fallbackMaterials.hotMetal} attach="material" />
        </mesh>
      </group>

      {/* ================= 5. TRANSVERSE REAR MUFFLER ================= */}
      <group position={[0, 0.38, -1.14]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.10, 0.10, 0.64, 12]} />
          <primitive object={fallbackMaterials.hotMetal} attach="material" />
        </mesh>
        <mesh position={[-0.322, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.102, 0.102, 0.005, 12]} />
          <primitive object={fallbackMaterials.silverMetallic} attach="material" />
        </mesh>
        <mesh position={[0.322, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.102, 0.102, 0.005, 12]} />
          <primitive object={fallbackMaterials.silverMetallic} attach="material" />
        </mesh>
        <mesh position={[-0.24, 0.09, 0]} castShadow>
          <boxGeometry args={[0.02, 0.14, 0.04]} />
          <primitive object={fallbackMaterials.hotMetal} attach="material" />
        </mesh>
        <mesh position={[0.24, 0.09, 0]} castShadow>
          <boxGeometry args={[0.02, 0.14, 0.04]} />
          <primitive object={fallbackMaterials.hotMetal} attach="material" />
        </mesh>
      </group>

      {/* ================= 6. LEFT TAILPIPE & CHROME EXIT TIP ================= */}
      <group position={[-0.28, 0.38, -1.14]}>
        <mesh position={[-0.08, -0.03, -0.10]} rotation={[0.4, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.20, 8]} />
          <primitive object={fallbackMaterials.hotMetal} attach="material" />
        </mesh>
        <mesh position={[-0.14, -0.04, -0.14]} rotation={[Math.PI / 2, 0, -0.2]} castShadow>
          <cylinderGeometry args={[0.028, 0.028, 0.08, 12]} />
          <primitive object={fallbackMaterials.chromeTip} attach="material" />
        </mesh>
      </group>

      {/* ================= 7. RIGHT TAILPIPE & CHROME EXIT TIP ================= */}
      <group position={[0.28, 0.38, -1.14]}>
        <mesh position={[0.08, -0.03, -0.10]} rotation={[0.4, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.20, 8]} />
          <primitive object={fallbackMaterials.hotMetal} attach="material" />
        </mesh>
        <mesh position={[0.14, -0.04, -0.14]} rotation={[Math.PI / 2, 0, 0.2]} castShadow>
          <cylinderGeometry args={[0.028, 0.028, 0.08, 12]} />
          <primitive object={fallbackMaterials.chromeTip} attach="material" />
        </mesh>
      </group>

      {/* ================= 8. SYMMETRICAL VAPOR TRAILS ================= */}
      <instancedMesh
        ref={meshRef}
        args={[null, null, totalPuffs]}
        material={customMaterial}
      >
        <planeGeometry args={[1, 1]}>
          <instancedBufferAttribute
            attach="attributes-aOpacity"
            args={[opacities, 1]}
          />
        </planeGeometry>
      </instancedMesh>
    </group>
  );
}