"use client";

import { useState, useRef, useEffect } from "react";

export default function MobileController({ 
  engineOn, 
  setEngineOn, 
  onControlChange 
}) {
  const [activeGear, setActiveGear] = useState("N"); // P, R, N, D
  const [accelerating, setAccelerating] = useState(false);
  const [braking, setBraking] = useState(false);
  const [steerValue, setSteerValue] = useState(0); // -1 (Left) to 1 (Right)

  const trackRef = useRef(null);
  const isTrackingSteer = useRef(false);

  // Send control updates back to the parent animation loop
  useEffect(() => {
    if (onControlChange) {
      onControlChange({
        steering: steerValue,
        accelerate: accelerating,
        brake: braking,
        gear: activeGear,
        engineOn: engineOn
      });
    }
  }, [steerValue, accelerating, braking, activeGear, engineOn, onControlChange]);

  // Handle Steering Touch Input
  const handleSteerTouchStart = (e) => {
    isTrackingSteer.current = true;
    handleSteerTouchMove(e);
  };

  const handleSteerTouchMove = (e) => {
    if (!isTrackingSteer.current || !trackRef.current) return;
    
    const touch = e.touches[0];
    const rect = trackRef.current.getBoundingClientRect();
    
    // Calculate relative horizontal position inside the slider track (0 to 1)
    let relativeX = (touch.clientX - rect.left) / rect.width;
    relativeX = Math.max(0, Math.min(1, relativeX)); // Clamp between 0 and 1
    
    // Map to -1 (left) to 1 (right)
    const rawSteerValue = (relativeX - 0.5) * 2;
    setSteerValue(parseFloat(rawSteerValue.toFixed(2)));
  };

  const handleSteerTouchEnd = () => {
    isTrackingSteer.current = false;
    setSteerValue(0); // Reset steering to center when released
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 md:p-6 select-none touch-none pointer-events-none lg:hidden flex flex-col justify-end h-48 bg-linear-to-t from-slate-950/80 to-transparent">
      
      {/* Top Row: Engine switch & Gear Selectors */}
      <div className="flex justify-between items-center w-full mb-4 pointer-events-auto">
        
        {/* Gear Box (P, R, N, D) */}
        <div className="flex gap-1.5 bg-slate-900/80 border border-slate-700/50 p-1.5 rounded-xl">
          {["P", "R", "N", "D"].map((gear) => (
            <button
              key={gear}
              className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${
                activeGear === gear
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
              onClick={() => setActiveGear(gear)}
            >
              {gear}
            </button>
          ))}
        </div>

        {/* Engine Toggle Button (ON/OFF) */}
        <button
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs border uppercase tracking-wider transition-all flex items-center gap-2 ${
            engineOn
              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
              : "bg-rose-500/20 border-rose-500 text-rose-400"
          }`}
          onClick={() => setEngineOn(!engineOn)}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${engineOn ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
          {engineOn ? "Engine On" : "Engine Off"}
        </button>
      </div>

      {/* Bottom Row: Slider Control (Left Side) & Action Buttons (Right Side) */}
      <div className="flex justify-between items-center w-full pointer-events-auto">
        
        {/* Left Side: Steering Slider Control */}
        <div className="flex flex-col gap-1 items-center">
          <div 
            ref={trackRef}
            onTouchStart={handleSteerTouchStart}
            onTouchMove={handleSteerTouchMove}
            onTouchEnd={handleSteerTouchEnd}
            className="w-48 h-12 bg-slate-900/80 border border-slate-700/50 rounded-2xl relative flex items-center cursor-pointer"
          >
            {/* Center reference notch */}
            <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-700/50" />
            
            {/* Slideable Joystick Knob */}
            <div 
              style={{ left: `calc(${(steerValue + 1) * 50}% - 20px)` }}
              className="absolute w-10 h-10 bg-sky-500 hover:bg-sky-400 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/30 border border-sky-300/20 transition-shadow duration-100"
            >
              <span className="text-white text-lg font-bold select-none">↔</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Steering</span>
        </div>

        {/* Right Side: [B] Brake and [A] Gas Action Buttons */}
        <div className="flex gap-4">
          {/* Button B (Brake) */}
          <div className="flex flex-col items-center gap-1">
            <button
              onTouchStart={() => setBraking(true)}
              onTouchEnd={() => setBraking(false)}
              className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-lg font-black transition-all ${
                braking
                  ? "bg-rose-500 text-white border-rose-400 scale-95 shadow-lg shadow-rose-500/30"
                  : "bg-slate-900 text-rose-400 border-rose-500/30 hover:bg-slate-800"
              }`}
            >
              B
            </button>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Brake</span>
          </div>

          {/* Button A (Accelerate) */}
          <div className="flex flex-col items-center gap-1">
            <button
              onTouchStart={() => setAccelerating(true)}
              onTouchEnd={() => setAccelerating(false)}
              className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-lg font-black transition-all ${
                accelerating
                  ? "bg-emerald-500 text-white border-emerald-400 scale-95 shadow-lg shadow-emerald-500/30"
                  : "bg-slate-900 text-emerald-400 border-emerald-500/30 hover:bg-slate-800"
              }`}
            >
              A
            </button>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Gas</span>
          </div>
        </div>

      </div>
    </div>
  );
}