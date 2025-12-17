// src/data/catalog.js

// 這裡模擬從資料庫抓回來的傢俱清單
// 尺寸單位：公尺 [寬(x), 高(y), 深(z)]
export const CATALOG_ITEMS = [
  {
    id: 'bed_double',
    name: '雙人床',
    type: 'bed',
    dimensions: [1.8, 0.5, 2.0], 
    color: '#E57373', // 淺紅
  },
  {
    id: 'desk_office',
    name: '辦公桌',
    type: 'table',
    dimensions: [1.2, 0.75, 0.6], 
    color: '#FFF176', // 淺黃
  },
  {
    id: 'wardrobe',
    name: '衣櫃',
    type: 'cabinet',
    dimensions: [0.8, 2.0, 0.6], 
    color: '#81C784', // 淺綠
  },
  {
    id: 'chair',
    name: '椅子',
    type: 'chair',
    dimensions: [0.5, 0.5, 0.5], 
    color: '#64B5F6', // 淺藍
  },
]