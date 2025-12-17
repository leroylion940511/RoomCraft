import React from 'react'
import useStore from '../store'
import { CATALOG_ITEMS } from '../data/catalog'

export default function Sidebar() {
  const addFurniture = useStore(state => state.addFurniture)
  const furnitureList = useStore(state => state.furniture)
  const removeFurniture = useStore(state => state.removeFurniture)

  return (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      background: "#222", 
      color: "white", 
      padding: "15px",
      boxSizing: "border-box",
      overflowY: "auto"
    }}>
      <h3 style={{ borderBottom: "1px solid #444", paddingBottom: "10px" }}>傢俱庫</h3>
      
      {/* 1. 傢俱清單按鈕 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        {CATALOG_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => addFurniture(item)}
            style={{
              padding: "10px",
              background: "#333",
              border: "1px solid #444",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px"
            }}
          >
            {/* 簡單的顏色預覽 */}
            <div style={{ width: "20px", height: "20px", background: item.color, borderRadius: "50%" }}></div>
            <span style={{ fontSize: "12px" }}>{item.name}</span>
          </button>
        ))}
      </div>

      <h3 style={{ borderBottom: "1px solid #444", paddingBottom: "10px" }}>已放置物件</h3>
      
      {/* 2. 已放置物件列表 (可刪除) */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {furnitureList.map(item => (
          <li key={item.id} style={{ 
            marginBottom: "8px", 
            padding: "8px", 
            background: "#333", 
            fontSize: "12px",
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span>{item.name}</span>
            <button 
              onClick={() => removeFurniture(item.id)}
              style={{ background: "#d32f2f", border: "none", color: "white", borderRadius: "3px", cursor: "pointer" }}
            >
              X
            </button>
          </li>
        ))}
        {furnitureList.length === 0 && <span style={{ color: "#666", fontSize: "12px" }}>尚無物件</span>}
      </ul>
    </div>
  )
}