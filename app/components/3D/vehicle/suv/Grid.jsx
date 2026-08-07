"use client";

import React from "react";
import { useTheme } from "next-themes";

export default function Grid() {
  const { resolvedTheme } = useTheme();

  // Determine grid colors based on resolved theme
  const gridCenterColor = resolvedTheme === "light" ? "#0284c7" : "#38bdf8"; 
  const gridLineColor = resolvedTheme === "light" ? "#cbd5e1" : "#334155";

  return (
    <gridHelper 
      args={[30, 30, gridCenterColor, gridLineColor]} 
      position={[0, 0, 0]} 
    />
  );
}