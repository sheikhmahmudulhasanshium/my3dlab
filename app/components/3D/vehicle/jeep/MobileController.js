"use client";

import { useRef, useEffect, useCallback } from "react";

export default function MobileController({ 
  engineOn = false, 
  setEngineOn, 
  mobileControlsRef,
  uiSteeringWheelRef,
  activeGear = "D",
  setActiveGear,
  lazySusanOn = false,
  onToggleShowroom,
  color,
  setColor
}) {
  const wheelTrackRef = useRef(null);
  const isTrackingSteer = useRef(false);

  // Send control updates back to the parent animation loop (Memoized)
  const updateControls = useCallback((updates) => {
    if (mobileControlsRef?.current) {
      mobileControlsRef.current = {
        ...mobileControlsRef.current,
        ...updates
      };
    }
  }, [mobileControlsRef]);

  const handlePressGas = (active) => {
    updateControls({ accelerate: active });
  };

  const handlePressBrake = (active) => {
    updateControls({ brake: active });
  };

  const handleGearSelect = (gear) => {
    if (typeof setActiveGear === "function") {
      setActiveGear(gear);
    }
  };

  const handleEngineToggle = () => {
    if (typeof setEngineOn === "function") {
      setEngineOn(!engineOn);
    }
  };

  // Sync state changes with parent ref
  useEffect(() => {
    updateControls({ 
      gear: activeGear,
      engineOn: engineOn
    });
  }, [activeGear, engineOn, updateControls]);

  // Polar angle calculation for the visual steering wheel
  const getSteeringFromTouch = useCallback((clientX, clientY) => {
    if (!wheelTrackRef.current) return { normalizedValue: 0, degrees: 0 };
    const rect = wheelTrackRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    
    if (angle > Math.PI) angle -= Math.PI * 2;
    if (angle <= -Math.PI) angle += Math.PI * 2;

    const maxRotationRad = 140 * (Math.PI / 180);
    const clampedAngle = Math.max(-maxRotationRad, Math.min(maxRotationRad, angle));

    const normalizedValue = parseFloat((clampedAngle / maxRotationRad).toFixed(2));
    const degrees = clampedAngle * (180 / Math.PI);

    return { normalizedValue, degrees };
  }, []);

  // Universal handler for both mouse and touch moves
  const handleSteerMove = useCallback((e) => {
    if (!isTrackingSteer.current) return;
    
    // Support touch objects and mouse pointers simultaneously
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const { normalizedValue, degrees } = getSteeringFromTouch(clientX, clientY);
    updateControls({ steering: normalizedValue, isDragging: true });

    if (uiSteeringWheelRef?.current) {
      uiSteeringWheelRef.current.style.transform = `rotate(${degrees}deg)`;
    }
  }, [getSteeringFromTouch, updateControls, uiSteeringWheelRef]);

  const handleSteerEnd = useCallback(() => {
    isTrackingSteer.current = false;
    updateControls({ steering: 0, isDragging: false });
  }, [updateControls]);

  const handleSteerStart = (e) => {
    isTrackingSteer.current = true;
    updateControls({ isDragging: true });
    handleSteerMove(e);
  };

  // Global window listeners to capture pointer moves out-of-bounds seamlessly
  useEffect(() => {
    const handleGlobalMove = (e) => {
      handleSteerMove(e);
    };

    const handleGlobalEnd = () => {
      if (isTrackingSteer.current) {
        handleSteerEnd();
      }
    };

    window.addEventListener("mousemove", handleGlobalMove);
    window.addEventListener("mouseup", handleGlobalEnd);
    window.addEventListener("touchmove", handleGlobalMove, { passive: true });
    window.addEventListener("touchend", handleGlobalEnd);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMove);
      window.removeEventListener("mouseup", handleGlobalEnd);
      window.removeEventListener("touchmove", handleGlobalMove);
      window.removeEventListener("touchend", handleGlobalEnd);
    };
  }, [handleSteerMove, handleSteerEnd]);

  // Universal cross-platform buttons handlers
  const onGasStart = () => handlePressGas(true);
  const onGasEnd = () => handlePressGas(false);

  const onBrakeStart = () => handlePressBrake(true);
  const onBrakeEnd = () => handlePressBrake(false);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none lg:hidden flex justify-between items-end p-3 sm:p-6 pb-6 select-none touch-none">
      
      {/* LEFT SIDE: Steering Wheel Area */}
      <div className="flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-auto">
        
        {/* Color Palette */}
        <div className="flex items-center gap-1.5 bg-slate-950/85 border border-slate-800/80 p-1.5 px-2 sm:p-2 sm:px-3 rounded-xl sm:rounded-2xl shadow-xl backdrop-blur-xs mb-0.5">
          <span className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest">Paint</span>
          <div className="flex gap-1 sm:gap-1.5">
            {[
              { hex: "#fbbf24", label: "Amber" },
              { hex: "#dc2626", label: "Red" },
              { hex: "#0ea5e9", label: "Sky" },
              { hex: "#059669", label: "Emerald" }
            ].map((opt) => (
              <button
                key={opt.hex}
                type="button"
                onClick={() => setColor?.(opt.hex)}
                className={`w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border transition-all ${
                  color === opt.hex ? "scale-110 border-white ring-1 sm:ring-2 ring-sky-500/35" : "border-slate-800 scale-95"
                }`}
                style={{ backgroundColor: opt.hex }}
                title={opt.label}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Steering Wheel Sizing */}
        <div
          ref={wheelTrackRef}
          onTouchStart={handleSteerStart}
          onMouseDown={handleSteerStart}
          className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-slate-950/40 border border-slate-700/30 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-2xl backdrop-blur-xs"
        >
          {/* Rotating Ring */}
          <div 
            ref={uiSteeringWheelRef}
            className="absolute inset-1 sm:inset-2 rounded-full border-[3px] sm:border-4 border-slate-600 flex items-center justify-center transition-transform duration-75 ease-out"
            style={{ transform: "rotate(0deg)" }}
          >
            <div className="absolute top-0 w-1 sm:w-1.5 h-2 sm:h-4 bg-sky-500 rounded-b-sm" />
            <div className="w-full h-0.5 sm:h-1 bg-slate-600" />
            <div className="absolute bottom-0 w-0.5 sm:w-1 h-8 sm:h-14 bg-slate-600" />
            
            <div className="absolute w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shadow-inner">
              <span className="text-[7px] sm:text-[9px] font-black text-slate-400">JEEP</span>
            </div>
          </div>
        </div>
        <span className="text-[8px] sm:text-[10px] text-slate-300 font-bold uppercase tracking-widest bg-slate-950/60 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-slate-800/80">
          Steer
        </span>
      </div>

      {/* RIGHT SIDE: Vertical Dashboard Console Panel */}
      <div className="flex flex-col gap-2 sm:gap-4 pointer-events-auto items-end">
        <div className="flex gap-2 sm:gap-4 items-start bg-slate-950/85 border border-slate-800/80 p-2 sm:p-3.5 rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-md">
          
          {/* Compact Shifter Gear Panel */}
          <div className="flex flex-col gap-1 sm:gap-1.5 bg-slate-900/90 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-800/50">
            {["P", "R", "N", "D"].map((gear) => (
              <button
                key={gear}
                type="button"
                onClick={() => handleGearSelect(gear)}
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black flex items-center justify-center transition-all ${
                  activeGear === gear
                    ? "bg-sky-500 text-white shadow-md sm:shadow-lg shadow-sky-500/45"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 active:scale-95"
                }`}
              >
                {gear}
              </button>
            ))}
          </div>

          {/* Action Columns */}
          <div className="flex flex-col gap-2 sm:gap-3 justify-between h-full">
            <div className="flex flex-col gap-1 sm:gap-1.5">
              {/* Ignition Toggle */}
              <button
                type="button"
                onClick={handleEngineToggle}
                className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border text-[7px] sm:text-[9px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
                  engineOn
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500 text-rose-400"
                }`}
              >
                <span className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full ${engineOn ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
                {engineOn ? "ON" : "OFF"}
              </button>

              {/* Showroom Exhibition */}
              <button
                type="button"
                onClick={onToggleShowroom}
                className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border text-[7px] sm:text-[9px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-0.5 sm:gap-1 ${
                  lazySusanOn
                    ? "bg-amber-500/20 border-amber-500 text-amber-400"
                    : "bg-slate-800/80 border-slate-700/50 text-slate-400 hover:bg-slate-700"
                }`}
              >
                ↺ SHOW
              </button>
            </div>

            {/* Split Pedals [BRAKE] [GAS] */}
            <div className="flex gap-1.5 sm:gap-2.5 items-end justify-end">
              {/* Brake Button (B) */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onTouchStart={onBrakeStart}
                  onTouchEnd={onBrakeEnd}
                  onTouchCancel={onBrakeEnd}
                  onMouseDown={onBrakeStart}
                  onMouseUp={onBrakeEnd}
                  onMouseLeave={onBrakeEnd}
                  className="w-11 h-10 sm:w-16 sm:h-14 rounded-lg sm:rounded-xl border text-[9px] sm:text-xs font-black flex items-center justify-center transition-all bg-slate-800/80 text-rose-400 border-rose-500/30 active:bg-rose-500 active:text-white"
                >
                  BRAKE
                </button>
              </div>

              {/* Gas Button (A) */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onTouchStart={onGasStart}
                  onTouchEnd={onGasEnd}
                  onTouchCancel={onGasEnd}
                  onMouseDown={onGasStart}
                  onMouseUp={onGasEnd}
                  onMouseLeave={onGasEnd}
                  className="w-9 h-12 sm:w-12 sm:h-16 rounded-lg sm:rounded-xl border text-[9px] sm:text-xs font-black flex items-center justify-center transition-all bg-slate-800/80 text-emerald-400 border-emerald-500/30 active:bg-emerald-500 active:text-white"
                >
                  GAS
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}