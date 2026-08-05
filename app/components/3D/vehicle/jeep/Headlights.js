"use client";


export default function Headlights({ cfg, materials, engineOn }) {
  return (
    <group>
      {[-1, 1].map((xSign) => (
        <group key={xSign} position={[xSign * 0.48, 0.78, 1.85]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.02, 12]} />
            {materials.silverMetallic}
          </mesh>
          <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.02, 12]} />
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#ffffff" 
              emissiveIntensity={engineOn ? 2.0 : 0.0} 
            />
          </mesh>
          {/* Main projected spot lights directed down onto the road */}
          {engineOn && (
            <group>
              <spotLight
                position={[0, 0, 0.05]}
                angle={Math.PI / 4.5}
                penumbra={0.4}
                intensity={25.0}
                distance={22}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.0001}
              >
                <object3D attach="target" position={[0, -1.2, 6.0]} />
              </spotLight>
              <pointLight 
                position={[0, -1.0, 5.0]} 
                intensity={1.5} 
                distance={5} 
                color="#f1f5f9" 
              />
            </group>
          )}
        </group>
      ))}
    </group>
  );
}