"use client";

import { useMemo, useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createSeededRandom(seed = 54321) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createMultiLobedCloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, 512, 512);

  const lobes = [
    { x: 256, y: 256, r: 130, intensity: 1.0 },
    { x: 195, y: 275, r: 95,  intensity: 0.82 },
    { x: 315, y: 265, r: 105, intensity: 0.85 },
    { x: 250, y: 195, r: 85,  intensity: 0.78 },
    { x: 145, y: 285, r: 75,  intensity: 0.52 },
    { x: 365, y: 275, r: 80,  intensity: 0.58 },
  ];

  lobes.forEach((lobe) => {
    const grad = ctx.createRadialGradient(lobe.x, lobe.y, 0, lobe.x, lobe.y, lobe.r);
    grad.addColorStop(0.0, `rgba(255, 255, 255, ${lobe.intensity})`);
    grad.addColorStop(0.2, `rgba(255, 255, 255, ${lobe.intensity * 0.85})`);
    grad.addColorStop(0.5, `rgba(255, 255, 255, ${lobe.intensity * 0.45})`);
    grad.addColorStop(0.75, `rgba(255, 255, 255, ${lobe.intensity * 0.1})`);
    grad.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lobe.x, lobe.y, lobe.r, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function getPuffThemeProps(preset, heightVal) {
  const h = THREE.MathUtils.clamp(heightVal, 0, 1);

  if (preset === "day") {
    const bottom = new THREE.Color("#C8D4DC");
    const middle = new THREE.Color("#E7EEF2");
    const top = new THREE.Color("#F8FAFB");

    const color = new THREE.Color();
    if (h < 0.55) {
      color.lerpColors(bottom, middle, THREE.MathUtils.smoothstep(h / 0.55, 0, 1));
    } else {
      color.lerpColors(middle, top, THREE.MathUtils.smoothstep((h - 0.55) / 0.45, 0, 1));
    }

    return {
      color: `#${color.getHexString()}`,
      opacity: THREE.MathUtils.lerp(0.22, 0.46, h),
    };
  }

  if (preset === "storm") {
    const bottom = new THREE.Color("#1a1e24");
    const middle = new THREE.Color("#2d3540");
    const top = new THREE.Color("#3c4552");

    const color = new THREE.Color();
    if (h < 0.6) {
      color.lerpColors(bottom, middle, THREE.MathUtils.smoothstep(h / 0.6, 0, 1));
    } else {
      color.lerpColors(middle, top, THREE.MathUtils.smoothstep((h - 0.6) / 0.4, 0, 1));
    }

    return {
      color: `#${color.getHexString()}`,
      opacity: THREE.MathUtils.lerp(0.28, 0.40, h),
    };
  }

  if (preset === "eclipse") {
    // Silver linings and dark, eclipsed silhouettes
    const bottom = new THREE.Color("#0c0d12");
    const middle = new THREE.Color("#161821");
    const top = new THREE.Color("#3c4154"); // Backlit silver edge

    const color = new THREE.Color();
    if (h < 0.7) {
      color.lerpColors(bottom, middle, THREE.MathUtils.smoothstep(h / 0.7, 0, 1));
    } else {
      color.lerpColors(middle, top, THREE.MathUtils.smoothstep((h - 0.7) / 0.3, 0, 1));
    }

    return {
      color: `#${color.getHexString()}`,
      opacity: THREE.MathUtils.lerp(0.35, 0.55, h),
    };
  }

  if (preset === "moonNight") {
    const bottom = new THREE.Color("#202938");
    const middle = new THREE.Color("#2B3547");
    const top = new THREE.Color("#435067");

    const color = new THREE.Color();
    if (h < 0.6) {
      color.lerpColors(bottom, middle, THREE.MathUtils.smoothstep(h / 0.6, 0, 1));
    } else {
      color.lerpColors(middle, top, THREE.MathUtils.smoothstep((h - 0.6) / 0.4, 0, 1));
    }

    return {
      color: `#${color.getHexString()}`,
      opacity: THREE.MathUtils.lerp(0.24, 0.34, h),
    };
  }

  // Sunrise fallbacks
  const bottom = new THREE.Color("#C8B8B4");
  const middle = new THREE.Color("#E3D4D0");
  const top = new THREE.Color("#F4E8DE");

  const color = new THREE.Color();
  if (h < 0.6) {
    color.lerpColors(bottom, middle, THREE.MathUtils.smoothstep(h / 0.6, 0, 1));
  } else {
    color.lerpColors(middle, top, THREE.MathUtils.smoothstep((h - 0.6) / 0.4, 0, 1));
  }

  return {
    color: `#${color.getHexString()}`,
    opacity: THREE.MathUtils.lerp(0.20, 0.40, h),
  };
}

export default function ProceduralCloud({
  activePreset = "day",
  windSpeed = 0.12,
  billowScale = 0.6,
  baseOpacity = 1.0,
  staticClouds = 8,
  dynamicClouds = 6,
  wispyClouds = 4,
  skyWidth = 40,
  skyDepth = 24,
}) {
  const meshRef = useRef(null);
  const shaderRef = useRef(null);
  
  const cloudTexture = useMemo(() => createMultiLobedCloudTexture(), []);

  const materialConfig = useMemo(() => {
    return {
      transparent: true,
      depthWrite: false,
      depthTest: true,
      alphaTest: 0.001,
      map: cloudTexture,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
      toneMapped: true,
    };
  }, [cloudTexture]);

  const { cloudObjects, totalPuffs } = useMemo(() => {
    const random = createSeededRandom(43210);
    const tempClouds = [];
    let puffIndexCounter = 0;

    const buildCumulusCluster = (basePos, speed, phase, cloudIdx) => {
      const puffs = [];
      const puffCount = Math.floor(random() * 5) + 7;

      puffs.push({
        localPos: new THREE.Vector3(0, 0, 0),
        scale: new THREE.Vector3(4.5, 1.3, 1.0),
        heightVal: 0.0,
      });

      puffs.push({
        localPos: new THREE.Vector3(-2.2, -0.1, -0.2),
        scale: new THREE.Vector3(3.2, 0.9, 1.0),
        heightVal: 0.15,
      });
      puffs.push({
        localPos: new THREE.Vector3(2.2, -0.1, 0.2),
        scale: new THREE.Vector3(3.2, 0.9, 1.0),
        heightVal: 0.15,
      });

      const peakHeight = random() * 0.4 + 0.8;
      puffs.push({
        localPos: new THREE.Vector3(-0.6, 0.5, 0.1),
        scale: new THREE.Vector3(3.3, 1.8, 1.0),
        heightVal: 0.5,
      });
      puffs.push({
        localPos: new THREE.Vector3(0.7, 0.6, -0.1),
        scale: new THREE.Vector3(2.9, 1.7, 1.0),
        heightVal: 0.55,
      });

      puffs.push({
        localPos: new THREE.Vector3(0.0, peakHeight, 0.0),
        scale: new THREE.Vector3(2.2, 2.0, 1.0),
        heightVal: 0.95,
      });

      const remaining = puffCount - puffs.length;
      for (let i = 0; i < remaining; i++) {
        const theta = random() * Math.PI * 2;
        const rad = random() * 1.5;
        const lx = Math.cos(theta) * rad;
        const ly = random() * 0.5;
        const lz = Math.sin(theta) * rad * 0.5;

        const normalizedHeight = THREE.MathUtils.clamp((ly + 0.25) / 0.75, 0, 1);

        puffs.push({
          localPos: new THREE.Vector3(lx, ly, lz),
          scale: new THREE.Vector3(random() * 1.5 + 1.2, random() * 0.8 + 0.8, 1.0),
          heightVal: normalizedHeight * 0.65 + 0.15,
        });
      }

      const cloudPuffs = puffs.map((p) => ({
        ...p,
        rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, (random() - 0.5) * 0.2)),
        globalIndex: puffIndexCounter++,
      }));

      tempClouds.push({
        type: "cumulus",
        basePos,
        speed,
        phase,
        puffs: cloudPuffs,
        cloudIdx,
      });
    };

    const buildWispyCluster = (basePos, speed, phase, cloudIdx) => {
      const puffs = [];
      const segmentCount = 4;

      for (let i = 0; i < segmentCount; i++) {
        const offsetMultiplier = i - (segmentCount - 1) / 2;
        puffs.push({
          localPos: new THREE.Vector3(offsetMultiplier * 2.2 + (random() - 0.5) * 0.5, (random() - 0.5) * 0.15, 0),
          scale: new THREE.Vector3(random() * 1.5 + 4.5, random() * 0.12 + 0.3, 1.0),
          heightVal: 0.75,
          rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, (random() - 0.5) * 0.05)),
          globalIndex: puffIndexCounter++,
        });
      }

      tempClouds.push({
        type: "wispy",
        basePos,
        speed,
        phase,
        puffs,
        cloudIdx,
      });
    };

    const buildHorizonCluster = (basePos, phase, cloudIdx) => {
      const puffs = [];
      const puffCount = 6;

      for (let i = 0; i < puffCount; i++) {
        const hVal = random();
        puffs.push({
          localPos: new THREE.Vector3((random() - 0.5) * 6.0, (random() - 0.5) * 0.8, (random() - 0.5) * 2.0),
          scale: new THREE.Vector3(random() * 4.0 + 5.0, random() * 1.5 + 1.5, 1.0),
          heightVal: hVal * 0.4 + 0.1,
          rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, (random() - 0.5) * 0.15)),
          globalIndex: puffIndexCounter++,
        });
      }

      tempClouds.push({
        type: "static",
        basePos,
        speed: 0,
        phase,
        puffs,
        cloudIdx,
      });
    };

    for (let i = 0; i < staticClouds; i++) {
      const angle = random() * Math.PI * 2;
      const radiusX = random() * (skyWidth * 0.4) + skyWidth * 0.5;
      const radiusZ = random() * (skyDepth * 0.3) + skyDepth * 0.6;
      const position = new THREE.Vector3(
        Math.cos(angle) * radiusX,
        random() * 2.5 + 2.5,
        Math.sin(angle) * radiusZ - 12.0
      );
      buildHorizonCluster(position, random() * 100, i);
    }

    for (let i = 0; i < dynamicClouds; i++) {
      const position = new THREE.Vector3(
        (random() - 0.5) * skyWidth * 1.2,
        random() * 1.5 + 1.2,
        (random() - 0.5) * (skyDepth * 0.3) - 3.0
      );
      const speed = (random() * 0.3 + 0.5) * windSpeed;
      buildCumulusCluster(position, speed, random() * 100, i + staticClouds);
    }

    for (let i = 0; i < wispyClouds; i++) {
      const position = new THREE.Vector3(
        (random() - 0.5) * skyWidth,
        random() * 0.8 + 0.4,
        random() * 4.0 + 1.5
      );
      const speed = (random() * 0.5 + 1.0) * windSpeed;
      buildWispyCluster(position, speed, random() * 100, i + staticClouds + dynamicClouds);
    }

    return { cloudObjects: tempClouds, totalPuffs: puffIndexCounter };
  }, [staticClouds, dynamicClouds, wispyClouds, windSpeed, skyWidth, skyDepth]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const elapsed = state.clock.getElapsedTime();
    const tempObject = new THREE.Object3D();
    const halfWidth = skyWidth * 0.8;

    cloudObjects.forEach((cloud) => {
      let currentX = cloud.basePos.x + elapsed * cloud.speed;

      if (cloud.speed > 0) {
        if (currentX > halfWidth) {
          currentX = -halfWidth - ((currentX - halfWidth) % (halfWidth * 2));
        } else if (currentX < -halfWidth) {
          currentX = halfWidth + ((currentX + halfWidth) % (halfWidth * 2));
        }
      }

      const groupPulse = Math.sin(elapsed * 0.2 + cloud.phase) * 0.03 + 1.0;

      cloud.puffs.forEach((puff) => {
        const worldX = currentX + puff.localPos.x * groupPulse;
        const worldY = cloud.basePos.y + puff.localPos.y * groupPulse;
        const worldZ = cloud.basePos.z + puff.localPos.z;

        tempObject.position.set(worldX, worldY, worldZ);
        tempObject.quaternion.copy(puff.rotation);
        tempObject.scale.copy(puff.scale).multiplyScalar(groupPulse);
        tempObject.updateMatrix();

        meshRef.current.setMatrixAt(puff.globalIndex, tempObject.matrix);
      });
    });

    meshRef.current.instanceMatrix.needsUpdate = true;

    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = elapsed;
    }
  });

  useLayoutEffect(() => {
    if (meshRef.current && meshRef.current.geometry) {
      const opacities = new Float32Array(totalPuffs);
      const tempColor = new THREE.Color();

      cloudObjects.forEach((cloud) => {
        cloud.puffs.forEach((puff) => {
          const properties = getPuffThemeProps(activePreset, puff.heightVal);
          opacities[puff.globalIndex] = properties.opacity * baseOpacity;

          tempColor.set(properties.color);
          meshRef.current.setColorAt(puff.globalIndex, tempColor);
        });
      });

      const instancedBufferAttribute = new THREE.InstancedBufferAttribute(opacities, 1);
      meshRef.current.geometry.setAttribute("aOpacity", instancedBufferAttribute);
      meshRef.current.geometry.attributes.aOpacity.needsUpdate = true;

      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [cloudObjects, totalPuffs, activePreset, baseOpacity]);

  const customMaterial = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial(materialConfig);
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uBillowSpeed = { value: 0.8 };
      shader.uniforms.uBillowScale = { value: billowScale };
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
        
        float wave = sin(uTime * 0.9 * uBillowSpeed + position.x * 2.2 + position.y * 1.6) * 0.14 * uBillowScale;
        float waveY = cos(uTime * 0.7 * uBillowSpeed + position.y * 2.2) * 0.14 * uBillowScale;
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
  }, [materialConfig, billowScale]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, totalPuffs]}
      material={customMaterial}
    >
      <planeGeometry args={[2, 2]} />
    </instancedMesh>
  );
}