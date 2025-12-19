import { create } from 'zustand'

const useStore = create((set) => ({
  roomDimensions: { width: 10, length: 10 },
  
  // --- 新增：房間風格設定 (地板與牆壁顏色) ---
  roomStyle: {
    floorColor: '#555555', // 預設深灰地板
    wallColor: '#f0f0f0',  // 預設米白牆壁
  },

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

  setFurniture: (newFurnitureList) => set({ furniture: newFurnitureList }),

  setRoomDimensions: (width, length) => set({ 
    roomDimensions: { width, length } 
  }),

  // --- 新增：設定房間風格的動作 ---
  setRoomStyle: (newStyle) => set((state) => ({
    roomStyle: { ...state.roomStyle, ...newStyle }
  })),

  addFurniture: (itemConfig) => set((state) => {
    const { id, ...restConfig } = itemConfig;
    const dims = itemConfig.dimensions || [1, 1, 1];
    const height = dims[1] || 1;

    return {
      furniture: [
        ...state.furniture,
        {
          ...restConfig, 
          id: crypto.randomUUID(),
          position: [0, height / 2, 0], 
          rotation: 0,
          dimensions: dims,
          modelUrl: itemConfig.modelUrl,
        }
      ]
    };
  }),
  
  removeFurniture: (id) => set((state) => ({
    furniture: state.furniture.filter(item => item.id !== id)
  })),
}))

export default useStore