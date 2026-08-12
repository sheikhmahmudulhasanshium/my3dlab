"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SUV_CONFIG } from "./suv_config";

export default function Mirrors({
  doorColor = "#475569", // Falls back to match default SUV paint
  trimColor = "#1e293b", // Falls back to match default plastic trim
}) {
  const halfWidth = SUV_CONFIG.bodyHalfWidth || 0.78;

  // Global coordinates of door hinges for orbital tracking
  const frontHingeZ = 0.81;
  const doorX = halfWidth - 0.012; // ~0.768
  const tailgateHingeY = 1.38;
  const tailgateHingeZ = -1.38;

  // Refs for tracking door and tailgate groups
  const flDoorObj = useRef(null);
  const frDoorObj = useRef(null);
  const tailgateObj = useRef(null);

  // Refs for the physical mirrors
  const leftMirrorRef = useRef(null);
  const rightMirrorRef = useRef(null);
  const tailgateMirrorRef = useRef(null);

  // Traverses the scene graph to find and cache the animated door groups
  useFrame((state) => {
    if (!flDoorObj.current || !frDoorObj.current || !tailgateObj.current) {
      state.scene.traverse((child) => {
        if (child.isGroup) {
          const x = child.position.x;
          const y = child.position.y;
          const z = child.position.z;

          // Match Left Front Door hinge position
          if (Math.abs(x - -doorX) < 0.05 && Math.abs(z - frontHingeZ) < 0.05 && y === 0) {
            flDoorObj.current = child;
          }
          // Match Right Front Door hinge position
          if (Math.abs(x - doorX) < 0.05 && Math.abs(z - frontHingeZ) < 0.05 && y === 0) {
            frDoorObj.current = child;
          }
          // Match Tailgate hinge position
          if (Math.abs(x) < 0.05 && Math.abs(y - tailgateHingeY) < 0.05 && Math.abs(z - tailgateHingeZ) < 0.05) {
            tailgateObj.current = child;
          }
        }
      });
    }

    // Dynamic orbital coordinate updates matching door swing arcs
    if (flDoorObj.current && leftMirrorRef.current) {
      const theta = flDoorObj.current.rotation.y;
      leftMirrorRef.current.position.x = -doorX - 0.10 * Math.sin(theta);
      leftMirrorRef.current.position.y = 1.03;
      leftMirrorRef.current.position.z = frontHingeZ - 0.10 * Math.cos(theta);
      leftMirrorRef.current.rotation.y = theta;
    }

    if (frDoorObj.current && rightMirrorRef.current) {
      const theta = frDoorObj.current.rotation.y;
      rightMirrorRef.current.position.x = doorX - 0.10 * Math.sin(theta);
      rightMirrorRef.current.position.y = 1.03;
      rightMirrorRef.current.position.z = frontHingeZ - 0.10 * Math.cos(theta);
      rightMirrorRef.current.rotation.y = theta;
    }

    if (tailgateObj.current && tailgateMirrorRef.current) {
      const phi = tailgateObj.current.rotation.x;
      tailgateMirrorRef.current.position.x = -0.56;
      tailgateMirrorRef.current.position.y = tailgateHingeY - 0.03 * Math.cos(phi) + 0.12 * Math.sin(phi);
      tailgateMirrorRef.current.position.z = tailgateHingeZ - 0.03 * Math.sin(phi) - 0.12 * Math.cos(phi);
      tailgateMirrorRef.current.rotation.x = phi;
    }
  });

  // Shared highly reflective mirror glass material
  const mirrorMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#f8fafc",
    roughness: 0.02,
    metalness: 1.0,
  }), []);

  // Shared dark plastic bezel/trim material
  const trimMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: trimColor,
    roughness: 0.7,
    metalness: 0.15,
  }), [trimColor]);

  // Shared body-color paint material
  const paintMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: doorColor,
    roughness: 0.4,
    metalness: 0.5,
  }), [doorColor]);

  // Amber turn signal strip material
  const indicatorMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#f59e0b",
    emissive: "#d97706",
    emissiveIntensity: 2.5,
  }), []);

  return (
    <group>
      {/* ============================================================
          1. LEFT SIDE VIEW MIRROR
         ============================================================ */}
      <group ref={leftMirrorRef} position={[-halfWidth, 1.03, 0.71]}>
        {/* Triangle sail mount panel */}
        <mesh position={[0.015, 0, 0]} rotation={[0, 0, 0.15]} castShadow>
          <boxGeometry args={[0.015, 0.05, 0.07]} />
          <primitive object={trimMaterial} attach="material" />
        </mesh>

        {/* Support Arm */}
        <mesh position={[-0.04, -0.015, -0.02]} rotation={[0.1, 0.2, 0.15]} castShadow>
          <boxGeometry args={[0.08, 0.022, 0.035]} />
          <primitive object={trimMaterial} attach="material" />
        </mesh>

        {/* Mirror Housing Block */}
        <group position={[-0.10, 0.01, -0.04]} rotation={[0.05, -0.12, 0]}>
          {/* Lower Housing */}
          <mesh position={[0, -0.018, 0]} castShadow>
            <boxGeometry args={[0.13, 0.04, 0.07]} />
            <primitive object={trimMaterial} attach="material" />
          </mesh>

          {/* Upper Housing */}
          <mesh position={[0, 0.018, 0]} castShadow>
            <boxGeometry args={[0.13, 0.045, 0.07]} />
            <primitive object={paintMaterial} attach="material" />
          </mesh>

          {/* Reflective Glass */}
          <mesh position={[0, 0, -0.036]} rotation={[0, Math.PI, 0]} castShadow>
            <planeGeometry args={[0.115, 0.065]} />
            <primitive object={mirrorMaterial} attach="material" />
          </mesh>

          {/* Glass Bezel Ring */}
          <mesh position={[0, 0, -0.037]} rotation={[0, Math.PI, 0]}>
            <ringGeometry args={[0.058, 0.062, 16]} />
            <primitive object={trimMaterial} attach="material" />
          </mesh>

          {/* Turn Signal Indicator */}
          <mesh position={[-0.01, 0.005, 0.036]} castShadow>
            <boxGeometry args={[0.07, 0.01, 0.002]} />
            <primitive object={indicatorMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ============================================================
          2. RIGHT SIDE VIEW MIRROR
         ============================================================ */}
      <group ref={rightMirrorRef} position={[halfWidth, 1.03, 0.71]}>
        {/* Triangle sail mount panel */}
        <mesh position={[-0.015, 0, 0]} rotation={[0, 0, -0.15]} castShadow>
          <boxGeometry args={[0.015, 0.05, 0.07]} />
          <primitive object={trimMaterial} attach="material" />
        </mesh>

        {/* Support Arm */}
        <mesh position={[0.04, -0.015, -0.02]} rotation={[-0.1, -0.2, -0.15]} castShadow>
          <boxGeometry args={[0.08, 0.022, 0.035]} />
          <primitive object={trimMaterial} attach="material" />
        </mesh>

        {/* Mirror Housing Block */}
        <group position={[0.10, 0.01, -0.04]} rotation={[-0.05, 0.12, 0]}>
          {/* Lower Housing */}
          <mesh position={[0, -0.018, 0]} castShadow>
            <boxGeometry args={[0.13, 0.04, 0.07]} />
            <primitive object={trimMaterial} attach="material" />
          </mesh>

          {/* Upper Housing */}
          <mesh position={[0, 0.018, 0]} castShadow>
            <boxGeometry args={[0.13, 0.045, 0.07]} />
            <primitive object={paintMaterial} attach="material" />
          </mesh>

          {/* Reflective Glass */}
          <mesh position={[0, 0, -0.036]} rotation={[0, Math.PI, 0]} castShadow>
            <planeGeometry args={[0.115, 0.065]} />
            <primitive object={mirrorMaterial} attach="material" />
          </mesh>

          {/* Glass Bezel Ring */}
          <mesh position={[0, 0, -0.037]} rotation={[0, Math.PI, 0]}>
            <ringGeometry args={[0.058, 0.062, 16]} />
            <primitive object={trimMaterial} attach="material" />
          </mesh>

          {/* Turn Signal Indicator */}
          <mesh position={[0.01, 0.005, 0.036]} castShadow>
            <boxGeometry args={[0.07, 0.01, 0.002]} />
            <primitive object={indicatorMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ============================================================
          3. INTERIOR REAR-VIEW MIRROR (Static Cabin Placement)
         ============================================================ */}
      <group position={[0, 1.44, 0.30]}>
        <mesh rotation={[0.45, 0, 0]} castShadow>
          <cylinderGeometry args={[0.006, 0.006, 0.05, 8]} />
          <primitive object={trimMaterial} attach="material" />
        </mesh>

        <group position={[0, -0.03, -0.025]} rotation={[0.06, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.055, 0.016]} />
            <primitive object={trimMaterial} attach="material" />
          </mesh>

          <mesh position={[0, 0, -0.009]}>
            <boxGeometry args={[0.21, 0.046, 0.002]} />
            <primitive object={mirrorMaterial} attach="material" />
          </mesh>

          <mesh position={[0, -0.03, 0]}>
            <boxGeometry args={[0.016, 0.008, 0.008]} />
            <primitive object={trimMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ============================================================
          4. TAILGATE ASSIST BLIND-SPOT MIRROR
         ============================================================ */}
      <group ref={tailgateMirrorRef} position={[-0.56, 1.35, -1.5]}>
        <mesh rotation={[0.4, 0.15, -0.3]} castShadow>
          <cylinderGeometry args={[0.007, 0.007, 0.07, 8]} />
          <primitive object={trimMaterial} attach="material" />
        </mesh>

        <group position={[-0.01, -0.035, -0.04]} rotation={[0.35, -0.25, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.026, 16, 16]} />
            <primitive object={trimMaterial} attach="material" />
          </mesh>

          <mesh position={[0, -0.008, 0.018]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.004, 16]} />
            <primitive object={mirrorMaterial} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
}