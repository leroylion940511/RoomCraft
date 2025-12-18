import React from 'react'
import useStore from '../store'

export default function Sidebar() {
  const addFurniture = useStore((state) => state.addFurniture)
  const removeFurniture = useStore((state) => state.removeFurniture)
  const furnitureList = useStore((state) => state.furniture)

  // 定義目錄：這裡模擬從後端抓回來的商品列表
  const catalog = [
    {
      id: 'item-1',
      name: '普通方塊',
      type: 'box', // 純方塊
      dimensions: [1, 1, 1],
      color: '#ffaa00'
    },
    {
      id: 'item-2',
      name: '長桌 (方塊)',
      type: 'box',
      dimensions: [2, 0.8, 1], // 寬2米, 高0.8米, 深1米
      color: '#885522'
    },
    {
      id: 'item-3',
      name: '🪑 真實椅子', // 新增這個！
      type: 'model',
      dimensions: [1, 1, 1], // 即使是模型，我們也需要一個「佔地面積」給 2D 用
      modelUrl: '/Executive Chair.glb', // <--- 這裡對應 public/Executive Chair.glb
      color: '#ffffff' // 模型通常有自己的貼圖，但這個顏色可以用來做 fallback
    }
  ]

  return (
    <div style={{
      width: '250px',
      height: '100%',
      background: '#2c3e50',
      color: 'white',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '1.5rem' }}>🪑 家具目錄</h2>
      
      {/* 1. 商品列表區 */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
        <h3 style={{ borderBottom: '1px solid #7f8c8d', paddingBottom: '10px' }}>新增家具</h3>
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
                transition: 'background 0.2s',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onMouseOver={(e) => e.target.style.background = '#2980b9'}
              onMouseOut={(e) => e.target.style.background = '#34495e'}
            >
              <span>{item.name}</span>
              <span style={{ fontSize: '0.8em', color: '#95a5a6' }}>
                {item.dimensions[0]}x{item.dimensions[2]}m
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. 已放置清單區 (簡易管理) */}
      <div style={{ flex: 1, overflowY: 'auto', borderTop: '2px solid #7f8c8d', paddingTop: '10px' }}>
        <h3>已放置 ({furnitureList.length})</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
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
              <span style={{ fontSize: '0.9em' }}>{item.name}</span>
              <button 
                onClick={() => removeFurniture(item.id)}
                style={{
                  background: '#c0392b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '2px 6px',
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

      <div style={{ marginTop: 'auto', fontSize: '0.8rem', color: '#95a5a6', textAlign: 'center' }}>
        RoomCraft v0.1 Alpha
      </div>
    </div>
  )
}