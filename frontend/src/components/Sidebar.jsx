import React from 'react'
import useStore from '../store'
import { saveDesign, loadDesign } from '../api'

export default function Sidebar() {
  const addFurniture = useStore((state) => state.addFurniture)
  const removeFurniture = useStore((state) => state.removeFurniture)
  const furnitureList = useStore((state) => state.furniture)
  const roomDim = useStore((state) => state.roomDimensions)
  // --- 新增：引入設定尺寸的動作 ---
  const setRoomDimensions = useStore((state) => state.setRoomDimensions)

  const catalog = [
    {
      id: 'cat-1',
      name: '普通方塊',
      type: 'box',
      dimensions: [1, 1, 1],
      color: '#ffaa00'
    },
    {
      id: 'cat-2',
      name: '長桌 (方塊)',
      type: 'box',
      dimensions: [2, 0.8, 1],
      color: '#885522'
    },
    {
      id: 'cat-3',
      name: '🪑 真實椅子',
      type: 'model',
      dimensions: [0.5, 1, 0.5],
      modelUrl: '/chair.glb',
      color: '#ffffff'
    }
  ]

  const handleSave = async () => {
    if (furnitureList.length === 0) {
      alert("房間是空的，先放點東西吧！")
      return
    }

    const designData = {
      name: "我的房間設計",
      roomDimensions: roomDim,
      furniture: furnitureList
    }

    try {
      alert("正在連線後端進行存檔...")
      const result = await saveDesign(designData)
      alert(`✅ 存檔成功！ID: ${result.id}`)
    } catch (error) {
      alert("❌ 存檔失敗，請確認後端 (uvicorn) 是否有開啟？")
      console.error(error)
    }
  }

  const handleLoad = async () => {
    try {
      const data = await loadDesign()
      
      if (data && data.furniture) {
        // --- 新增：讀檔時也要同步更新房間尺寸 ---
        if (data.roomDimensions) {
          setRoomDimensions(data.roomDimensions.width, data.roomDimensions.length)
        }
        
        // --- 這裡呼叫 setFurniture 的動作 ---
        useStore.getState().setFurniture(data.furniture)
        
        alert(`📂 讀取成功！已載入 ${data.furniture.length} 個家具。`)
      } else {
        alert("讀取成功，但檔案似乎是空的？")
      }
      
    } catch (error) {
      alert("❌ 讀檔失敗，請確認後端是否正常？")
      console.error(error)
    }
  }

  // --- 新增：處理輸入框變更 ---
  const handleDimChange = (e, type) => {
    const val = parseFloat(e.target.value)
    if (isNaN(val) || val <= 0) return // 簡單防呆

    if (type === 'width') {
      setRoomDimensions(val, roomDim.length)
    } else {
      setRoomDimensions(roomDim.width, val)
    }
  }

  return (
    <div style={{
      width: '250px',
      height: '100%',
      background: '#2c3e50',
      color: 'white',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      borderRight: '1px solid #34495e'
    }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', textAlign: 'center' }}>
        🏠 RoomCraft
      </h2>

      {/* --- 新增：房間尺寸設定區 --- */}
      <div style={{ marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '5px' }}>
        <h3 style={{ fontSize: '1rem', marginTop: 0, marginBottom: '10px' }}>📏 房間尺寸 (公尺)</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.8rem', color: '#bdc3c7' }}>寬度 (X)</label>
            <input 
              type="number" 
              value={roomDim.width} 
              onChange={(e) => handleDimChange(e, 'width')}
              style={{ width: '100%', padding: '5px', borderRadius: '3px', border: 'none', marginTop: '2px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.8rem', color: '#bdc3c7' }}>長度 (Z)</label>
            <input 
              type="number" 
              value={roomDim.length} 
              onChange={(e) => handleDimChange(e, 'length')}
              style={{ width: '100%', padding: '5px', borderRadius: '3px', border: 'none', marginTop: '2px' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={handleSave} 
          style={{ 
            flex: 1, 
            padding: '10px', 
            background: '#27ae60',
            color: 'white', 
            border: 'none', 
            cursor: 'pointer', 
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          💾 存檔
        </button>
        <button 
          onClick={handleLoad} 
          style={{ 
            flex: 1, 
            padding: '10px', 
            background: '#e67e22',
            color: 'white', 
            border: 'none', 
            cursor: 'pointer', 
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          📂 讀檔
        </button>
      </div>

      <hr style={{ border: '0', borderTop: '1px solid #7f8c8d', width: '100%', marginBottom: '20px' }} />

      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', color: '#ecf0f1' }}>🛒 家具目錄</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {catalog.map((item) => (
            <button
              key={item.id}
              onClick={() => addFurniture(item)}
              style={{
                padding: '12px',
                background: '#34495e',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#2980b9'}
              onMouseOut={(e) => e.currentTarget.style.background = '#34495e'}
            >
              <span>{item.name}</span>
              <span style={{ fontSize: '0.8em', color: '#bdc3c7' }}>
                {item.dimensions[0]}x{item.dimensions[2]}m
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid #7f8c8d', paddingTop: '10px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
          📋 已放置 ({furnitureList.length})
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {furnitureList.map((item) => (
            <li key={item.id} style={{ 
              marginBottom: '8px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'rgba(0,0,0,0.2)',
              padding: '8px',
              borderRadius: '4px'
            }}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                <span style={{ fontSize: '0.9em' }}>{item.name}</span>
              </div>
              <button 
                onClick={() => removeFurniture(item.id)}
                style={{
                  background: '#c0392b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '0.8em'
                }}
              >
                刪除
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '10px', fontSize: '0.8rem', color: '#95a5a6', textAlign: 'center' }}>
        RoomCraft Alpha v0.2
      </div>
    </div>
  )
}