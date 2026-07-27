// app/scene/scene-4/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";

import JeepAsset from "../../components/3D/JeepAsset";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function DrivingController({ engineOn, lazySusanOn, accelerateActive, steeringRef, wheelRotRef, color }) {
  const jeepGroupRef = useRef(null);

  const physics = useRef({
    x: 0,
    y: 0, // <-- Added coordinate to fix NaN calculations
    z: 0,
    speed: 0,
    angle: 0,             
    steeringAngle: 0,     
    targetSteer: 0,
  });

  const keysPressed = useRef({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    const car = jeepGroupRef.current;
    if (!car) return;

    if (lazySusanOn) {
      physics.current.speed = 0;
      physics.current.steeringAngle = 0;
      steeringRef.current = 0;
      
      car.rotation.y += delta * 0.25;
      car.position.set(0, 0, 0);

      // Rotate camera dynamically around showroom platform
      state.camera.position.x = Math.sin(state.clock.getElapsedTime() * 0.15) * 6;
      state.camera.position.z = Math.cos(state.clock.getElapsedTime() * 0.15) * 6;
      state.camera.position.y = 3;
      state.camera.lookAt(0, 0.5, 0);
      return;
    }

    // Inputs
    let driveInput = 0;
    if (keysPressed.current["ArrowUp"]) driveInput = 1;
    if (keysPressed.current["ArrowDown"]) driveInput = -1;

    let steerInput = 0;
    if (keysPressed.current["ArrowLeft"]) steerInput = 1;
    if (keysPressed.current["ArrowRight"]) steerInput = -1;

    const accelRate = accelerateActive ? 12.0 : 4.0;
    const frictionDecel = 2.0;
    const maxSpeedLimit = accelerateActive ? 6.0 : 3.0;

    // Movement Calculations
    if (engineOn && driveInput !== 0) {
      physics.current.speed += driveInput * accelRate * delta;
      if (physics.current.speed > maxSpeedLimit) physics.current.speed = maxSpeedLimit;
      if (physics.current.speed < -maxSpeedLimit * 0.5) physics.current.speed = -maxSpeedLimit * 0.5;
    } else {
      if (physics.current.speed > 0) {
        physics.current.speed = Math.max(0, physics.current.speed - frictionDecel * delta);
      } else if (physics.current.speed < 0) {
        physics.current.speed = Math.min(0, physics.current.speed + frictionDecel * delta);
      }
    }

    // Steering
    const targetSteerAngle = steerInput * 0.45;
    physics.current.steeringAngle += (targetSteerAngle - physics.current.steeringAngle) * 8.0 * delta;
    steeringRef.current = physics.current.steeringAngle;

    if (Math.abs(physics.current.speed) > 0.05) {
      const turnDirectionFactor = physics.current.speed > 0 ? 1 : -1;
      physics.current.angle += physics.current.steeringAngle * turnDirectionFactor * (Math.abs(physics.current.speed) * 0.25) * delta * 2.5;
    }

    // Rolling spin value
    wheelRotRef.current += (physics.current.speed / 0.45) * delta;

    // Coordinate translation
    physics.current.x += Math.sin(physics.current.angle) * physics.current.speed * delta;
    physics.current.z += Math.cos(physics.current.angle) * physics.current.speed * delta;

    // Apply values to 3D Container mesh
    car.position.x = physics.current.x;
    car.position.z = physics.current.z;
    car.rotation.y = physics.current.angle;

    // Smooth Third-Person camera follow offsets
    const targetCameraPosition = new THREE.Vector3(
      physics.current.x - Math.sin(physics.current.angle) * 5,
      physics.current.y + 2.5,
      physics.current.z - Math.cos(physics.current.angle) * 5
    );
    state.camera.position.lerp(targetCameraPosition, 0.1);
    state.camera.lookAt(physics.current.x, physics.current.y + 0.6, physics.current.z);
  });

  return (
    <group ref={jeepGroupRef}>
      <JeepAsset 
        engineOn={engineOn} 
        steeringAngleRef={steeringRef} 
        wheelRotationRef={wheelRotRef} 
        color={color} 
      />
    </group>
  );
}

export default function SceneFourPage() {
  const [engineOn, setEngineOn] = useState(false);
  const [lazySusanOn, setLazySusanOn] = useState(false);
  const [accelerateActive, setAccelerateActive] = useState(false);
  const [color, setColor] = useState("#fbbf24"); 

  const steeringRef = useRef(0);
  const wheelRotRef = useRef(0);

  useEffect(() => {
    const handleGlobalKeys = (e) => {
      if (e.key === "s" || e.key === "S") {
        setEngineOn((prev) => !prev);
      }
      if (e.key === "l" || e.key === "L") {
        setLazySusanOn((prev) => !prev);
      }
      if (e.key === " ") {
        setAccelerateActive(true);
      }
    };

    const handleGlobalKeyUp = (e) => {
      if (e.key === " ") {
        setAccelerateActive(false);
      }
    };

    window.addEventListener("keydown", handleGlobalKeys);
    window.addEventListener("keyup", handleGlobalKeyUp);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeys);
      window.removeEventListener("keyup", handleGlobalKeyUp);
    };
  }, []);

  return (
    <main className="relative min-h-screen w-screen overflow-hidden pt-16 bg-background transition-colors duration-200">
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 5, 8], fov: 60 }} shadows={{ type: THREE.PCFShadowMap }}>
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[15, 20, 15]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024} 
          />
          <pointLight position={[-10, 10, -10]} intensity={0.4} />

          <DrivingController 
            engineOn={engineOn}
            lazySusanOn={lazySusanOn}
            accelerateActive={accelerateActive}
            steeringRef={steeringRef}
            wheelRotRef={wheelRotRef}
            color={color}
          />

          <Grid 
            position={[0, 0, 0]} 
            args={[100, 100]} 
            cellColor="#4b5563" 
            sectionColor="#1f2937" 
            fadeDistance={40} 
            cellThickness={1}
            sectionThickness={1.5}
          />
          
          {/* OrbitControls is disabled while driving so it does not override camera-following actions */}
          <OrbitControls enabled={lazySusanOn} enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 2.1} />
        </Canvas>
      </div>

      {/* Controller Guide HUD Card */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex p-6 md:p-12 pointer-events-none justify-start md:justify-end">
        <Card className="pointer-events-auto w-full max-w-sm border-border bg-card/60 backdrop-blur-md text-card-foreground shadow-lg">
          <CardHeader className="p-5">
            <CardTitle className="text-base font-semibold flex justify-between items-center">
              <span>Jeep Wrangler 3D</span>
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${engineOn ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                {engineOn ? "Engine Running" : "Engine Off"}
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Drive, drift, or exhibit your interactive vehicle model.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-5 pb-4 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-2 border-y border-border/50 py-3">
              <div>
                <span className="font-semibold block text-muted-foreground text-[10px] uppercase">Steering & Drive</span>
                <span className="font-mono text-xs text-primary">Arrow Keys</span>
              </div>
              <div>
                <span className="font-semibold block text-muted-foreground text-[10px] uppercase">Ignition Toggle</span>
                <span className="font-mono text-xs text-primary">[S] key</span>
              </div>
              <div>
                <span className="font-semibold block text-muted-foreground text-[10px] uppercase">Turbo Accel</span>
                <span className="font-mono text-xs text-primary">[Spacebar]</span>
              </div>
              <div>
                <span className="font-semibold block text-muted-foreground text-[10px] uppercase">Showroom Rotation</span>
                <span className="font-mono text-xs text-primary">[L] key</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Body Paint</span>
              <div className="flex gap-1.5">
                <button className="w-5 h-5 rounded-full bg-amber-500 border border-border" onClick={() => setColor("#fbbf24")} />
                <button className="w-5 h-5 rounded-full bg-red-600 border border-border" onClick={() => setColor("#dc2626")} />
                <button className="w-5 h-5 rounded-full bg-sky-500 border border-border" onClick={() => setColor("#0ea5e9")} />
                <button className="w-5 h-5 rounded-full bg-emerald-600 border border-border" onClick={() => setColor("#059669")} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}