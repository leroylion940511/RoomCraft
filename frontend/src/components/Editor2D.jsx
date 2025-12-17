import React from 'react'
import { Stage, Layer, Rect, Text, Line, Group } from 'react-konva'
import useStore from '../store'

const SCALE = 50 // 1公尺 = 50px

export default function Editor2D() {
  const furnitureList = useStore((state) => state.furniture)
  const roomDim = useStore((state) => state.roomDimensions)
  const updatePos = useStore((state) => state.updateFurniturePosition)

  const STAGE_WIDTH = 600
  const STAGE_HEIGHT = 600
  const CENTER_X = STAGE_WIDTH / 2
  const CENTER_Y = STAGE_HEIGHT / 2

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

  const handleDragEnd = (e, id) => {
    const x2d = e.target.x()
    const y2d = e.target.y()
    
    let x3d = x2d / SCALE
    let z3d = y2d / SCALE

    const limitX = roomDim.width / 2 - 0.5
    const limitZ = roomDim.length / 2 - 0.5

    if (x3d > limitX) x3d = limitX
    if (x3d < -limitX) x3d = -limitX
    if (z3d > limitZ) z3d = limitZ
    if (z3d < -limitZ) z3d = -limitZ

    updatePos(id, [x3d, 0.5, z3d])
    
    e.target.position({ x: x3d * SCALE, y: z3d * SCALE })
  }

  const roomPixelWidth = roomDim.width * SCALE
  const roomPixelLength = roomDim.length * SCALE

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
              
              // 防禦性代碼：取得尺寸，若無則給預設值
              const dims = item.dimensions || [1, 1, 1] 

              return (
                <Group
                  key={item.id}
                  x={item.position[0] * SCALE}
                  y={item.position[2] * SCALE}
                  draggable
                  onDragEnd={(e) => handleDragEnd(e, item.id)}
                >
                  <Rect
                    width={dims[0] * SCALE} 
                    height={dims[2] * SCALE}
                    fill={item.color}
                    stroke="#333"
                    strokeWidth={2}
                    offsetX={(dims[0] * SCALE) / 2}
                    offsetY={(dims[2] * SCALE) / 2}
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