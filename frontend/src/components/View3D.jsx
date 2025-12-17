import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Text, GizmoHelper, GizmoViewport } from '@react-three/drei'
import useStore from '../store'

// 1. 傢俱組件 (超級防禦版)
function FurnitureItem({ position, color, dimensions }) {
  // 防禦 1: 如果沒有位置，就不渲染
  if (!position || position.length < 3) return null;

  // 防禦 2: 如果沒有尺寸，給預設值
  const args = dimensions || [1, 1, 1];

  // 防禦 3: 確保顏色有值
  const safeColor = color || 'white';

  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={safeColor} />
    </mesh>
  )
}

// 2. 方位文字組件
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
      <Canvas camera={{ position: [8, 8, 8], fov: 50 }}>
        <color attach="background" args={['#1a1a1a']} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
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
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <planeGeometry args={[roomDim.width, roomDim.length]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>

        <RoomLabels width={roomDim.width} length={roomDim.length} />

        {/* 渲染列表 */}
        {furnitureList.map((item) => (
          <FurnitureItem 
            key={item.id} 
            position={item.position} 
            color={item.color} 
            dimensions={item.dimensions} // 確保傳遞 dimensions
          />
        ))}
        
        <OrbitControls makeDefault />

        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
        </GizmoHelper>

      </Canvas>
    </div>
  )
}