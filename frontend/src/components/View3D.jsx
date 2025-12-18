import { Suspense } from 'react' // 1. 引入 Suspense
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Text, GizmoHelper, GizmoViewport, useGLTF, Gltf } from '@react-three/drei' // 2. 引入 useGLTF, Gltf
import useStore from '../store'

// 3. 修改 FurnitureItem：支援模型渲染
function FurnitureItem({ position, color, dimensions, rotation, modelUrl}) { // 接收 modelUrl
  if (!position || position.length < 3) return null;
  const args = dimensions || [1, 1, 1];
  const safeColor = color || 'white';
  const rotationY = (rotation || 0) * (Math.PI / 180) * -1;

  return (
    <mesh position={position} rotation={[0, rotationY, 0]}>
      {/* 判斷：如果有模型路徑，就顯示模型；否則顯示原本的方塊 */}
      {modelUrl ? (
        // Gltf 是 drei 提供的便利組件，自動處理載入
        // scale 這裡暫時設為 1，稍後可能需要根據 dimensions 調整
        <Gltf src={modelUrl} castShadow receiveShadow />
      ) : (
        <>
          <boxGeometry args={args} />
          <meshStandardMaterial color={safeColor} />
        </>
      )}
    </mesh>
  )
}

function RoomLabels({ width, length }) {
  const padding = 1.5 
  const textProps = {
    fontSize: 0.8,
    color: "white",
    rotation: [-Math.PI / 2, 0, 0], 
    anchorX: "center",
    anchorY: "middle"
  }

  return (
    <group position={[0, 0.01, 0]}>
      <Text position={[0, 0, length / 2 + padding]} {...textProps}>
        Front (+Z)
      </Text>
      <Text position={[0, 0, -length / 2 - padding]} {...textProps}>
        Back (-Z)
      </Text>
      <Text position={[-width / 2 - padding, 0, 0]} {...textProps} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        Left (-X)
      </Text>
      <Text position={[width / 2 + padding, 0, 0]} {...textProps} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
        Right (+X)
      </Text>
    </group>
  )
}

export default function View3D() {
  const furnitureList = useStore((state) => state.furniture)
  const roomDim = useStore((state) => state.roomDimensions)

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [8, 8, 8], fov: 50 }} shadows>
        
        {/* 4. 加入 Suspense：這是載入模型必須的，fallback 可以放個讀取條，這裡先設 null */}
        <Suspense fallback={null}>

          <color attach="background" args={['#1a1a1a']} />
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          
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
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>

          <RoomLabels width={roomDim.width} length={roomDim.length} />

          {furnitureList.map((item) => (
            <FurnitureItem 
              key={item.id} 
              position={item.position} 
              color={item.color} 
              dimensions={item.dimensions}
              rotation={item.rotation}
              modelUrl={item.modelUrl}// 5. 傳遞 modelUrl
            />
          ))}
          
          <OrbitControls makeDefault />

          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
          </GizmoHelper>

        </Suspense>
      </Canvas>
    </div>
  )
}