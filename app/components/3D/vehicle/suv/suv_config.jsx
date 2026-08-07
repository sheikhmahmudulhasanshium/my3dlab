export const SUV_CONFIG = {
  // ============================================================
  // BODY / OVERALL PACKAGE
  // ============================================================

  bodyHalfWidth: 0.78,       // Half body width
  bodyLength: 3.10,          // Overall body length
  bodyHeight: 1.72,          // Overall body height

  frontOverhang: 0.78,       // Front axle -> front bumper
  rearOverhang: 0.92,        // Rear axle -> rear bumper
  wheelbase: 2.20,            // Front axle -> rear axle

  // ============================================================
  // TRACK / WHEEL ARCHES
  // ============================================================

  wheelX: 0.90,              // Wheel center lateral offset
  fenderX: 0.81,             // Outer fender / arch width
  innerWheelWellX: 0.68,     // Inner wheelhouse width
  wheelArchRadius: 0.39,     // Wheel arch radius
  wheelRadius: 0.36,         // Tire radius
  wheelWidth: 0.24,          // Tire width

  // ============================================================
  // CHASSIS / UNDERBODY
  // ============================================================

  railX: 0.55,               // Longitudinal chassis rail offset
  springX: 0.55,             // Suspension spring offset
  subframeX: 0.60,           // Subframe width
  crossmemberX: 0.62,        // Crossmember width

  chassisFloorY: 0.38,       // Chassis / underbody reference
  groundY: 0.00,             // Ground reference
  groundClearance: 0.32,     // SUV ground clearance

  // ============================================================
  // AXLES / SUSPENSION
  // ============================================================

  frontAxleZ: 1.25,          // Front wheel centerline
  rearAxleZ: -0.95,          // Rear wheel centerline
  axleY: 0.44,               // Wheel center height

  frontSpringY: 0.58,        // Front spring / strut position
  rearSpringY: 0.55,         // Rear spring position

  frontDamperY: 0.64,        // Front damper position
  rearDamperY: 0.61,         // Rear damper position

  // ============================================================
  // CABIN / GREENHOUSE
  // ============================================================

  windshieldZ: 0.95,         // Windshield lower/cowl point
  windshieldTopZ: 1.72,      // Windshield upper point

  bPillarZ: 0.10,            // Front/rear door split
  cPillarZ: -0.55,           // Rear door / quarter glass split
  dPillarZ: -1.20,           // Rear hatch pillar

  pillarOffset: 0.76,        // Greenhouse pillar alignment

  beltLineY: 1.15,           // Lower glass / beltline
  windowTopY: 1.55,          // Upper glass reference
  roofY: 1.68,               // Roof height

  // ============================================================
  // INTERIOR / FLOOR
  // ============================================================

  seatX: 0.38,               // Seat lateral offset
  seatHeightY: 0.82,         // Seat cushion height
  tubFloorY: 0.48,           // Cabin floor
  rearFloorY: 0.50,          // Rear floor
  cargoFloorY: 0.52,         // Cargo floor

  frontSeatZ: 0.72,          // Front bucket seat position
  rearSeatZ: -0.55,          // Rear bench position

  // ============================================================
  // BONNET / ENGINE BAY
  // ============================================================

  bonnetStartZ: 1.62,        // Front bonnet start
  bonnetEndZ: 0.72,          // Rear bonnet / cowl
  bonnetY: 1.48,             // Bonnet surface height

  engineCenterZ: 0.55,       // Engine center
  engineCenterY: 0.86,       // Engine height

  engineBayFrontZ: 1.45,
  engineBayRearZ: 0.72,

  batteryZ: 0.88,             // 12V battery position
  batteryX: 0.56,

  fuseBoxZ: 0.72,
  fuseBoxX: 0.60,

  ecuZ: 0.66,
  ecuX: 0.58,

  // ============================================================
  // BRAKE / CLUTCH SYSTEM
  // ============================================================

  brakeBoosterZ: 0.48,
  brakeBoosterX: 0.58,

  bmsZ: 0.42,                 // Brake Master Cylinder
  bmsX: 0.58,

  brakeFluidReservoirZ: 0.50,

  clutchMasterZ: 0.42,        // Manual transmission only
  clutchMasterX: 0.50,

  clutchReservoirZ: 0.51,

  // ============================================================
  // COOLING MODULE — CMS
  // ============================================================

  cmsZ: 1.48,                 // Cooling Module System
  cmsY: 0.78,

  radiatorZ: 1.46,
  radiatorY: 0.80,

  condenserZ: 1.50,
  condenserY: 0.78,

  coolingFanZ: 1.40,
  coolingFanY: 0.82,

  coolantReservoirZ: 1.10,
  coolantReservoirX: 0.58,

  // ============================================================
  // AIR INTAKE
  // ============================================================

  airBoxZ: 0.95,
  airBoxX: 0.56,

  intakeZ: 0.78,
  intakeY: 0.94,

  throttleBodyZ: 0.68,

  // ============================================================
  // TRANSMISSION / STEERING
  // ============================================================

  gearboxZ: 0.05,
  gearboxY: 0.70,

  transmissionZ: -0.10,

  steeringRackZ: 0.18,
  steeringRackY: 0.48,

  pinionZ: 0.20,               // Steering pinion
  pinionY: 0.54,

  // ============================================================
  // EXHAUST
  // ============================================================

  exhaustManifoldZ: 0.48,
  catalyticZ: 0.20,
  resonatorZ: -0.50,
  mufflerZ: -1.05,
  splitterZ: -1.45,

  exhaustTipZ: -1.60,
  exhaustTipX: 0.55,

  // ============================================================
  // BONNET HARDWARE
  // ============================================================

  bonnetHingeZ: 0.78,
  bonnetHingeX: 0.68,

  bonnetLatchZ: 1.43,
  bonnetLatchY: 1.34,

  bonnetStrikerZ: 1.43,

  // ============================================================
  // ROOF / SUNROOF
  // ============================================================

  sunroofStartZ: 0.52,
  sunroofEndZ: -0.42,
  sunroofY: 1.70,

  sunroofWidth: 0.62,

  // ============================================================
  // DOORS
  // ============================================================

  frontDoorStartZ: 0.86,
  frontDoorEndZ: 0.08,

  rearDoorStartZ: 0.05,
  rearDoorEndZ: -0.82,

  doorBottomY: 0.48,
  doorTopY: 1.18,

  frontDoorHandleZ: 0.48,
  rearDoorHandleZ: -0.46,

  // ============================================================
  // FRONT FASCIA / BUMPER
  // ============================================================

  frontBumperZ: 2.03,
  frontBumperY: 0.55,

  frontGrilleZ: 1.84,
  frontGrilleY: 0.90,

  frontAirDamZ: 1.82,
  frontAirDamY: 0.42,

  fogLightZ: 1.72,
  fogLightX: 0.62,

  drlZ: 1.78,
  drlX: 0.68,

  frontTowPointZ: 1.94,

  // ============================================================
  // REAR FASCIA / BUMPER
  // ============================================================

  rearBumperZ: -1.87,
  rearBumperY: 0.52,

  rearValanceZ: -1.72,
  rearValanceY: 0.42,

  rearTowPointZ: -1.82,

  rearParkingSensorZ: -1.75,
  rearParkingSensorX: 0.58,

  exhaustCutoutZ: -1.76,
  exhaustCutoutX: 0.55,

  // ============================================================
  // LIGHTING
  // ============================================================

  headlampZ: 1.72,
  headlampX: 0.68,

  projectorZ: 1.73,
  projectorX: 0.69,

  drlHaloZ: 1.76,

  rearLedZ: -1.55,
  rearLedY: 1.32,

  brakeLightZ: -1.54,
  reverseLightZ: -1.55,
  turnSignalZ: -1.56,

  // ============================================================
  // EXTERIOR TRIM
  // ============================================================

  frontArchTrimZ: 1.18,
  rearArchTrimZ: -0.88,

  archTrimWidth: 0.08,
  rockerTrimY: 0.43,

  // ============================================================
  // LICENSE PLATES
  // ============================================================

  frontPlateZ: 1.92,
  frontPlateY: 0.70,

  rearPlateZ: -1.66,
  rearPlateY: 0.76,

  // ============================================================
  // MIRRORS
  // ============================================================

  mirrorZ: 0.58,
  mirrorY: 1.28,
  mirrorX: 0.84,

  // ============================================================
  // WHEELS / TIRES
  // ============================================================

  wheelDiameter: 0.72,
  rimDiameter: 0.58,

  tireWidth: 0.24,
  tireSidewall: 0.12,

  wheelSpokeCount: 5,
  wheelHubRadius: 0.09,

  // ============================================================
  // VEHICLE REFERENCE
  // ============================================================

  frontReferenceZ: 1.25,
  rearReferenceZ: -0.95,

  vehicleCenterZ: 0.15,
  vehicleCenterY: 0.85,
};
/*
SUV_CONFIG
 ├── BODY
 ├── WHEELS
 ├── CHASSIS
 ├── SUSPENSION
 ├── CABIN
 ├── INTERIOR
 ├── ENGINE_BAY
 ├── BRAKE_SYSTEM
 ├── COOLING / CMS
 ├── STEERING / PINION
 ├── EXHAUST
 ├── BONNET
 ├── DOORS
 ├── ROOF / SUNROOF
 ├── FRONT FASCIA
 ├── REAR FASCIA
 ├── LIGHTING
 └── EXTERIOR TRIM
 */