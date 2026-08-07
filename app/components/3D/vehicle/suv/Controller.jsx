"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { SUV_CONFIG } from "./suv_config"; // Added missing configuration import

export default function Controller({
  steeringAngle,
  setSteeringAngle,
  rotationSpeed,
  setRotationSpeed,
}) {
  return (
    <div className="absolute inset-x-0 bottom-4 md:inset-x-auto md:right-6 md:top-20 z-10 flex p-4 md:p-0 pointer-events-none justify-end">
      <Card className="pointer-events-auto w-full md:w-80 border-border bg-card/60 backdrop-blur-md text-card-foreground shadow-lg">
        <CardHeader className="p-4 border-b border-border/50">
          <CardTitle className="text-sm font-semibold">Tire Mechanics</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Control physical rotation and angle</CardDescription>
        </CardHeader>
        
        <CardContent className="px-4 py-4 space-y-4">
          {/* Steering Angle Control */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              <span>Steering Angle</span>
              <span>{Math.round((steeringAngle * 180) / Math.PI)}°</span>
            </div>
            <input
              type="range"
              min="-0.6"
              max="0.6"
              step="0.05"
              value={steeringAngle}
              onChange={(e) => setSteeringAngle(parseFloat(e.target.value))}
              className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>

          {/* Rotation Rate Control */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              <span>Wheel Rolling Speed</span>
              <span>{rotationSpeed}x</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.2"
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
              className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>
        </CardContent>

        <CardFooter className="border-t border-border px-4 py-3 text-[10px] text-muted-foreground flex justify-between">
          <span>Ground Offset: {SUV_CONFIG?.axleY || 0.44}m</span>
          <span className="font-mono text-sky-500">PHASE 1</span>
        </CardFooter>
      </Card>
    </div>
  );
}