import { create } from 'zustand'

const useStore = create((set) => ({
  // 1. 狀態 (State)
  roomDimensions: { width: 10, length: 10 },
  
  furniture: [],

  // 2. 動作 (Actions)
  updateFurniturePosition: (id, newPosition) => set((state) => ({
    furniture: state.furniture.map((item) =>
      item.id === id ? { ...item, position: newPosition } : item
    ),
  })),

  addFurniture: (itemConfig) => set((state) => {
    // 防禦機制：確保 dimensions 存在，如果不存在給預設值 [1, 1, 1]
    const dims = itemConfig.dimensions || [1, 1, 1];
    
    // 防禦機制：確保高度 (y) 至少有個數值
    const height = dims[1] || 1;

    return {
      furniture: [
        ...state.furniture,
        {
          id: Math.random().toString(36).substr(2, 9),
          // 確保 position 陣列是完整的數字
          position: [0, height / 2, 0], 
          ...itemConfig, 
          dimensions: dims, // 強制寫入 dimensions，避免之後找不到
        }
      ]
    };
  }),
  
  removeFurniture: (id) => set((state) => ({
    furniture: state.furniture.filter(item => item.id !== id)
  })),
}))

export default useStore