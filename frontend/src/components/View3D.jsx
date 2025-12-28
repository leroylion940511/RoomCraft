import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Grid, Text, GizmoHelper, GizmoViewport, Gltf, Environment, ContactShadows } from '@react-three/drei'
import useStore from '../store'

function FurnitureItem({ position, color, dimensions, rotation, modelUrl, name }) {
  if (!position || position.length < 3) return null;
  const args = dimensions || [1, 1, 1];
  const safeColor = color || 'white';
  const rotationY = (rotation || 0) * (Math.PI / 180) * -1;

  // 使用簡單的 state 處理加載失敗，避免整個 Canvas 崩潰
  const [error, setError] = React.useState(false);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {modelUrl && !error ? (
        <Suspense fallback={
          <mesh castShadow receiveShadow position={[0, args[1] / 2, 0]}>
            <boxGeometry args={args} />
            <meshStandardMaterial color={safeColor} transparent opacity={0.5} />
          </mesh>
        }>
          <Gltf
            src={modelUrl}
            castShadow
            receiveShadow
            position={[0, -args[1] / 2, 0]} // 修正浮空：GLTF 原點通常在底部，我們將其中心降回 0
            onLoad={(gltf) => {
              const box = new THREE.Box3().setFromObject(gltf.scene);
              const size = new THREE.Vector3();
              box.getSize(size);
              console.log(`[ModelCheck] ${name || 'Unknown'} (${modelUrl}):`, {
                actual: [size.x, size.y, size.z],
                defined: args
              });
            }}
            onError={(err) => {
              console.error(`模型載入失敗: ${modelUrl}`, err);
              setError(true);
            }}
          />
        </Suspense>
      ) : (
        <mesh castShadow receiveShadow position={[0, args[1] / 2, 0]}>
          <boxGeometry args={args} />
          <meshStandardMaterial color={error ? "#ff0000" : safeColor} />
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

function RoomWalls({ width, length, wallColor, height = 3 }) {
  const thickness = 0.2;
  return (
    <group>
      <mesh position={[0, height / 2, -length / 2 - thickness / 2]} receiveShadow>
        <boxGeometry args={[width + thickness, height, thickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      <mesh position={[-width / 2 - thickness / 2, height / 2, 0]} receiveShadow>
        <boxGeometry args={[thickness, height, length]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
    </group>
  )
}

export default function View3D() {
  const furnitureList = useStore((state) => state.furniture)
  const roomDim = useStore((state) => state.roomDimensions)
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
            <meshStandardMaterial color={roomStyle.floorColor} roughness={0.8} />
          </mesh>
          <RoomWalls width={roomDim.width} length={roomDim.length} wallColor={roomStyle.wallColor} />
          <RoomLabels width={roomDim.width} length={roomDim.length} />
          {furnitureList.map((item) => (
            <FurnitureItem
              key={item.id}
              position={item.position}
              color={item.color}
              dimensions={item.dimensions}
              rotation={item.rotation}
              modelUrl={item.modelUrl}
              name={item.name}
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