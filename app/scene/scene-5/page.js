"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import JeepAsset from "../../components/3D/vehicle/jeep/JeepAsset";
import GridCompass from "../../components/3D/vehicle/jeep/GridCompass"; 
import MobileController from "../../components/3D/vehicle/jeep/MobileController"; 
import { useKeyboard } from "../../components/3D/vehicle/jeep/KeyboardController";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// --- Dynamic physics and camera scale controller ---
function DrivingController({ 
  engineOn, 
  setEngineOn, 
  lazySusanOn, 
  accelerateActive, 
  steeringRef, 
  wheelRotRef, 
  color,
  mobileControlsRef,
  uiSteeringWheelRef,
  keysPressed,
  activeGear,
  setActiveGear
}) {
  const jeepGroupRef = useRef(null);

  const [lightState, setLightState] = useState({
    isBraking: false,
    areLightsOn: false,
    indicator: "off",
    isReversing: false,
  });

  const physics = useRef({
    x: 0,
    y: 0,
    z: 0,
    speed: 0,
    angle: 0,             
    steeringAngle: 0,     
    targetSteer: 0,
  });

  const syncReactGearState = useCallback((nextGear) => {
    if (activeGear !== nextGear) {
      setTimeout(() => {
        if (typeof setActiveGear === "function") {
          setActiveGear(nextGear);
        }
      }, 0);
    }
  }, [activeGear, setActiveGear]);

  useFrame((state, delta) => {
    const car = jeepGroupRef.current;
    if (!car) return;

    // Calculate Aspect Ratio zoom factor dynamically (Safe for native mobile fullscreen)
    const aspect = state.size.width / state.size.height;
    const responsiveZoomFactor = aspect < 1.0 ? Math.max(1.0, 1.0 / aspect) : 1.0;

    if (lazySusanOn) {
      physics.current.speed = 0;
      physics.current.steeringAngle = 0;
      steeringRef.current = 0;
      
      car.rotation.y += delta * 0.25;
      car.position.set(0, 0, 0);

      // Dynamically scale the Showroom radius and height to prevent car from overflowing in portrait
      const showroomRadius = 7.2 * responsiveZoomFactor;
      const showroomHeight = 3.2 * responsiveZoomFactor;

      state.camera.position.x = Math.sin(state.clock.getElapsedTime() * 0.15) * showroomRadius;
      state.camera.position.z = Math.cos(state.clock.getElapsedTime() * 0.15) * showroomRadius;
      state.camera.position.y = showroomHeight;
      state.camera.lookAt(0, 0.5, 0);

      if (lightState.indicator !== "hazard" || lightState.areLightsOn) {
        setLightState({
          isBraking: false,
          areLightsOn: false,
          indicator: "hazard",
          isReversing: false,
        });
      }
      return;
    }

    let driveInput = 0;
    let steerInput = 0;
    let isBraking = false;
    let isTurbo = accelerateActive;

    // Read keyboard controls
    const keys = keysPressed.current;
    if (keys["ArrowUp"]) {
      syncReactGearState("D");
      driveInput = 1;
    }
    if (keys["ArrowDown"]) {
      if (physics.current.speed > 0.15) {
        isBraking = true;
      } else {
        syncReactGearState("R");
        driveInput = -1;
      }
    }
    
    // Read keyboard steering
    let keyboardSteer = 0;
    if (keys["ArrowLeft"]) keyboardSteer = 1;
    if (keys["ArrowRight"]) keyboardSteer = -1;

    // Read mobile controls (mixed simultaneously with physical keyboard)
    const mobile = mobileControlsRef.current;
    let mobileSteer = 0;
    let isMobileDragging = false;

    if (mobile) {
      isMobileDragging = !!mobile.isDragging;
      if (mobile.steering !== 0) {
        mobileSteer = -mobile.steering; 
      }
      if (mobile.accelerate) {
        if (activeGear === "D") driveInput = 1;
        if (activeGear === "R") driveInput = -1;
      }
      if (mobile.brake) {
        isBraking = true;
      }
    }

    // Combine Steering Inputs
    if (keyboardSteer !== 0) {
      steerInput = keyboardSteer;
    } else {
      steerInput = mobileSteer;
    }

    // Power steering calculations
    const targetSteerAngle = steerInput * 0.45;
    physics.current.steeringAngle += (targetSteerAngle - physics.current.steeringAngle) * 8.0 * delta;
    steeringRef.current = physics.current.steeringAngle;

    // Smooth UI steering wheel return-to-center physics (Auto-focus on release)
    if (uiSteeringWheelRef.current) {
      if (isMobileDragging && keyboardSteer === 0) {
        // Hand is actively dragging the mobile wheel - keep absolute real-time hand coordinates
      } else {
        // Physics return calculations: smoothly transition the UI wheel back to center or follow active keys
        const steeringRatio = physics.current.steeringAngle / 0.45; // -1 to +1
        const uiRotationDegrees = -steeringRatio * 140; 
        uiSteeringWheelRef.current.style.transform = `rotate(${uiRotationDegrees}deg)`;
      }
    }

    if (driveInput !== 0 && !engineOn) {
      setEngineOn(true);
    }

    const accelRate = isTurbo ? 12.0 : 4.0;
    const frictionDecel = isBraking ? 12.0 : 2.0;
    const maxSpeedLimit = isTurbo ? 6.0 : 3.0;

    const canMove = activeGear === "D" || activeGear === "R";

    if (engineOn && driveInput !== 0 && !isBraking && canMove) {
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

    if (Math.abs(physics.current.speed) > 0.05) {
      const turnDirectionFactor = physics.current.speed > 0 ? 1 : -1;
      physics.current.angle += physics.current.steeringAngle * turnDirectionFactor * (Math.abs(physics.current.speed) * 0.25) * delta * 2.5;
    }

    wheelRotRef.current += (physics.current.speed / 0.45) * delta;

    physics.current.x += Math.sin(physics.current.angle) * physics.current.speed * delta;
    physics.current.z += Math.cos(physics.current.angle) * physics.current.speed * delta;

    car.position.x = physics.current.x;
    car.position.z = physics.current.z;
    car.rotation.y = physics.current.angle;

    const nextReversing = physics.current.speed < -0.05;
    const nextLights = engineOn; 

    let nextIndicator = "off";
    if (steerInput < -0.15) {
      nextIndicator = "left"; 
    } else if (steerInput > 0.15) {
      nextIndicator = "right";
    }

    if (
      lightState.isBraking !== isBraking ||
      lightState.areLightsOn !== nextLights ||
      lightState.indicator !== nextIndicator ||
      lightState.isReversing !== nextReversing
    ) {
      setLightState({
        isBraking,
        areLightsOn: nextLights,
        indicator: nextIndicator,
        isReversing: nextReversing,
      });
    }

    // Camera aspect responsive offsets for driving mode
    const targetCameraPosition = new THREE.Vector3(
      physics.current.x - Math.sin(physics.current.angle) * (6.2 * responsiveZoomFactor),
      physics.current.y + (3.0 * responsiveZoomFactor),
      physics.current.z - Math.cos(physics.current.angle) * (6.2 * responsiveZoomFactor)
    );
    
    state.camera.position.lerp(targetCameraPosition, 0.1);
    state.camera.lookAt(physics.current.x, physics.current.y + 0.7, physics.current.z);
  });

  return (
    <group ref={jeepGroupRef}>
      <JeepAsset 
        engineOn={engineOn} 
        steeringAngleRef={steeringRef} 
        wheelRotationRef={wheelRotRef} 
        color={color} 
        isBraking={lightState.isBraking}
        areLightsOn={lightState.areLightsOn}
        indicator={lightState.indicator}
        isReversing={lightState.isReversing}
      />
    </group>
  );
}

// --- Main Page Component ---
export default function SceneFourPage() {
  const [engineOn, setEngineOn] = useState(false);
  const [lazySusanOn, setLazySusanOn] = useState(false);
  const [accelerateActive, setAccelerateActive] = useState(false);
  const [color, setColor] = useState("#fbbf24"); 
  const [activeGear, setActiveGear] = useState("D"); 

  const steeringRef = useRef(0);
  const wheelRotRef = useRef(0);
  const containerRef = useRef(null); 
  const uiSteeringWheelRef = useRef(null); 

  const keysPressed = useKeyboard(); 

  const mobileControlsRef = useRef({
    steering: 0,
    accelerate: false,
    brake: false,
    gear: "D",
    isDragging: false
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      setLazySusanOn(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleToggleShowroom = useCallback(() => {
    if (!lazySusanOn) {
      setLazySusanOn(true);
      if (containerRef.current) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.warn("Could not trigger native fullscreen:", err);
        });
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.warn("Could not exit native fullscreen:", err);
        });
      }
      setLazySusanOn(false);
    }
  }, [lazySusanOn]);

  useEffect(() => {
    const handleGlobalKeys = (e) => {
      if (e.key === "s" || e.key === "S") setEngineOn((prev) => !prev);
      if (e.key === "l" || e.key === "L") handleToggleShowroom();
      if (e.key === " ") setAccelerateActive(true);
    };

    const handleGlobalKeyUp = (e) => {
      if (e.key === " ") setAccelerateActive(false);
    };

    window.addEventListener("keydown", handleGlobalKeys);
    window.addEventListener("keyup", handleGlobalKeyUp);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeys);
      window.removeEventListener("keyup", handleGlobalKeyUp);
    };
  }, [handleToggleShowroom]);

  return (
    <main ref={containerRef} className="relative min-h-screen w-screen overflow-hidden bg-slate-950 transition-colors duration-200">
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 5, 8], fov: 60 }} 
          shadows={{ type: THREE.PCFShadowMap }}
        >
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
            setEngineOn={setEngineOn}
            lazySusanOn={lazySusanOn}
            accelerateActive={accelerateActive}
            steeringRef={steeringRef}
            wheelRotRef={wheelRotRef}
            color={color}
            mobileControlsRef={mobileControlsRef}
            uiSteeringWheelRef={uiSteeringWheelRef}
            keysPressed={keysPressed}
            activeGear={activeGear}
            setActiveGear={setActiveGear}
          />

          <GridCompass />

          <OrbitControls enabled={lazySusanOn} enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 2.1} />
        </Canvas>
      </div>

      {/* Desktop HUD Guide Card */}
      {!lazySusanOn && (
        <div className="absolute inset-x-0 bottom-0 z-10 hidden lg:flex p-12 pointer-events-none justify-end">
          <Card className="pointer-events-auto w-full max-w-sm border-slate-800 bg-slate-900/60 backdrop-blur-md text-white shadow-lg">
            <CardHeader className="p-5">
              <CardTitle className="text-base font-semibold flex justify-between items-center">
                <span>Jeep Wrangler 3D</span>
                <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${engineOn ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                  {engineOn ? "Engine Running" : "Engine Off"}
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Drive or exhibit your interactive vehicle model.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-5 pb-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 border-y border-slate-800 py-3">
                <div>
                  <span className="font-semibold block text-slate-400 text-[10px] uppercase">Steering & Drive</span>
                  <span className="font-mono text-xs text-sky-400">Arrow Keys</span>
                </div>
                <div>
                  <span className="font-semibold block text-slate-400 text-[10px] uppercase">Ignition Toggle</span>
                  <span className="font-mono text-xs text-sky-400">[S] key</span>
                </div>
                <div>
                  <span className="font-semibold block text-slate-400 text-[10px] uppercase">Turbo Accel</span>
                  <span className="font-mono text-xs text-sky-400">[Spacebar]</span>
                </div>
                <div>
                  <span className="font-semibold block text-slate-400 text-[10px] uppercase">Showroom Mode</span>
                  <span className="font-mono text-xs text-sky-400">[L] key</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Body Paint</span>
                <div className="flex gap-1.5">
                  <button className="w-5 h-5 rounded-full bg-amber-500 border border-slate-700" onClick={() => setColor("#fbbf24")} />
                  <button className="w-5 h-5 rounded-full bg-red-600 border border-slate-700" onClick={() => setColor("#dc2626")} />
                  <button className="w-5 h-5 rounded-full bg-sky-500 border border-slate-700" onClick={() => setColor("#0ea5e9")} />
                  <button className="w-5 h-5 rounded-full bg-emerald-600 border border-slate-700" onClick={() => setColor("#059669")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Exit Showroom / Fullscreen button */}
      {lazySusanOn && (
        <div className="absolute top-6 right-6 z-50 pointer-events-auto">
          <button
            onClick={handleToggleShowroom}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-950/85 border border-slate-700/80 text-white shadow-xl hover:bg-slate-900 backdrop-blur-md transition-all active:scale-95"
          >
            Exit Full Screen (Esc)
          </button>
        </div>
      )}

      {/* Mobile HUD overlay */}
      {!lazySusanOn && (
        <MobileController 
          engineOn={engineOn}
          setEngineOn={setEngineOn}
          mobileControlsRef={mobileControlsRef}
          uiSteeringWheelRef={uiSteeringWheelRef}
          activeGear={activeGear}
          setActiveGear={setActiveGear}
          lazySusanOn={lazySusanOn}
          onToggleShowroom={handleToggleShowroom}
        />
      )}
    </main>
  );
}