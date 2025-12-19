import React, { useRef, useState } from 'react'
import { Stage, Layer, Rect, Text, Line, Group } from 'react-konva'
import useStore from '../store'

const SCALE = 50 

export default function Editor2D() {
  const furnitureList = useStore((state) => state.furniture)
  const roomDim = useStore((state) => state.roomDimensions)
  
  const updatePos = useStore((state) => state.updateFurniturePosition)
  const updateRot = useStore((state) => state.updateFurnitureRotation)

  const STAGE_WIDTH = 600
  const STAGE_HEIGHT = 600
  const CENTER_X = STAGE_WIDTH / 2
  const CENTER_Y = STAGE_HEIGHT / 2

  const roomPixelWidth = roomDim.width * SCALE
  const roomPixelLength = roomDim.length * SCALE

  const dragStartRef = useRef(null) 
  const [collidingIds, setCollidingIds] = useState([])

  const getBox = (item, customPos = null, customRot = null) => {
    const pos = customPos || item.position
    const rot = (customRot !== null) ? customRot : (item.rotation || 0)
    
    const isRotated = (Math.abs(rot / 90) % 2) === 1
    const w = isRotated ? item.dimensions[2] : item.dimensions[0]
    const l = isRotated ? item.dimensions[0] : item.dimensions[2]

    return {
      left: pos[0] - w / 2,
      right: pos[0] + w / 2,
      top: pos[2] - l / 2,
      bottom: pos[2] + l / 2,
      width: w,
      length: l
    }
  }

  const checkCollision = (targetItem, allItems, customPos = null, customRot = null) => {
    const tBox = getBox(targetItem, customPos, customRot)

    for (let item of allItems) {
      if (item.id === targetItem.id) continue 

      const iBox = getBox(item)

      const isOverlapping = (
        tBox.left < iBox.right &&
        tBox.right > iBox.left &&
        tBox.top < iBox.bottom &&
        tBox.bottom > iBox.top
      )

      if (isOverlapping) return item 
    }
    return null 
  }

  const findNearestValidPosition = (targetItem, collidedItem) => {
    // 這裡我們直接使用 targetItem，因為在旋轉邏輯中，我們會傳入已經帶有新旋轉角度的 tempItem
    // 所以 getBox 會自動計算旋轉後的寬高
    const tBox = getBox(targetItem)
    const iBox = getBox(collidedItem)

    const distLeft = tBox.right - iBox.left
    const distRight = iBox.right - tBox.left
    const distTop = tBox.bottom - iBox.top
    const distBottom = iBox.bottom - tBox.top

    const minDist = Math.min(distLeft, distRight, distTop, distBottom)

    let newX = targetItem.position[0]
    let newZ = targetItem.position[2]
    const epsilon = 0.05 // 稍微彈開多一點點，避免浮點數誤差導致還黏在一起

    if (minDist === distLeft) {
      newX = iBox.left - tBox.width / 2 - epsilon
    } else if (minDist === distRight) {
      newX = iBox.right + tBox.width / 2 + epsilon
    } else if (minDist === distTop) {
      newZ = iBox.top - tBox.length / 2 - epsilon
    } else {
      newZ = iBox.bottom + tBox.length / 2 + epsilon
    }

    return [newX, targetItem.position[1], newZ]
  }

  const renderGrid = () => {
    const lines = []
    const width = roomDim.width * SCALE
    const length = roomDim.length * SCALE
    const startX = -width / 2
    const startY = -length / 2

    for (let i = 0; i <= roomDim.width; i++) {
      lines.push(
        <Line key={`v-${i}`} points={[startX + i * SCALE, startY, startX + i * SCALE, startY + length]} stroke="#ddd" strokeWidth={1} />
      )
    }
    for (let i = 0; i <= roomDim.length; i++) {
      lines.push(
        <Line key={`h-${i}`} points={[startX, startY + i * SCALE, startX + width, startY + i * SCALE]} stroke="#ddd" strokeWidth={1} />
      )
    }
    return lines
  }

  return (
    <div style={{ width: "100%", height: "100%", background: "#333", overflow: "hidden" }}>
      <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
        <Layer>
          <Group x={CENTER_X} y={CENTER_Y}>
            <Rect x={-roomPixelWidth / 2} y={-roomPixelLength / 2} width={roomPixelWidth} height={roomPixelLength} fill="white" shadowColor="black" shadowBlur={10} shadowOpacity={0.5} />
            {renderGrid()}
            
            <Line points={[-roomPixelWidth/2, 0, roomPixelWidth/2, 0]} stroke="red" strokeWidth={2} opacity={0.3} />
            <Line points={[0, -roomPixelLength/2, 0, roomPixelLength/2]} stroke="blue" strokeWidth={2} opacity={0.3} />

            {furnitureList.map((item) => {
              const dims = item.dimensions || [1, 1, 1] 
              const itemWidth = dims[0] * SCALE
              const itemLength = dims[2] * SCALE
              const isColliding = collidingIds.includes(item.id)

              return (
                <Group
                  key={item.id}
                  x={item.position[0] * SCALE}
                  y={item.position[2] * SCALE}
                  rotation={item.rotation || 0} 
                  draggable
                  
                  onDragStart={() => {
                    dragStartRef.current = { ...item.position }
                  }}

                  // --- 修改：實現「旋轉後自動彈開」邏輯 ---
                  onDblClick={() => {
                    const currentRotation = item.rotation || 0
                    const newRotation = (currentRotation + 90) % 360
                    
                    // 1. 建立一個「旋轉後」的暫存物件
                    const tempItem = { ...item, rotation: newRotation }
                    
                    // 2. 檢查如果轉過去會不會撞到
                    const collidedTarget = checkCollision(tempItem, furnitureList)

                    if (collidedTarget) {
                      console.log("旋轉撞擊！自動彈開...")
                      // 3. 如果撞到，計算彈開後的新位置 (使用旋轉後的 tempItem 來算)
                      const newPos = findNearestValidPosition(tempItem, collidedTarget)
                      
                      // 4. 同時更新「旋轉」與「位置」
                      updateRot(item.id, newRotation)
                      updatePos(item.id, newPos)

                    } else {
                      // 5. 沒撞到，就只是單純旋轉
                      updateRot(item.id, newRotation)
                    }
                  }}

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

                  onDragMove={(e) => {
                    const x = e.target.x()
                    const y = e.target.y()
                    const x3d = x / SCALE
                    const z3d = y / SCALE
                    
                    updatePos(item.id, [x3d, 0.5, z3d])

                    const tempItem = { ...item, position: [x3d, 0.5, z3d] }
                    const collidedTarget = checkCollision(tempItem, furnitureList)

                    if (collidedTarget) {
                       if (!collidingIds.includes(item.id)) setCollidingIds([...collidingIds, item.id])
                    } else {
                       if (collidingIds.includes(item.id)) setCollidingIds(collidingIds.filter(id => id !== item.id))
                    }
                  }}

                  onDragEnd={() => {
                    const collidedTarget = checkCollision(item, furnitureList)
                    
                    if (collidedTarget) {
                      console.log("拖曳撞擊，彈回最近邊緣")
                      const newPos = findNearestValidPosition(item, collidedTarget)
                      updatePos(item.id, newPos)
                      setCollidingIds(collidingIds.filter(id => id !== item.id))
                    } else {
                      setCollidingIds(collidingIds.filter(id => id !== item.id))
                    }
                    dragStartRef.current = null
                  }}
                >
                  <Rect
                    width={itemWidth} 
                    height={itemLength}
                    fill={item.color}
                    stroke={isColliding ? "red" : "#333"}
                    strokeWidth={isColliding ? 4 : 2}
                    offsetX={itemWidth / 2}
                    offsetY={itemLength / 2}
                    cornerRadius={5}
                    opacity={0.9}
                  />
                  <Text
                    text={item.name}
                    fontSize={14}
                    fill={isColliding ? "red" : "black"}
                    fontStyle={isColliding ? "bold" : "normal"}
                    align="center"
                    width={80}
                    offsetX={40}
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