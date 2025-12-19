import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Text, GizmoHelper, GizmoViewport, Gltf, Environment, ContactShadows } from '@react-three/drei'
import useStore from '../store'

function FurnitureItem({ position, color, dimensions, rotation, modelUrl }) {
  if (!position || position.length < 3) return null;
  const args = dimensions || [1, 1, 1];
  const safeColor = color || 'white';
  const rotationY = (rotation || 0) * (Math.PI / 180) * -1;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {modelUrl ? (
        <Gltf src={modelUrl} castShadow receiveShadow />
      ) : (
        <mesh castShadow receiveShadow>
          <boxGeometry args={args} />
          <meshStandardMaterial color={safeColor} />
        </mesh>
      )}
    </group>
  )
}

function RoomLabels({ width, length }) {
  const padding = 1.5 
  const textProps = { fontSize: 0.8, color: "white", rotation: [-Math.PI / 2, 0, 0], anchorX: "center", anchorY: "middle" }
  return (
    <group position={[0, 0.01, 0]}>
      <Text position={[0, 0, length / 2 + padding]} {...textProps}>Front (+Z)</Text>
      <Text position={[0, 0, -length / 2 - padding]} {...textProps}>Back (-Z)</Text>
      <Text position={[-width / 2 - padding, 0, 0]} {...textProps} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>Left (-X)</Text>
      <Text position={[width / 2 + padding, 0, 0]} {...textProps} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>Right (+X)</Text>
    </group>
  )
}

// --- 新增：牆壁組件 ---
// 為了不擋住鏡頭，我們只畫「後牆 (-Z)」和「左牆 (-X)」
function RoomWalls({ width, length, wallColor, height = 3 }) {
  const thickness = 0.2; // 牆壁厚度 20cm
  
  return (
    <group>
      {/* 1. 後牆 (Back Wall) */}
      <mesh 
        position={[0, height / 2, -length / 2 - thickness / 2]} 
        receiveShadow
      >
        {/* 寬度要稍微加寬一點點蓋住角落縫隙 */}
        <boxGeometry args={[width + thickness, height, thickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* 2. 左牆 (Left Wall) */}
      <mesh 
        position={[-width / 2 - thickness / 2, height / 2, 0]} 
        receiveShadow
      >
        <boxGeometry args={[thickness, height, length]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
    </group>
  )
}

export default function View3D() {
  const furnitureList = useStore((state) => state.furniture)
  const roomDim = useStore((state) => state.roomDimensions)
  // --- 新增：取得房間風格 ---
  const roomStyle = useStore((state) => state.roomStyle)

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [8, 12, 12], fov: 50 }} shadows>
        <Suspense fallback={null}>
          
          <color attach="background" args={['#1a1a1a']} />
          
          <Environment preset="apartment" />

          <directionalLight 
            position={[5, 10, 5]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize={[2048, 2048]} 
            shadow-bias={-0.001}
          />

          <Grid 
            position={[0, -0.01, 0]} 
            args={[roomDim.width, roomDim.width]} 
            cellSize={1} 
            cellThickness={0.5} 
            cellColor="#6f6f6f" 
            sectionSize={5} 
            sectionThickness={1} 
            sectionColor="#9d4b4b" 
            fadeDistance={50} 
          />
          
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
            <planeGeometry args={[roomDim.width, roomDim.length]} />
            {/* --- 修改：使用 Store 裡的地板顏色 --- */}
            <meshStandardMaterial color={roomStyle.floorColor} roughness={0.8} />
          </mesh>

          {/* --- 新增：渲染牆壁 --- */}
          <RoomWalls 
            width={roomDim.width} 
            length={roomDim.length} 
            wallColor={roomStyle.wallColor} 
          />

          <RoomLabels width={roomDim.width} length={roomDim.length} />

          {furnitureList.map((item) => (
            <FurnitureItem 
              key={item.id} 
              position={item.position} 
              color={item.color} 
              dimensions={item.dimensions}
              rotation={item.rotation}
              modelUrl={item.modelUrl} 
            />
          ))}

          <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={roomDim.width * 2} blur={2} far={1.5} />
          
          <OrbitControls makeDefault />

          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
          </GizmoHelper>

        </Suspense>
      </Canvas>
    </div>
  )
}