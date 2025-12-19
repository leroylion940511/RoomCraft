import React, { useState, useEffect } from 'react'
import useStore from '../store'
import { saveDesign, loadDesign, fetchDesigns, deleteDesign, fetchCatalog } from '../api'

export default function Sidebar() {
  // --- Store State & Actions ---
  const addFurniture = useStore((state) => state.addFurniture)
  const removeFurniture = useStore((state) => state.removeFurniture)
  const furnitureList = useStore((state) => state.furniture)
  const roomDim = useStore((state) => state.roomDimensions)
  const setRoomDimensions = useStore((state) => state.setRoomDimensions)
  const roomStyle = useStore((state) => state.roomStyle)
  const setRoomStyle = useStore((state) => state.setRoomStyle)
  const setFurniture = useStore((state) => state.setFurniture)

  // --- Local State (UI 狀態) ---
  const [designList, setDesignList] = useState([]) // 存檔列表
  const [currentId, setCurrentId] = useState("my-room") // 目前的檔案 ID
  const [designName, setDesignName] = useState("我的新設計") // 目前的檔案名稱
  
  const [catalog, setCatalog] = useState([]) // 家具目錄
  const [activeCategory, setActiveCategory] = useState("all") // 目前選中的分類

  // --- 初始化：抓取存檔列表與家具目錄 ---
  useEffect(() => {
    refreshList()
    initCatalog()
  }, [])

  const refreshList = async () => {
    try {
      const list = await fetchDesigns()
      setDesignList(list)
    } catch (e) {
      console.log("後端沒開？無法取得專案列表")
    }
  }

  const initCatalog = async () => {
    const data = await fetchCatalog()
    setCatalog(data)
  }

  // --- 處理存檔 ---
  const handleSave = async () => {
    if (furnitureList.length === 0) {
      if(!confirm("房間是空的，確定要存檔嗎？")) return;
    }

    const designData = {
      name: designName,
      roomDimensions: roomDim,
      roomStyle: roomStyle,
      furniture: furnitureList
    }

    try {
      await saveDesign(currentId, designData)
      alert(`✅ 存檔成功！`)
      refreshList() // 更新列表
    } catch (error) {
      alert("❌ 存檔失敗，請確認後端是否開啟")
    }
  }

  // --- 處理讀檔 ---
  const handleLoad = async (id) => {
    try {
      const data = await loadDesign(id)
      
      if (data) {
        // 同步所有狀態回 Store
        if (data.roomDimensions) setRoomDimensions(data.roomDimensions.width, data.roomDimensions.length)
        if (data.roomStyle) setRoomStyle(data.roomStyle)
        if (data.furniture) setFurniture(data.furniture)
        
        // 更新 UI 狀態
        setCurrentId(id)
        setDesignName(data.name)
        alert(`📂 已載入：${data.name}`)
      }
    } catch (error) {
      alert("❌ 讀檔失敗")
    }
  }

  // --- 處理刪除 ---
  const handleDelete = async (id, name) => {
    if (!confirm(`確定要刪除「${name}」嗎？這無法復原喔！`)) return
    try {
      await deleteDesign(id)
      // 如果刪掉的是當前正在編輯的，重置為新專案
      if (id === currentId) {
        handleNewProject()
      }
      refreshList()
    } catch (error) {
      alert("❌ 刪除失敗")
    }
  }

  // --- 開新專案 ---
  const handleNewProject = () => {
    // 這裡簡單重置，實務上應該提示是否保存舊進度
    setFurniture([])
    setCurrentId(`design-${Date.now()}`) // 產生新的隨機 ID
    setDesignName("未命名設計")
    setRoomDimensions(10, 10) // 重置為預設尺寸
    setRoomStyle({ floorColor: '#555555', wallColor: '#f0f0f0' }) // 重置顏色
  }

  // --- 處理尺寸輸入 ---
  const handleDimChange = (e, type) => {
    const val = parseFloat(e.target.value)
    if (isNaN(val) || val <= 0) return 
    if (type === 'width') setRoomDimensions(val, roomDim.length)
    else setRoomDimensions(roomDim.width, val)
  }

  // --- 目錄篩選 ---
  const filteredCatalog = activeCategory === 'all' 
    ? catalog 
    : catalog.filter(item => item.category === activeCategory)

  return (
    <div style={{ width: '280px', height: '100%', background: '#2c3e50', color: 'white', display: 'flex', flexDirection: 'column', borderRight: '1px solid #34495e', boxSizing: 'border-box' }}>
      
      {/* 1. 頂部：專案管理區 */}
      <div style={{ padding: '15px', background: '#233040', borderBottom: '1px solid #34495e' }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', textAlign: 'center' }}>🗄️ 專案管理</h2>
        
        <div style={{ marginBottom: '10px' }}>
            <label style={{fontSize: '0.8rem', color:'#bdc3c7'}}>專案名稱</label>
            <input 
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                style={{ width: '100%', padding: '5px', boxSizing: 'border-box', marginTop: '2px' }}
            />
        </div>

        <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
            <button onClick={handleSave} style={{ flex: 1, padding: '6px', background: '#27ae60', color: 'white', border:'none', cursor:'pointer', borderRadius: '3px' }}>💾 儲存</button>
            <button onClick={handleNewProject} style={{ flex: 1, padding: '6px', background: '#2980b9', color: 'white', border:'none', cursor:'pointer', borderRadius: '3px' }}>📄 新建</button>
        </div>

        {/* 存檔列表區塊 */}
        <div style={{ maxHeight: '100px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', padding: '5px' }}>
            <div style={{fontSize: '0.8rem', color:'#bdc3c7', marginBottom:'5px'}}>已存檔案 ({designList.length})</div>
            {designList.length === 0 && <div style={{fontSize:'0.8rem', color:'#7f8c8d', textAlign:'center'}}>暫無存檔</div>}
            {designList.map(d => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px', padding: '4px', borderRadius: '3px', background: currentId===d.id ? '#34495e' : 'transparent', alignItems: 'center' }}>
                    <span 
                        onClick={() => handleLoad(d.id)} 
                        style={{ cursor: 'pointer', textDecoration: 'underline', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'140px', color: currentId===d.id ? '#3498db' : 'white' }}
                        title={d.name}
                    >
                        {d.name}
                    </span>
                    <span onClick={() => handleDelete(d.id, d.name)} style={{ cursor: 'pointer', color: '#e74c3c', fontWeight: 'bold', padding: '0 5px' }}>✕</span>
                </div>
            ))}
        </div>
      </div>

      {/* 2. 中間：房間設定 */}
      <div style={{ padding: '15px', overflowY: 'auto', flexShrink: 0 }}>
        <h3 style={{ fontSize: '1rem', marginTop: 0, marginBottom: '10px' }}>🏠 房間設定</h3>
        
        {/* 尺寸輸入 */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.8em', color: '#bdc3c7' }}>寬(X)</label>
            <input type="number" value={roomDim.width} onChange={(e)=>handleDimChange(e, 'width')} style={{width:'100%', padding: '4px', border: 'none', borderRadius: '3px'}}/>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.8em', color: '#bdc3c7' }}>長(Z)</label>
            <input type="number" value={roomDim.length} onChange={(e)=>handleDimChange(e, 'length')} style={{width:'100%', padding: '4px', border: 'none', borderRadius: '3px'}}/>
          </div>
        </div>

        {/* 顏色選擇 */}
        <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8em', color: '#bdc3c7' }}>地板色</label>
              <input type="color" value={roomStyle.floorColor} onChange={(e)=>setRoomStyle({floorColor: e.target.value})} style={{width:'100%', height:'30px', border:'none', padding: 0, cursor:'pointer'}} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8em', color: '#bdc3c7' }}>牆壁色</label>
              <input type="color" value={roomStyle.wallColor} onChange={(e)=>setRoomStyle({wallColor: e.target.value})} style={{width:'100%', height:'30px', border:'none', padding: 0, cursor:'pointer'}} />
            </div>
        </div>
      </div>

      <hr style={{ border: '0', borderTop: '1px solid #7f8c8d', margin: 0 }} />

      {/* 3. 下方：家具目錄 & 清單 */}
      <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1rem', marginTop: 0, marginBottom: '10px' }}>🛒 家具目錄</h3>
        
        {/* 分類按鈕 */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', overflowX: 'auto', paddingBottom:'5px' }}>
          {['all', 'bedroom', 'living_room', 'dining', 'decoration'].map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? '#3498db' : '#34495e',
                color: 'white', border: 'none', borderRadius: '15px', padding: '4px 10px', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              {cat === 'all' ? '全部' : cat}
            </button>
          ))}
        </div>

        {/* 動態商品列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {filteredCatalog.map((item) => (
            <button
              key={item.id}
              onClick={() => addFurniture(item)}
              style={{
                padding: '10px',
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
              <span>{item.type === 'model' ? '📦 ' : '🟦 '}{item.name}</span>
              <span style={{ fontSize: '0.8em', color: '#bdc3c7' }}>
                {item.dimensions[0]}x{item.dimensions[2]}m
              </span>
            </button>
          ))}
          {filteredCatalog.length === 0 && (
             <div style={{ textAlign: 'center', color: '#95a5a6', fontSize: '0.9rem' }}>
               {catalog.length === 0 ? "正在讀取目錄..." : "此分類無商品"}
             </div>
          )}
        </div>

        {/* 已放置列表 */}
        <div style={{ borderTop: '1px solid #555', paddingTop: '10px', marginTop: 'auto' }}>
            <div style={{fontSize:'0.9rem', marginBottom:'5px'}}>已放置物件 ({furnitureList.length})</div>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {furnitureList.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px', background: 'rgba(0,0,0,0.2)', padding:'5px', borderRadius: '3px', alignItems: 'center' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{item.name}</span>
                      <button onClick={() => removeFurniture(item.id)} style={{background:'#c0392b', border:'none', color:'white', cursor:'pointer', borderRadius: '2px', padding: '2px 6px'}}>刪除</button>
                  </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  )
}