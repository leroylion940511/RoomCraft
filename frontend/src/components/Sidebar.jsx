import React from 'react'
import useStore from '../store'
import { saveDesign, loadDesign } from '../api' // 引入 API 模組

export default function Sidebar() {
  // 從 Store 取得狀態與動作
  const addFurniture = useStore((state) => state.addFurniture)
  const removeFurniture = useStore((state) => state.removeFurniture)
  const furnitureList = useStore((state) => state.furniture)
  const roomDim = useStore((state) => state.roomDimensions)

  const setFurniture = useStore((state) => state.setFurniture)

  // 定義家具目錄 (模擬商品列表)
  const catalog = [
    {
      id: 'cat-1', // 這個 ID 只是為了讓 Sidebar 列表渲染用 (React Key)
      name: '普通方塊',
      type: 'box',
      dimensions: [1, 1, 1],
      color: '#ffaa00'
    },
    {
      id: 'cat-2',
      name: '長桌 (方塊)',
      type: 'box',
      dimensions: [2, 0.8, 1], // 寬2米, 高0.8米, 深1米
      color: '#885522'
    },
    {
      id: 'cat-3',
      name: '🪑 真實椅子',
      type: 'model',
      dimensions: [0.5, 1, 0.5], // 給 2D 視圖用的佔地面積
      modelUrl: '/Executive Chair.glb',    // <--- 確保 public 資料夾有這個檔案
      color: '#ffffff'
    }
  ]

  // 處理存檔
  const handleSave = async () => {
    // 檢查是否有東西可以存
    if (furnitureList.length === 0) {
      alert("房間是空的，先放點東西吧！")
      return
    }

    const designData = {
      name: "我的房間設計",
      roomDimensions: roomDim,
      furniture: furnitureList // 這裡面已經包含了所有位置、旋轉、模型資訊
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
      
      // 檢查後端回傳的資料結構
      if (data && data.furniture) {
        // 🚨 關鍵動作：更新 Store 狀態！
        // 這會觸發 React 重新渲染，家具就會瞬間出現了
        setFurniture(data.furniture) 
        
        alert(`📂 讀取成功！已載入 ${data.furniture.length} 個家具。`)
      } else {
        alert("讀取成功，但檔案似乎是空的？")
      }
      
    } catch (error) {
      alert("❌ 讀檔失敗，請確認後端是否正常？")
      console.error(error)
    }
  }

  return (
    <div style={{
      width: '250px',
      height: '100%',
      background: '#2c3e50', // 深藍灰背景
      color: 'white',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      borderRight: '1px solid #34495e'
    }}>
      {/* 標題區 */}
      <h2 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', textAlign: 'center' }}>
        🏠 RoomCraft
      </h2>

      {/* 存檔/讀檔按鈕區 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={handleSave} 
          style={{ 
            flex: 1, 
            padding: '10px', 
            background: '#27ae60', // 綠色
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
            background: '#e67e22', // 橘色
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

      {/* 家具目錄區 */}
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
              onMouseOver={(e) => e.currentTarget.style.background = '#2980b9'} // 簡單的 hover 效果
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

      {/* 已放置清單區 */}
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
                  background: '#c0392b', // 紅色
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
        RoomCraft Alpha v0.1
      </div>
    </div>
  )
}