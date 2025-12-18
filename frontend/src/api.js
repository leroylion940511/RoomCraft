// src/api.js
import axios from 'axios';

// 設定後端網址
const API_URL = 'http://localhost:8000';

export const saveDesign = async (designData) => {
  try {
    // 這裡我們暫時用 "my-room" 當作存檔 ID
    const response = await axios.post(`${API_URL}/api/save/my-room`, designData);
    console.log("存檔成功:", response.data);
    return response.data;
  } catch (error) {
    console.error("存檔失敗:", error);
    throw error;
  }
};

export const loadDesign = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/load/my-room`);
    console.log("讀檔成功:", response.data);
    return response.data;
  } catch (error) {
    console.error("讀檔失敗:", error);
    throw error;
  }
};