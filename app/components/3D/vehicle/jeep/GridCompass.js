
"use client";

import { Grid, Text } from "@react-three/drei";
import * as THREE from "three";

function AxisArrow({
  direction,
  color,
  length = 1.8,
  shaftRadius = 0.035,
  headRadius = 0.09,
  headLength = 0.22,
}) {
  const shaftLength = length - headLength;

  // Cylinder/cone are naturally aligned to +Y.
  // Rotate them so +Y points in the desired world direction.
  let rotation = [0, 0, 0];

  if (direction === "x") {
    // +X
    rotation = [0, 0, -Math.PI / 2];
  } else if (direction === "z") {
    // +Z
    rotation = [Math.PI / 2, 0, 0];
  }

  return (
    <group rotation={rotation}>
      {/* Shaft */}
      <mesh position={[0, shaftLength / 2, 0]}>
        <cylinderGeometry
          args={[shaftRadius, shaftRadius, shaftLength, 16]}
        />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Arrow head */}
      <mesh position={[0, shaftLength + headLength / 2, 0]}>
        <coneGeometry args={[headRadius, headLength, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function AngleLabel({
  angle,
  label,
  radius = 2.8,
  color = "#cbd5e1",
}) {
  // Grid convention:
  // 0°   = +Z
  // 90°  = +X
  // 180° = -Z
  // 270° = -X
  const radians = THREE.MathUtils.degToRad(angle);

  const x = Math.sin(radians) * radius;
  const z = Math.cos(radians) * radius;

  return (
    <Text
      position={[x, 0.035, z]}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={0.22}
      color={color}
      fontWeight="bold"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.015}
      outlineColor="#020617"
    >
      {label} {angle}°
    </Text>
  );
}

function AngleTick({
  angle,
  radius = 2.2,
  length = 0.16,
}) {
  const radians = THREE.MathUtils.degToRad(angle);

  const x = Math.sin(radians) * radius;
  const z = Math.cos(radians) * radius;

  return (
    <mesh
      position={[x, 0.012, z]}
      rotation={[0, radians, 0]}
    >
      <boxGeometry args={[0.025, 0.025, length]} />
      <meshBasicMaterial color="#64748b" />
    </mesh>
  );
}

function GlobalXYZIndicator({
  position = [0, 0.02, 0],
}) {
  const compassRadius = 2.2;

  return (
    <group position={position}>
      {/* =========================================================
          CENTER / ORIGIN
      ========================================================= */}

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.12, 2.18, 96]} />
        <meshBasicMaterial
          color="#94a3b8"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Center point */}
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshBasicMaterial color="#f8fafc" />
      </mesh>

      {/* =========================================================
          Y AXIS
          World +Y = UP
      ========================================================= */}

      <AxisArrow
        direction="y"
        color="#22c55e"
        length={2.0}
        shaftRadius={0.045}
        headRadius={0.12}
        headLength={0.28}
      />

      <Text
        position={[0, 2.25, 0]}
        fontSize={0.32}
        color="#22c55e"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#020617"
      >
        Y
      </Text>

      {/* =========================================================
          X AXIS
          +X = EAST = 90°
      ========================================================= */}

      <AxisArrow
        direction="x"
        color="#ef4444"
        length={1.9}
        shaftRadius={0.045}
        headRadius={0.12}
        headLength={0.28}
      />

      {/* X label */}
      <Text
        position={[2.05, 0.06, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color="#ef4444"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#020617"
      >
        X
      </Text>

      {/* =========================================================
          Z AXIS
          +Z = NORTH = 0°
      ========================================================= */}

      <AxisArrow
        direction="z"
        color="#3b82f6"
        length={1.9}
        shaftRadius={0.045}
        headRadius={0.12}
        headLength={0.28}
      />

      {/* Z label */}
      <Text
        position={[0, 0.06, 2.05]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color="#3b82f6"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#020617"
      >
        Z
      </Text>

      {/* =========================================================
          8-WAY ANGLE TICKS
          
          Relative to the GRID:
          
          0°   = +Z
          45°  = NE
          90°  = +X
          135° = SE
          180° = -Z
          225° = SW
          270° = -X
          315° = NW
      ========================================================= */}

      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <AngleTick
          key={angle}
          angle={angle}
          radius={compassRadius}
          length={angle % 90 === 0 ? 0.22 : 0.14}
        />
      ))}

      {/* =========================================================
          CARDINAL / RELATIVE GRID ANGLES
      ========================================================= */}

      <AngleLabel
        angle={0}
        label="N"
        radius={2.65}
        color="#3b82f6"
      />

      <AngleLabel
        angle={45}
        label="NE"
        radius={2.65}
      />

      <AngleLabel
        angle={90}
        label="E"
        radius={2.65}
        color="#ef4444"
      />

      <AngleLabel
        angle={135}
        label="SE"
        radius={2.65}
      />

      <AngleLabel
        angle={180}
        label="S"
        radius={2.65}
      />

      <AngleLabel
        angle={225}
        label="SW"
        radius={2.65}
      />

      <AngleLabel
        angle={270}
        label="W"
        radius={2.65}
      />

      <AngleLabel
        angle={315}
        label="NW"
        radius={2.65}
      />

      {/* =========================================================
          CENTER LABEL
      ========================================================= */}

      <Text
        position={[0, 0.07, -0.35]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.16}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        ORIGIN
      </Text>
    </group>
  );
}

export default function GridCompass({
  gridPosition = [0, 0, 0],
  gridArgs = [100, 100],
  cellColor = "#4b5563",
  sectionColor = "#1f2937",
  fadeDistance = 40,
}) {
  return (
    <group>
      {/* Grid */}
      <Grid
        position={gridPosition}
        args={gridArgs}
        cellColor={cellColor}
        sectionColor={sectionColor}
        fadeDistance={fadeDistance}
        cellThickness={1}
        sectionThickness={1.5}
      />

      {/* Compass is ALWAYS at the grid's origin */}
      <GlobalXYZIndicator
        position={[
          gridPosition[0],
          gridPosition[1] + 0.02,
          gridPosition[2],
        ]}
      />
    </group>
  );
}

