import axios from 'axios';

// 設定後端網址
const API_URL = 'http://localhost:8000';

// 1. 取得設計列表
export const fetchDesigns = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/designs`);
    return response.data;
  } catch (error) {
    console.error("無法取得專案列表:", error);
    throw error;
  }
};

// 2. 存檔
export const saveDesign = async (id, designData) => {
  try {
    const response = await axios.post(`${API_URL}/api/save/${id}`, designData);
    return response.data;
  } catch (error) {
    console.error("存檔失敗:", error);
    throw error;
  }
};

// 3. 讀檔
export const loadDesign = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/load/${id}`);
    return response.data;
  } catch (error) {
    console.error("讀檔失敗:", error);
    throw error;
  }
};

// 4. 刪除
export const deleteDesign = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/api/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("刪除失敗:", error);
    throw error;
  }
};

// 5. 取得家具目錄
export const fetchCatalog = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/catalog`);
    return response.data;
  } catch (error) {
    console.error("無法取得家具目錄:", error);
    // 回傳空陣列避免前端崩潰
    return [];
  }
};