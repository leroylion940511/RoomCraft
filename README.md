# RoomCraft - 3D 室內設計與擺設系統

**RoomCraft** 是一個全端 (Full-Stack) 的互動式室內設計應用程式。使用者可以在 2D 平面圖上拖曳家具，並即時在 3D 視角中預覽擺設效果。專案具備完整的後端資料庫支援，實現了設計存檔、多專案管理以及動態家具目錄系統。

## 核心功能 (Features)

### 2D 編輯器 (互動核心)

* **拖曳擺放**：直覺的拖曳操作，支援網格吸附 (Grid Snapping)。
* **智慧碰撞偵測**：
* **視覺回饋**：當家具重疊時，邊框即時變紅警告。
* **自動彈開 (Smart Snap)**：若放置位置不合法，家具會自動彈回最近的合法邊緣，實現磁吸式對齊效果。
* **旋轉保護**：旋轉時若會撞到牆壁或其他物體，系統會自動計算並將物體推移至安全位置，防止穿模。


* **動態房間尺寸**：可即時調整房間長寬，網格與邊界會自動更新。

### 3D 預覽 (視覺呈現)

* **即時同步**：2D 的任何更動都會毫秒級同步至 3D 場景。
* **真實渲染**：
* 支援 **GLTF/GLB** 真實 3D 模型載入。
* 配備 **Environment Lighting** (環境光) 與 **Contact Shadows** (接觸陰影)，提升落地感與真實度。
* 自動生成 L 型牆面，提供沈浸式空間感。


* **風格自定義**：支援即時更換地板與牆壁顏色。

### 系統與資料 (全端架構)

* **專案管理**：支援多個設計圖存檔、讀取、刪除與新建。
* **動態家具目錄**：家具清單並非寫死，而是從 MongoDB 資料庫動態載入，支援分類篩選 (臥室、客廳等)。
* **RESTful API**：完整的 Python FastAPI 後端架構。

---

## 技術棧 (Tech Stack)

### Frontend (前端)

* **Framework**: React (Vite)
* **2D Graphics**: `react-konva` (Canvas API 封裝)
* **3D Graphics**: `@react-three/fiber`, `@react-three/drei` (Three.js 封裝)
* **State Management**: `zustand` (跨組件狀態同步)
* **HTTP Client**: `axios`

### Backend (後端)

* **Framework**: FastAPI (高效能 Python Web 框架)
* **Database Driver**: `motor` (MongoDB 非同步驅動)
* **Data Validation**: `pydantic`
* **Server**: `uvicorn`

### Database (資料庫)

* **MongoDB**: 儲存家具目錄 (Catalog) 與使用者設計圖 (Designs)。

---

## 快速啟動 (Quick Start)

請開啟三個終端機視窗 (Terminal Tabs)，依序執行以下步驟：

### 1. 啟動資料庫

確保 MongoDB 服務已在背景執行 (預設 Port 27017)。

```bash
# macOS (Homebrew)
brew services start mongodb-community

```

### 2. 啟動後端伺服器

```bash
cd backend

# 建立/啟用虛擬環境 (首次執行)
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安裝依賴 (首次執行)
pip install -r requirements.txt
# 或手動安裝: pip install fastapi "uvicorn[standard]" motor pydantic

# 啟動伺服器 (Port: 8000)
uvicorn main:app --reload

```

### 3. 啟動前端應用

```bash
cd frontend

# 安裝依賴 (首次執行)
npm install

# 啟動開發伺服器 (Port: 5173)
npm run dev

```

> 網頁將運行於：[http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)

---

## 資料初始化 (Data Seeding)

**重要：首次執行必做**
剛啟動時，家具目錄可能是空的。請執行以下步驟將預設家具寫入資料庫：

1. 確保後端 (`uvicorn`) 正在執行。
2. 前往 API 文件頁面：[http://127.0.0.1:8000/docs](https://www.google.com/search?q=http://127.0.0.1:8000/docs)
3. 找到並展開 **POST** `/api/catalog/seed`。
4. 點擊 **Try it out** -> **Execute**。
5. 確認回傳 Code 為 **200**。
6. 回到前端網頁刷新，側邊欄即會顯示家具列表。

---

## 操作說明 (Controls)

* **新增家具**：點擊左側側邊欄的家具項目。
* **移動家具**：在 2D 視圖 (左區塊) 按住滑鼠左鍵拖曳。
* **旋轉家具**：在 2D 視圖 **雙擊 (Double Click)** 家具，每次旋轉 90 度。
* **刪除家具**：點擊側邊欄右下角的「已放置清單」中的刪除按鈕。
* **3D 視角控制**：
* **旋轉**：按住滑鼠左鍵拖曳。
* **平移**：按住滑鼠右鍵拖曳。
* **縮放**：滾動滑鼠滾輪。



---

## 專案結構 (Project Structure)

```text
RoomCraft/
├── backend/                # Python 後端
│   ├── main.py             # API 路由與資料庫邏輯
│   ├── requirements.txt    # Python 依賴清單
│   └── ...
├── frontend/               # React 前端
│   ├── public/             # 靜態資源
│   │   └── models/         # 3D 模型 (.glb) 存放處
│   ├── src/
│   │   ├── components/
│   │   │   ├── Editor2D.jsx  # 2D 編輯器與碰撞邏輯
│   │   │   ├── View3D.jsx    # 3D 場景渲染
│   │   │   └── Sidebar.jsx   # UI 介面與資料管理
│   │   ├── store.js        # Zustand 全域狀態管理
│   │   └── api.js          # Axios API 封裝
│   └── ...
└── README.md

```

---

## 開發筆記與模型資源

* 本專案使用 **Low Poly** 風格模型以確保網頁效能。
* 若需新增模型，請將 `.glb` 檔案放入 `frontend/public/models/`，並修改 `backend/main.py` 中的 `seed_catalog` 資料結構，重新執行 Seed API 即可。

---

### Author

* **張志晨 (Leroy)**
* GitHub: [leroylion940511](https://www.google.com/search?q=https://github.com/leroylion940511)