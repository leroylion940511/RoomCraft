import React from 'react'
import { Stage, Layer, Rect, Text, Line, Group } from 'react-konva'
import useStore from '../store'

const SCALE = 50 // 1公尺 = 50px

export default function Editor2D() {
  const furnitureList = useStore((state) => state.furniture)
  const roomDim = useStore((state) => state.roomDimensions)
  const updatePos = useStore((state) => state.updateFurniturePosition)
  // 1. 新增：引入旋轉動作
  const updateRot = useStore((state) => state.updateFurnitureRotation)

  const STAGE_WIDTH = 600
  const STAGE_HEIGHT = 600
  const CENTER_X = STAGE_WIDTH / 2
  const CENTER_Y = STAGE_HEIGHT / 2

  const roomPixelWidth = roomDim.width * SCALE
  const roomPixelLength = roomDim.length * SCALE

  const renderGrid = () => {
    const lines = []
    const width = roomDim.width * SCALE
    const length = roomDim.length * SCALE
    
    const startX = -width / 2
    const startY = -length / 2

    for (let i = 0; i <= roomDim.width; i++) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[startX + i * SCALE, startY, startX + i * SCALE, startY + length]}
          stroke="#ddd"
          strokeWidth={1}
        />
      )
    }
    for (let i = 0; i <= roomDim.length; i++) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[startX, startY + i * SCALE, startX + width, startY + i * SCALE]}
          stroke="#ddd"
          strokeWidth={1}
        />
      )
    }
    return lines
  }

  return (
    <div style={{ width: "100%", height: "100%", background: "#333", overflow: "hidden" }}>
      <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
        <Layer>
          <Group x={CENTER_X} y={CENTER_Y}>
            
            <Rect
              x={-roomPixelWidth / 2}
              y={-roomPixelLength / 2}
              width={roomPixelWidth}
              height={roomPixelLength}
              fill="white"
              shadowColor="black"
              shadowBlur={10}
              shadowOpacity={0.5}
            />

            {renderGrid()}

            <Line points={[-roomPixelWidth/2, 0, roomPixelWidth/2, 0]} stroke="red" strokeWidth={2} opacity={0.3} />
            <Line points={[0, -roomPixelLength/2, 0, roomPixelLength/2]} stroke="blue" strokeWidth={2} opacity={0.3} />

            <Text text="後方 (Back -Z)" x={-50} y={-roomPixelLength/2 - 20} fill="#ccc" />
            <Text text="前方 (Front +Z)" x={-50} y={roomPixelLength/2 + 10} fill="#ccc" />
            <Text text="左 (Left -X)" x={-roomPixelWidth/2 - 70} y={-5} fill="#ccc" />
            <Text text="右 (Right +X)" x={roomPixelWidth/2 + 10} y={-5} fill="#ccc" />

            {furnitureList.map((item) => {
              const dims = item.dimensions || [1, 1, 1] 
              const itemWidth = dims[0] * SCALE
              const itemLength = dims[2] * SCALE

              return (
                <Group
                  key={item.id}
                  x={item.position[0] * SCALE}
                  y={item.position[2] * SCALE}
                  // 2. 新增：綁定旋轉角度
                  rotation={item.rotation || 0}
                  draggable
                  
                  dragBoundFunc={(pos) => {
                    const minX = CENTER_X - (roomPixelWidth / 2) + (itemWidth / 2)
                    const maxX = CENTER_X + (roomPixelWidth / 2) - (itemWidth / 2)
                    const minY = CENTER_Y - (roomPixelLength / 2) + (itemLength / 2)
                    const maxY = CENTER_Y + (roomPixelLength / 2) - (itemLength / 2)

                    return {
                      x: Math.max(minX, Math.min(maxX, pos.x)),
                      y: Math.max(minY, Math.min(maxY, pos.y))
                    }
                  }}

                  // --- 新增：雙擊旋轉事件 ---
                  onDblClick={() => {
                    const currentRotation = item.rotation || 0
                    const newRotation = (currentRotation + 90) % 360 // 讓角度在 0-360 循環
                    updateRot(item.id, newRotation)
                  }}

                  onDragMove={(e) => {
                    const x = e.target.x()
                    const y = e.target.y()
                    
                    const x3d = x / SCALE
                    const z3d = y / SCALE

                    updatePos(item.id, [x3d, 0.5, z3d])
                  }}
                >
                  <Rect
                    width={itemWidth} 
                    height={itemLength}
                    fill={item.color}
                    stroke="#333"
                    strokeWidth={2}
                    offsetX={itemWidth / 2}
                    offsetY={itemLength / 2}
                    cornerRadius={5}
                  />
                  <Text
                    text={item.name}
                    fontSize={14}
                    fill="black"
                    align="center"
                    width={60}
                    offsetX={30}
                    offsetY={-10}
                  />
                </Group>
              )
            })}

          </Group>
        </Layer>
      </Stage>
    </div>
  )
}