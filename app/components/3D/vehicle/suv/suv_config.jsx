export const SUV_CONFIG = {
  // ============================================================
  // BODY / OVERALL PACKAGE
  // ============================================================
  bodyHalfWidth: 0.78,       // Half body width
  bodyLength: 3.10,          // Overall body length
  bodyHeight: 1.72,          // Overall body height

  frontOverhang: 0.78,       // Front axle -> front bumper
  rearOverhang: 0.92,        // Rear axle -> rear bumper
  wheelbase: 2.20,           // Front axle -> rear axle

  // ============================================================
  // TRACK / WHEEL ARCHES (Wide-Track Stance to prevent sill clipping)
  // ============================================================
  wheelX: 0.94,              // Shoved outward to 0.94m (Inner tire edge at 0.81m)
  fenderX: 0.81,             // Outer fender / arch width
  innerWheelWellX: 0.68,     // Inner wheelhouse width
  wheelArchRadius: 0.42,     // Wheel arch radius
  wheelRadius: 0.38,         // Chunky tire outer radius (0.38m)
  wheelWidth: 0.26,          // Broad tire width (0.26m)
  rimDiameter: 0.44,         // Rim diameter

  // ============================================================
  // CHASSIS / UNDERBODY
  // ============================================================
  railX: 0.55,               // Longitudinal chassis rail offset
  springX: 0.55,             // Suspension spring offset
  subframeX: 0.60,           // Subframe width
  crossmemberX: 0.62,        // Crossmember width

  chassisFloorY: 0.38,       // Chassis / underbody reference (0.38m)
  groundY: 0.00,             // Ground reference
  groundClearance: 0.32,     // SUV ground clearance

  // ============================================================
  // AXLES / SUSPENSION
  // ============================================================
  frontAxleZ: 1.25,          // Front wheel centerline
  rearAxleZ: -0.95,          // Rear wheel centerline
  axleY: 0.44,               // Wheel center height (0.44m)

  frontSpringY: 0.58,        // Front spring / strut position
  rearSpringY: 0.55,         // Rear spring position
  frontDamperY: 0.64,        // Front damper position
  rearDamperY: 0.61,         // Rear damper position

  // ============================================================
  // CABIN / GREENHOUSE (firewall at 1.15m)
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
  // BONNET / ENGINE BAY (re-centered forward 1.15m to 1.85m)
  // ============================================================
  bonnetHingeZ: 1.15,        // Front cowl hinge line
  bonnetY: 1.48,             // Bonnet surface height
  bonnetStartZ: 1.85,        // Front bonnet nose
  windshieldZ: 0.95,         // Windshield cowl
  bonnetLatchY: 1.34,        // Front nose height
  coolantReservoirX: 0.58,
  coolantReservoirZ: 1.62,
  airBoxX: 0.56,
  airBoxZ: 1.35,
  batteryX: 0.56,
  batteryZ: 1.35,
  fuseBoxX: 0.60,
  fuseBoxZ: 1.25,
  ecuX: 0.58,
  ecuZ: 1.22,
  brakeBoosterX: 0.58,
  brakeBoosterZ: 1.20,

  // ============================================================
  // TRANSMISSION / STEERING
  // ============================================================
  gearboxZ: 0.05,
  gearboxY: 0.70,
  transmissionZ: -0.10,
  steeringRackZ: 0.18,
  steeringRackY: 0.48,
  pinionZ: 0.20,              // Steering pinion
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
  // WHEELS / TIRES
  // ============================================================
  wheelDiameter: 0.76,
  tireSidewall: 0.16,
  wheelSpokeCount: 5,
  wheelHubRadius: 0.08,
};