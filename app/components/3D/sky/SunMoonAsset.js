"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";

// Custom shader to calculate a mathematically seamless exponential radial decay
const SeamlessGlowShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform vec3 uInnerColor;
    uniform vec3 uOuterColor;
    uniform float uOpacity;
    
    void main() {
      // Calculate distance from center (0.5, 0.5)
      float dist = length(vUv - vec2(0.5));
      
      // Discard pixels outside the quad boundary circle to optimize performance
      if (dist > 0.5) {
        discard;
      }
      
      // Continuous normalized glow (1.0 at center, 0.0 at edge)
      float glow = smoothstep(0.5, 0.0, dist);
      
      // Exponential falloff curve to create a seamless, soft light-scatter transition
      float falloff = pow(glow, 3.2);
      
      // Interpolate seamlessly between the color layers
      vec3 finalColor = mix(uOuterColor, uInnerColor, falloff);
      
      gl_FragColor = vec4(finalColor, falloff * uOpacity);
    }
  `
};

export default function SunMoon({
  type = "sun",
  position = [0, 5, -25],
  size = 1.0,
  intensity = 1.0,
  color,
  animate = false,
}) {
  const groupRef = useRef(null);
  const isMoon = type === "moon";

  const actualColor = color ?? (isMoon ? "#E8EDF5" : "#FFF3C4");
  const isEclipse = color === "#000000" || actualColor === "#000000";

  // Maps dedicated glow configurations per preset
  const glowConfig = useMemo(() => {
    if (isMoon) {
      return {
        core: isEclipse ? "#000000" : "#E8EDF5",
        inner: "#b9c7db",
        outer: "#7dd3fc",
        opacity: 0.35,
      };
    }

    // Day Preset: Your exact 3D resin/glass layering palette
    if (color === "#FFF3C4" || color === "#ffffff") {
      return {
        core: "#FFFFFF",       // Top Layer (Direct Light Core)
        inner: "#FFE1A3",      // Upper-Middle Layer (Intense Glow)
        outer: "#FFD07B",      // Lower-Middle Layer (Soft Scatter)
        opacity: 0.85,          // Adjusted for highly transparent seamless blending
      };
    }

    // Sunrise Preset: Soft sunset gold to rose gradient
    if (color === "#FFD28A") {
      return {
        core: "#FFFFFF",
        inner: "#FFD28A",
        outer: "#f43f5e",
        opacity: 0.75,
      };
    }

    // Eclipse Preset: Warm radiant solar corona
    if (color === "#ffeebb") {
      return {
        core: "#ffeebb",
        inner: "#FFE1A3",
        outer: "#FFD07B",
        opacity: 0.95,
      };
    }

    // Storm Preset: Overcast cool white-grey
    if (color === "#9BA8B8") {
      return {
        core: "#FFFFFF",
        inner: "#CBD5E1",
        outer: "#94A3B8",
        opacity: 0.45,
      };
    }

    // Default Fallback
    return {
      core: "#FFFFFF",
      inner: "#FFE1A3",
      outer: "#FFD07B",
      opacity: 0.6,
    };
  }, [color, isMoon, isEclipse]);

  // Generate craters (disabled during eclipse)
  const craters = useMemo(() => {
    if (isEclipse) return [];
    const radius = size * 0.45;
    return [
      { pos: [radius * 0.5, radius * 0.4, radius * 0.75], r: size * 0.08 },
      { pos: [-radius * 0.6, radius * 0.3, radius * 0.72], r: size * 0.06 },
      { pos: [radius * 0.2, -radius * 0.6, radius * 0.78], r: size * 0.075 },
      { pos: [-radius * 0.3, -radius * 0.4, -radius * 0.8], r: size * 0.05 },
      { pos: [radius * 0.7, -radius * 0.2, -radius * 0.65], r: size * 0.065 },
      { pos: [-radius * 0.4, radius * 0.6, -radius * 0.65], r: size * 0.07 },
      { pos: [radius * 0.1, radius * 0.8, -radius * 0.45], r: size * 0.05 },
    ];
  }, [size, isEclipse]);

  // Unified shader material uniforms
  const shaderUniforms = useMemo(() => {
    return {
      uInnerColor: { value: new THREE.Color(glowConfig.inner) },
      uOuterColor: { value: new THREE.Color(glowConfig.outer) },
      uOpacity: { value: glowConfig.opacity * intensity },
    };
  }, [glowConfig, intensity]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 0.35) * 0.005;
    groupRef.current.scale.setScalar(pulse);

    if (animate) {
      groupRef.current.position.x = position[0] + Math.cos(t * 0.05) * 1.5;
      groupRef.current.position.y = position[1] + Math.sin(t * 0.05) * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {isMoon ? (
        // =========================================
        // SOLID SILHOUETTE / CRATERED MOON
        // =========================================
        <group>
          {/* Seamless Moon Atmospheric Haze */}
          {!isEclipse && (
            <Billboard renderOrder={9}>
              <mesh>
                <planeGeometry args={[size * 1.6, size * 1.6]} />
                <shaderMaterial
                  key={`${glowConfig.inner}-${glowConfig.outer}`}
                  vertexShader={SeamlessGlowShader.vertexShader}
                  fragmentShader={SeamlessGlowShader.fragmentShader}
                  uniforms={shaderUniforms}
                  transparent
                  depthWrite={false}
                  depthTest={true}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            </Billboard>
          )}

          {/* Solid Moon Core */}
          <mesh castShadow receiveShadow renderOrder={10}>
            <sphereGeometry args={[size * 0.45, 32, 32]} />
            <meshBasicMaterial
              color={glowConfig.core}
              depthWrite={true}
              depthTest={true}
            />
          </mesh>

          {/* Craters */}
          {!isEclipse && craters.map((crater, idx) => {
            const craterColorObj = new THREE.Color(glowConfig.core).multiplyScalar(0.72);
            const craterColor = `#${craterColorObj.getHexString()}`;

            return (
              <mesh key={idx} position={crater.pos} renderOrder={11}>
                <sphereGeometry args={[crater.r, 8, 8]} />
                <meshBasicMaterial
                  color={craterColor}
                  depthWrite={true}
                  depthTest={true}
                />
              </mesh>
            );
          })}
        </group>
      ) : (
        // =========================================
        // PHYSICAL SUN & SEAMLESS SHADER GLOW
        // =========================================
        <group>
          {/* Seamless, Non-ringed Radial Gradient Corona (rendered behind the core) */}
          <Billboard renderOrder={2}>
            <mesh position={[0, 0, -0.05]}>
              <planeGeometry args={[size * 3.4, size * 3.4]} />
              <shaderMaterial
                key={`${glowConfig.inner}-${glowConfig.outer}`}
                vertexShader={SeamlessGlowShader.vertexShader}
                fragmentShader={SeamlessGlowShader.fragmentShader}
                uniforms={shaderUniforms}
                transparent
                depthWrite={false}
                depthTest={true}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </Billboard>

          {/* Top Layer Core (Direct Light Highlight) */}
          <mesh castShadow renderOrder={1}>
            <sphereGeometry args={[size * 0.45, 32, 32]} />
            <meshBasicMaterial
              color={glowConfig.core}
              depthWrite={true}
              depthTest={true}
              toneMapped={false}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}