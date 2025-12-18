import { create } from 'zustand'

const useStore = create((set) => ({
  roomDimensions: { width: 10, length: 10 },
  
  furniture: [],

  updateFurniturePosition: (id, newPosition) => set((state) => ({
    furniture: state.furniture.map((item) =>
      item.id === id ? { ...item, position: newPosition } : item
    ),
  })),
  
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
          rotation: 0,
          ...itemConfig,
          // 1. 新增：模型路徑
          // 如果傳入的 config 有 modelUrl 就用，沒有就 undefined (會變回方塊)
          modelUrl: itemConfig.modelUrl,
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