"use client";

import { useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 5-Blade layout coordinates modeled after your OpenGL fanned design
const BASE_BLADES = [
  // 1. Low-leaf-left (Heavy tilt)
  { height: 0.15, width: 0.024, tiltX: 0.1, tiltZ: -0.5, yaw: 0.3 },
  // 2. Low-leaf-right (Heavy tilt)
  { height: 0.15, width: 0.024, tiltX: -0.1, tiltZ: 0.5, yaw: -0.3 },
  // 3. Mid-leaf-left (Moderate tilt)
  { height: 0.22, width: 0.028, tiltX: 0.05, tiltZ: -0.25, yaw: 0.15 },
  // 4. Mid-leaf-right (Moderate tilt)
  { height: 0.22, width: 0.028, tiltX: -0.05, tiltZ: 0.25, yaw: -0.15 },
  // 5. Top-leaf-mid (Upright center)
  { height: 0.28, width: 0.03, tiltX: 0.0, tiltZ: 0.0, yaw: 0.0 },
];

// Pure helper function declared outside the React component
function createGrassMaterial(type, colorTop, colorMid, colorBottom) {
  const material = new THREE.MeshStandardMaterial({
    roughness: 0.85,
    side: THREE.DoubleSide,
  });

  material.userData = {
    uTime: { value: 0 },
    uWindSpeed: { value: 1.0 },
    uColorTop: { value: new THREE.Color(colorTop) },
    uColorMid: { value: new THREE.Color(colorMid) },
    uColorBottom: { value: new THREE.Color(colorBottom) },
    uType: { value: type }, // 0: SM, 1: MD, 2: LG
  };

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = material.userData.uTime;
    shader.uniforms.uWindSpeed = material.userData.uWindSpeed;
    shader.uniforms.uColorTop = material.userData.uColorTop;
    shader.uniforms.uColorMid = material.userData.uColorMid;
    shader.uniforms.uColorBottom = material.userData.uColorBottom;
    shader.uniforms.uType = material.userData.uType;

    shader.vertexShader = `
      uniform float uTime;
      uniform float uWindSpeed;
      varying float vHeightFactor;
    ` + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
      #include <begin_vertex>
      vHeightFactor = uv.y;
      
      float waveX = sin(uTime * 2.2 * uWindSpeed) * 0.15 * uWindSpeed;
      float waveZ = cos(uTime * 1.8 * uWindSpeed) * 0.10 * uWindSpeed;
      
      float swayFactor = pow(max(0.0, uv.y), 1.5);
      
      transformed.x += waveX * swayFactor;
      transformed.z += waveZ * swayFactor;
      `
    );

    shader.fragmentShader = `
      uniform vec3 uColorTop;
      uniform vec3 uColorMid;
      uniform vec3 uColorBottom;
      uniform int uType;
      varying float vHeightFactor;
    ` + shader.fragmentShader;

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `
      #include <color_fragment>
      
      vec3 finalGrassColor = vec3(1.0);
      
      if (uType == 0) {
        finalGrassColor = uColorTop;
      } else if (uType == 1) {
        finalGrassColor = mix(uColorBottom, uColorTop, vHeightFactor);
      } else {
        if (vHeightFactor < 0.35) {
          float t = vHeightFactor / 0.35;
          finalGrassColor = mix(uColorBottom, uColorMid, t);
        } else {
          float t = (vHeightFactor - 0.35) / 0.65;
          finalGrassColor = mix(uColorMid, uColorTop, t);
        }
      }
      diffuseColor.rgb = finalGrassColor;
      `
    );
  };

  return material;
}

// Global material assignments run once at file load, bypassing React Hooks constraints entirely
const pGreen = "#5ce65c"; // Parrot green
const bGreen = "#0B3C1A"; // Bottle green
const yBrown = "#946927"; // Yellowish brown

const WEBGL_MATERIALS_CACHE = {
  short: createGrassMaterial(0, pGreen, pGreen, pGreen),
  medium: createGrassMaterial(1, pGreen, bGreen, bGreen),
  tall: createGrassMaterial(2, pGreen, bGreen, yBrown),
};

// Angle close to horizontal (approx 72 degrees) to make roots connect and mesh
const ROOT_HORIZONTAL_TILT = 1.25;

function GrassTuft({ scale, position, material, geometries, rootGeometry, rootMaterial }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* 1. Horizontal mesh curly root network fanning outward & weaving under surface */}
      <group position={[0, -0.005, 0]}>
        {/* Root 1: pivoted at surface, fanning horizontally outward */}
        <mesh rotation={[0, 0, ROOT_HORIZONTAL_TILT]} geometry={rootGeometry} material={rootMaterial} castShadow />
        {/* Root 2: pivoted at surface, fanning horizontally outward */}
        <mesh rotation={[0, 2.1, ROOT_HORIZONTAL_TILT]} geometry={rootGeometry} material={rootMaterial} castShadow />
        {/* Root 3: pivoted at surface, fanning horizontally outward */}
        <mesh rotation={[0, 4.2, ROOT_HORIZONTAL_TILT]} geometry={rootGeometry} material={rootMaterial} castShadow />
      </group>

      {/* 2. Multi-tier blades */}
      {BASE_BLADES.map((blade, idx) => (
        <mesh
          key={idx}
          geometry={geometries[idx]}
          material={material}
          rotation={[blade.tiltX, blade.yaw, blade.tiltZ]}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

export default function Grass({ color, windSpeed = 1.0 }) {
  // Seeded root material
  const rootMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#3d220b", // Rich root brown
    roughness: 0.95,
  }), []);

  // Handle dynamic custom color overrides inside standard side-effect hooks
  useEffect(() => {
    const activeParrotGreen = color || "#5ce65c";
    WEBGL_MATERIALS_CACHE.short.userData.uColorTop.value.set(activeParrotGreen);
    WEBGL_MATERIALS_CACHE.medium.userData.uColorTop.value.set(activeParrotGreen);
    WEBGL_MATERIALS_CACHE.tall.userData.uColorTop.value.set(activeParrotGreen);
  }, [color]);

  // Update shader uniforms smoothly inside the frame loop
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    WEBGL_MATERIALS_CACHE.short.userData.uTime.value = elapsed;
    WEBGL_MATERIALS_CACHE.short.userData.uWindSpeed.value = windSpeed;

    WEBGL_MATERIALS_CACHE.medium.userData.uTime.value = elapsed;
    WEBGL_MATERIALS_CACHE.medium.userData.uWindSpeed.value = windSpeed;

    WEBGL_MATERIALS_CACHE.tall.userData.uTime.value = elapsed;
    WEBGL_MATERIALS_CACHE.tall.userData.uWindSpeed.value = windSpeed;
  });

  // Root geometry extended (50% longer: 0.40, 50% thinner: 0.006) deformed procedurally like curly hair
  const rootGeometry = useMemo(() => {
    // 16 height segments used to cleanly interpolate the spiral curly helix waves
    const geom = new THREE.CylinderGeometry(0.006, 0.0005, 0.40, 4, 16);
    geom.translate(0, -0.20, 0); // Offsets pivot to the top surface of the root

    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i); // Ranges from 0 down to -0.40
      
      // Curly helix curls using sine and cosine waves
      const waveX = Math.sin(y * 42.0) * 0.025;
      const waveZ = Math.cos(y * 42.0) * 0.025;
      
      // Amplifies curliness deeper towards the root tip, zero curl at connection crown (y = 0)
      const depthFactor = -y / 0.40;
      pos.setX(i, pos.getX(i) + waveX * depthFactor);
      pos.setZ(i, pos.getZ(i) + waveZ * depthFactor);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Base geometries translated so roots remain static at the origin point
  const geometries = useMemo(() => {
    return BASE_BLADES.map((blade) => {
      const geom = new THREE.PlaneGeometry(blade.width, blade.height, 1, 4);
      geom.translate(0, blade.height / 2, 0); 
      return geom;
    });
  }, []);

  // Pure seeded pseudo-random scatter field configuration
  const scatteredField = useMemo(() => {
    const field = [];
    const radius = 4.2;
    let seed = 45678;

    const nextRandom = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // 1. Short Grass Tufts (sm) - High density (Parrot green)
    for (let i = 0; i < 90; i++) {
      const angle = nextRandom() * Math.PI * 2;
      const r = Math.sqrt(nextRandom()) * radius;
      if (r < 0.2) continue;
      field.push({
        type: "short",
        scale: 0.6 + nextRandom() * 0.2,
        position: [Math.cos(angle) * r, -0.6, Math.sin(angle) * r],
      });
    }

    // 2. Medium Grass Tufts (md) - Medium density (Parrot top + Bottle bottom)
    for (let i = 0; i < 50; i++) {
      const angle = nextRandom() * Math.PI * 2;
      const r = Math.sqrt(nextRandom()) * radius;
      if (r < 0.2) continue;
      field.push({
        type: "medium",
        scale: 1.0 + nextRandom() * 0.3,
        position: [Math.cos(angle) * r, -0.6, Math.sin(angle) * r],
      });
    }

    // 3. Tall Grass Tufts (lg) - Sparse density (Parrot top + Bottle mid + Yellow-brown bottom)
    for (let i = 0; i < 25; i++) {
      const angle = nextRandom() * Math.PI * 2;
      const r = Math.sqrt(nextRandom()) * radius;
      if (r < 0.2) continue;
      field.push({
        type: "tall",
        scale: 1.5 + nextRandom() * 0.4,
        position: [Math.cos(angle) * r, -0.6, Math.sin(angle) * r],
      });
    }

    return field;
  }, []);

  return (
    <group>
      {scatteredField.map((tuft, idx) => (
        <GrassTuft
          key={idx}
          scale={tuft.scale}
          position={tuft.position}
          material={WEBGL_MATERIALS_CACHE[tuft.type]}
          geometries={geometries}
          rootGeometry={rootGeometry}
          rootMaterial={rootMaterial}
        />
      ))}
    </group>
  );
}