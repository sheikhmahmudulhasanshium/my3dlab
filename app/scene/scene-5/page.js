"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";

import JeepAsset from "../../components/3D/vehicle/JeepAsset";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// --- Mobile Controller Component with Stylish Wheel & Showroom Toggle ---
function MobileController({ 
  engineOn, 
  setEngineOn, 
  lazySusanOn, 
  onToggleShowroom, 
  mobileControlsRef 
}) {
  const [activeGear, setActiveGear] = useState("D"); // Default gear set to "D"
  const [accelerating, setAccelerating] = useState(false);
  const [braking, setBraking] = useState(false);
  const [steerValue, setSteerValue] = useState(0); 

  // Steering wheel rotation angle state (in radians)
  const [wheelRotation, setWheelRotation] = useState(0); 

  const wheelRef = useRef(null);
  const isInteracting = useRef(false);
  const startPointerAngle = useRef(0);
  const startWheelRotation = useRef(0);
  const springBackId = useRef(null);

  // Sync state changes with the shared ref read by the physics engine
  useEffect(() => {
    if (mobileControlsRef.current) {
      mobileControlsRef.current.steering = steerValue;
      mobileControlsRef.current.accelerate = accelerating;
      mobileControlsRef.current.brake = braking;
      mobileControlsRef.current.gear = activeGear;
    }
  }, [steerValue, accelerating, braking, activeGear, mobileControlsRef]);

  // Clean up animation loops on unmount
  useEffect(() => {
    return () => {
      if (springBackId.current) cancelAnimationFrame(springBackId.current);
    };
  }, []);

  const handleWheelPointerDown = (e) => {
    isInteracting.current = true;
    if (springBackId.current) cancelAnimationFrame(springBackId.current);

    e.currentTarget.setPointerCapture(e.pointerId);

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    startPointerAngle.current = Math.atan2(dy, dx);
    startWheelRotation.current = wheelRotation;
  };

  const handleWheelPointerMove = (e) => {
    if (!isInteracting.current || !wheelRef.current) return;

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const currentPointerAngle = Math.atan2(dy, dx);
    let angleDiff = currentPointerAngle - startPointerAngle.current;

    // Angle wrap alignment boundary
    if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    const maxRotation = 2.2; // ~126 degrees total turn limit
    let newRotation = startWheelRotation.current + angleDiff;
    newRotation = Math.max(-maxRotation, Math.min(maxRotation, newRotation));

    setWheelRotation(newRotation);
    setSteerValue(newRotation / maxRotation); 
  };

  const handleWheelPointerUp = (e) => {
    isInteracting.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}

    // Dynamic mechanical spring auto-centering animation
    const animateSpring = () => {
      if (isInteracting.current) return;

      setWheelRotation((prev) => {
        if (Math.abs(prev) < 0.05) {
          setSteerValue(0);
          return 0;
        }
        const next = prev * 0.82; // Friction decay
        setSteerValue(next / 2.2);
        springBackId.current = requestAnimationFrame(animateSpring);
        return next;
      });
    };
    springBackId.current = requestAnimationFrame(animateSpring);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 select-none touch-none pointer-events-none lg:hidden flex flex-col justify-end h-56 bg-linear-to-t from-slate-950/90 via-slate-950/40 to-transparent">
      
      {/* Top Section: Gears, Engine, and Showcase controls */}
      <div className="flex justify-between items-end w-full mb-4 pointer-events-auto">
        
        {/* Left Side: Steering Wheel */}
        <div className="flex flex-col gap-1.5 items-center">
          <div 
            ref={wheelRef}
            onPointerDown={handleWheelPointerDown}
            onPointerMove={handleWheelPointerMove}
            onPointerUp={handleWheelPointerUp}
            onPointerCancel={handleWheelPointerUp}
            style={{ transform: `rotate(${wheelRotation}rad)` }}
            className="w-28 h-28 rounded-full cursor-grab active:cursor-grabbing touch-none flex items-center justify-center filter drop-shadow-xl"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="44" stroke="#1e293b" strokeWidth="8" fill="none" />
              <circle cx="50" cy="50" r="40" stroke="#0f172a" strokeWidth="1.5" fill="none" />
              <path d="M 12 50 L 34 50 L 36 53 L 14 53 Z" fill="#475569" />
              <path d="M 88 50 L 66 50 L 64 53 L 86 53 Z" fill="#475569" />
              <path d="M 47 62 L 53 62 L 51.5 86 L 48.5 86 Z" fill="#334155" />
              <path d="M 48 6 L 52 6 L 52 14 L 48 14 Z" fill="#f59e0b" />
              <circle cx="50" cy="50" r="14" fill="#1e293b" stroke="#334155" strokeWidth="2.5" />
              <text x="50" y="52" fontSize="5.5" fontWeight="900" fill="#64748b" textAnchor="middle" letterSpacing="0.5">
                JEEP
              </text>
            </svg>
          </div>
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">Steer Wheel</span>
        </div>

        {/* Center Section: Gears Column */}
        <div className="flex flex-col gap-1 bg-slate-900/90 border border-slate-700/60 p-1 rounded-xl">
          {["P", "R", "N", "D"].map((gear) => (
            <button
              key={gear}
              className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center transition-all ${
                activeGear === gear
                  ? "bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
              onClick={() => setActiveGear(gear)}
            >
              {gear}
            </button>
          ))}
        </div>

        {/* Right Section: System Ignition, Turn Showcase, and Drive Pedals */}
        <div className="flex flex-col gap-3 items-end">
          
          {/* Dashboard Ignition & Showcase System Row */}
          <div className="flex gap-2">
            <button
              onClick={onToggleShowroom}
              className={`px-3 py-1.5 rounded-lg font-bold text-[9px] border uppercase tracking-wider transition-all flex items-center gap-1 ${
                lazySusanOn
                  ? "bg-sky-500/20 border-sky-500 text-sky-400 shadow-lg shadow-sky-500/10"
                  : "bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700"
              }`}
            >
              🔄 Showroom
            </button>

            <button
              className={`px-3 py-1.5 rounded-lg font-bold text-[9px] border uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                engineOn
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                  : "bg-rose-500/20 border-rose-500 text-rose-400"
              }`}
              onClick={() => setEngineOn(!engineOn)}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${engineOn ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
              {engineOn ? "ON" : "OFF"}
            </button>
          </div>

          {/* Pedals */}
          <div className="flex gap-2">
            <div className="flex flex-col items-center gap-0.5">
              <button
                onPointerDown={() => setBraking(true)}
                onPointerUp={() => setBraking(false)}
                onPointerLeave={() => setBraking(false)}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center text-sm font-black transition-all touch-none ${
                  braking
                    ? "bg-rose-500 text-white border-rose-400 scale-95 shadow-md shadow-rose-500/20"
                    : "bg-slate-900 text-rose-400 border-rose-500/30"
                }`}
              >
                B
              </button>
              <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-widest">Brake</span>
            </div>

            <div className="flex flex-col items-center gap-0.5">
              <button
                onPointerDown={() => setAccelerating(true)}
                onPointerUp={() => setAccelerating(false)}
                onPointerLeave={() => setAccelerating(false)}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center text-sm font-black transition-all touch-none ${
                  accelerating
                    ? "bg-emerald-500 text-white border-emerald-400 scale-95 shadow-md shadow-emerald-500/20"
                    : "bg-slate-900 text-emerald-400 border-emerald-500/30"
                }`}
              >
                A
              </button>
              <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-widest">Gas</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Dynamic physics and model driver controller ---
function DrivingController({ 
  engineOn, 
  setEngineOn, 
  lazySusanOn, 
  accelerateActive, 
  steeringRef, 
  wheelRotRef, 
  color,
  mobileControlsRef 
}) {
  const jeepGroupRef = useRef(null);

  const physics = useRef({
    x: 0,
    y: 0,
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
      state.camera.position.x = Math.sin(state.clock.getElapsedTime() * 0.15) * 7.5;
      state.camera.position.z = Math.cos(state.clock.getElapsedTime() * 0.15) * 7.5;
      state.camera.position.y = 3.2;
      state.camera.lookAt(0, 0.5, 0);
      return;
    }

    // --- Resolve Active Inputs (Keyboard / Pointer) ---
    let driveInput = 0;
    let steerInput = 0;
    let isBraking = false;
    let isTurbo = accelerateActive;

    // Keyboard checks
    if (keysPressed.current["ArrowUp"]) driveInput = 1;
    if (keysPressed.current["ArrowDown"]) driveInput = -1;
    if (keysPressed.current["ArrowLeft"]) steerInput = 1;
    if (keysPressed.current["ArrowRight"]) steerInput = -1;

    // Mobile Overlay check
    const mobile = mobileControlsRef.current;
    if (mobile) {
      if (mobile.steering !== 0) {
        steerInput = -mobile.steering;
      }
      if (mobile.accelerate) {
        if (mobile.gear === "D") driveInput = 1;
        if (mobile.gear === "R") driveInput = -1;
      }
      if (mobile.brake) {
        isBraking = true;
      }
    }

    // Auto-Ignition
    if (driveInput !== 0 && !engineOn) {
      setEngineOn(true);
    }

    // Deceleration limits
    const accelRate = isTurbo ? 12.0 : 4.0;
    const frictionDecel = isBraking ? 12.0 : 2.0;
    const maxSpeedLimit = isTurbo ? 6.0 : 3.0;

    // Movement Calculations
    if (engineOn && driveInput !== 0 && !isBraking) {
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
      physics.current.x - Math.sin(physics.current.angle) * 6.2,
      physics.current.y + 3.0,
      physics.current.z - Math.cos(physics.current.angle) * 6.2
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

  const steeringRef = useRef(0);
  const wheelRotRef = useRef(0);
  const containerRef = useRef(null); // Full-screen element ref

  const mobileControlsRef = useRef({
    steering: 0,
    accelerate: false,
    brake: false,
    gear: "D" 
  });

  // Native Fullscreen API detector synchronizing state with user pressing Esc key
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setLazySusanOn(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleToggleShowroom = useCallback(() => {
    if (!lazySusanOn) {
      setLazySusanOn(true);
      if (containerRef.current) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.log("Could not trigger native fullscreen mode:", err);
        });
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.log("Could not exit native fullscreen mode:", err);
        });
      }
      setLazySusanOn(false);
    }
  }, [lazySusanOn]);

  useEffect(() => {
    const handleGlobalKeys = (e) => {
      if (e.key === "s" || e.key === "S") {
        setEngineOn((prev) => !prev);
      }
      if (e.key === "l" || e.key === "L") {
        handleToggleShowroom();
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
  }, [handleToggleShowroom]);

  return (
    <main ref={containerRef} className="relative min-h-screen w-screen overflow-hidden bg-background transition-colors duration-200">
      
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
            setEngineOn={setEngineOn}
            lazySusanOn={lazySusanOn}
            accelerateActive={accelerateActive}
            steeringRef={steeringRef}
            wheelRotRef={wheelRotRef}
            color={color}
            mobileControlsRef={mobileControlsRef}
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
          
          <OrbitControls enabled={lazySusanOn} enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 2.1} />
        </Canvas>
      </div>

      {/* Controller Guide HUD Card (Completely hidden during Theater Fullscreen) */}
      {!lazySusanOn && (
        <div className="absolute inset-x-0 bottom-0 z-10 hidden lg:flex p-6 md:p-12 pointer-events-none justify-start md:justify-end">
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
      )}

      {/* YT-Style Exit Theater Button */}
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

      {/* Mobile-only Controller Overlay */}
      {!lazySusanOn && (
        <MobileController 
          engineOn={engineOn}
          setEngineOn={setEngineOn}
          lazySusanOn={lazySusanOn}
          onToggleShowroom={handleToggleShowroom}
          mobileControlsRef={mobileControlsRef}
        />
      )}
    </main>
  );
}