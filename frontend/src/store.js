import { create } from 'zustand'

const useStore = create((set) => ({
  roomDimensions: { width: 10, length: 10 },
  
  furniture: [],

  updateFurniturePosition: (id, newPosition) => set((state) => ({
    furniture: state.furniture.map((item) =>
      item.id === id ? { ...item, position: newPosition } : item
    ),
  })),
  
  // 1. 新增：更新旋轉角度
  updateFurnitureRotation: (id, newRotation) => set((state) => ({
    furniture: state.furniture.map((item) =>
      item.id === id ? { ...item, rotation: newRotation } : item
    ),
  })),

  addFurniture: (itemConfig) => set((state) => {
    const dims = itemConfig.dimensions || [1, 1, 1];
    
    const height = dims[1] || 1;

    return {
      furniture: [
        ...state.furniture,
        {
          id: Math.random().toString(36).substr(2, 9),
          position: [0, height / 2, 0], 
          rotation: 0, // 2. 新增：預設角度為 0
          ...itemConfig, 
          dimensions: dims,
        }
      ]
    };
  }),
  
  removeFurniture: (id) => set((state) => ({
    furniture: state.furniture.filter(item => item.id !== id)
  })),
}))

export default useStore