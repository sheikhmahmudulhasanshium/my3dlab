"use client";

import { Grid, Text } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";
// Defined as static constants outside the component to prevent recreation during theme changes
const DEFAULT_POSITION = [0, 0, 0];
const DEFAULT_GRID_ARGS = [100, 100];

function AxisArrow({
  direction,
  color,
  length = 1.8,
  shaftRadius = 0.035,
  headRadius = 0.09,
  headLength = 0.22,
}) {
  const shaftLength = length - headLength;

  let rotation = [0, 0, 0];
  if (direction === "x") {
    rotation = [0, 0, -Math.PI / 2];
  } else if (direction === "z") {
    rotation = [Math.PI / 2, 0, 0];
  }

  return (
    <group rotation={rotation}>
      {/* Shaft */}
      <mesh position={[0, shaftLength / 2, 0]}>
        <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength, 16]} />
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
  outlineColor = "#020617",
}) {
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
      outlineColor={outlineColor}
    >
      {label} {angle}°
    </Text>
  );
}

function AngleTick({
  angle,
  radius = 2.2,
  length = 0.16,
  tickColor = "#64748b"
}) {
  const radians = THREE.MathUtils.degToRad(angle);
  const x = Math.sin(radians) * radius;
  const z = Math.cos(radians) * radius;

  return (
    <mesh position={[x, 0.012, z]} rotation={[0, radians, 0]}>
      <boxGeometry args={[0.025, 0.025, length]} />
      <meshBasicMaterial color={tickColor} />
    </mesh>
  );
}

function GlobalXYZIndicator({
  position = DEFAULT_POSITION,
  isDark = true,
  ringColor = "#94a3b8",
  textColor = "#cbd5e1",
  outlineColor = "#020617",
  centerCapColor = "#f8fafc"
}) {
  const compassRadius = 2.2;
  const tickColor = isDark ? "#475569" : "#94a3b8";

  return (
    <group position={position}>
      {/* Outer compass ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.12, 2.18, 96]} />
        <meshBasicMaterial color={ringColor} side={THREE.DoubleSide} />
      </mesh>

      {/* Center point */}
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshBasicMaterial color={centerCapColor} />
      </mesh>

      {/* Y AXIS */}
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
        outlineColor={outlineColor}
      >
        Y
      </Text>

      {/* X AXIS */}
      <AxisArrow
        direction="x"
        color="#ef4444"
        length={1.9}
        shaftRadius={0.045}
        headRadius={0.12}
        headLength={0.28}
      />
      <Text
        position={[2.05, 0.06, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color="#ef4444"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={outlineColor}
      >
        X
      </Text>

      {/* Z AXIS */}
      <AxisArrow
        direction="z"
        color="#3b82f6"
        length={1.9}
        shaftRadius={0.045}
        headRadius={0.12}
        headLength={0.28}
      />
      <Text
        position={[0, 0.06, 2.05]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color="#3b82f6"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={outlineColor}
      >
        Z
      </Text>

      {/* 8-WAY ANGLE TICKS */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <AngleTick
          key={angle}
          angle={angle}
          radius={compassRadius}
          length={angle % 90 === 0 ? 0.22 : 0.14}
          tickColor={tickColor}
        />
      ))}

      {/* Angles with dynamic contrasts */}
      <AngleLabel angle={0} label="N" radius={2.65} color="#3b82f6" outlineColor={outlineColor} />
      <AngleLabel angle={45} label="NE" radius={2.65} color={textColor} outlineColor={outlineColor} />
      <AngleLabel angle={90} label="E" radius={2.65} color="#ef4444" outlineColor={outlineColor} />
      <AngleLabel angle={135} label="SE" radius={2.65} color={textColor} outlineColor={outlineColor} />
      <AngleLabel angle={180} label="S" radius={2.65} color={textColor} outlineColor={outlineColor} />
      <AngleLabel angle={225} label="SW" radius={2.65} color={textColor} outlineColor={outlineColor} />
      <AngleLabel angle={270} label="W" radius={2.65} color={textColor} outlineColor={outlineColor} />
      <AngleLabel angle={315} label="NW" radius={2.65} color={textColor} outlineColor={outlineColor} />

      <Text
        position={[0, 0.07, -0.35]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.16}
        color={textColor}
        anchorX="center"
        anchorY="middle"
      >
        ORIGIN
      </Text>
    </group>
  );
}

export default function GridCompass({
  gridPosition = DEFAULT_POSITION,
  gridArgs = DEFAULT_GRID_ARGS,
  fadeDistance = 40,
  isDark = true, 
}) {
  const cellColor = isDark ? "#334155" : "#94a3b8"; 
  const sectionColor = isDark ? "#1e293b" : "#cbd5e1"; 
  const ringColor = isDark ? "#475569" : "#94a3b8";
  const textColor = isDark ? "#cbd5e1" : "#1e293b";
  const outlineColor = isDark ? "#020617" : "#ffffff";
  const centerCapColor = isDark ? "#f8fafc" : "#0f172a";

  // Stabilize the position calculation inside render to avoid creating garbage objects on transitions
  const indicatorPosition = useMemo(() => [
    gridPosition[0],
    gridPosition[1] + 0.02,
    gridPosition[2],
  ], [gridPosition]);

  return (
    <group>
      <Grid
        position={gridPosition}
        args={gridArgs}
        cellColor={cellColor}
        sectionColor={sectionColor}
        fadeDistance={fadeDistance}
        cellThickness={1}
        sectionThickness={1.5}
      />

      <GlobalXYZIndicator
        isDark={isDark}
        ringColor={ringColor}
        textColor={textColor}
        outlineColor={outlineColor}
        centerCapColor={centerCapColor}
        position={indicatorPosition}
      />
    </group>
  );
}