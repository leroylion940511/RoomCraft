# RoomCraft互動式 3D 虛擬房間設計工具

![Project Status](https://img.shields.io/badge/Status-Alpha%20MVP-orange)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react)
![Three.js](https://img.shields.io/badge/3D-Three.js_%2F_R3F-black?logo=three.js)
![Python](https://img.shields.io/badge/Backend-Python_FastAPI-3776AB?logo=python)

**RoomCraft** 是一個基於 WebGL 技術的現代化室內設計工具。它解決了傳統設計軟體操作複雜的問題，透過「雙向數據同步」技術，讓使用者在直覺的 2D 平面圖上進行拖曳佈局時，能夠即時（Real-time）看到 3D 空間的渲染成果。

> **作者**：張志晨 (中華大學資工系)
> **專案類型**：畢業專題 / WebGL 應用開發

---

## 核心功能 (Key Features)

* **2D/3D 雙向即時同步**：
    * 採用 **Zustand** 進行全域狀態管理，實現單一資料來源 (Single Source of Truth)。
    * 左側 2D 平面圖移動傢俱，右側 3D 模型毫秒級同步更新。
* **直覺的拖放操作 (Drag & Drop)**：
    * 基於 **Konva.js** 的互動式畫布。
    * 內建**自動邊界限制 (Boundary Check)**，防止物件被拖出房間範圍。
* **防禦性渲染機制 (Defensive Rendering)**：
    * 具備穩健的數據處理能力，即使後端數據缺漏（如缺少尺寸定義），系統仍能透過預設值安全渲染，防止程式崩潰。
* **空間方位輔助**：
    * 3D 視圖整合 **Gizmo 導航羅盤**與地板方位標示，解決使用者在 3D 空間迷失方向的問題。
* **模組化傢俱系統**：
    * 支援多態渲染 (Polymorphic Rendering)，根據傢俱屬性動態生成不同尺寸與顏色的 3D 模型。

---

## 技術堆疊 (Tech Stack)

### 前端 (Frontend)
* **核心框架**：React 18 (Vite 建置)
* **3D 引擎**：Three.js, React Three Fiber (R3F), Drei
* **2D 繪圖**：Konva.js, React-Konva
* **狀態管理**：Zustand
* **語言**：JavaScript (ES6+) / Planned migration to TypeScript

### 後端 (Backend) - *開發中*
* **框架**：Python FastAPI
* **資料庫**：MongoDB (NoSQL)

---

## 快速開始 (Getting Started)

如果你想在本地端運行此專案，請按照以下步驟操作：

### 1. 環境需求
* Node.js (v16 或更高版本)
* npm 或 yarn

### 2. 安裝與執行

```bash
# Clone 此專案
git clone https://github.com/leroylion940511/RoomCraft.git

# 進入前端目錄
cd RoomCraft/frontend

# 安裝依賴套件
npm install

# 啟動開發伺服器
npm run dev
```

啟動後，請打開瀏覽器訪問 http://localhost:5173 即可看到畫面。

---

## 📂 專案結構 (Project Structure)

```text
Plaintext
RoomCraft/
├── frontend/               # React 前端應用
│   ├── src/
│   │   ├── components/     # UI 組件
│   │   │   ├── Editor2D.jsx    # 2D 平面編輯器 (Konva)
│   │   │   ├── View3D.jsx      # 3D 場景渲染器 (R3F)
│   │   │   └── Sidebar.jsx     # 傢俱目錄側邊欄
│   │   ├── data/
│   │   │   └── catalog.js      # 傢俱靜態資料定義
│   │   ├── store.js        # Zustand 全域狀態管理 (核心)
│   │   ├── App.jsx         # 主佈局
│   │   └── main.jsx        # 入口點
│   └── package.json
├── backend/                # Python 後端 (建置中)
└── README.md
```

---

## 開發路線圖 (Roadmap)
- [x] **MVP 核心**：環境建置、2D/3D 同步、基礎拖曳。

- [x] **UI 優化**：側邊欄目錄、網格系統、方位標示。

- [ ] **進階互動**：

    - [ ] 傢俱旋轉功能 (Rotation)。

    - [ ] 碰撞偵測 (防止傢俱重疊)。

- [ ] **視覺升級**：

    - [ ] 引入 GLTF/GLB 真實 3D 模型。

    - [ ] PBR 材質與光影優化。

- [ ] **後端整合**：

    - [ ] 連接 Python FastAPI。

    - [ ] 實作專案存檔/讀取 (Save/Load) 功能。

---