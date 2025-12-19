from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()

# --- CORS 設定 ---
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MongoDB 連線設定 ---
MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.roomcraft_db
collection_designs = db.designs   # 存房間設計
collection_catalog = db.catalog   # 存家具目錄

# --- Pydantic 資料模型 ---

# 家具項目 (在房間內)
class FurnitureItem(BaseModel):
    id: str
    name: str
    type: str = "box"
    position: List[float]
    dimensions: List[float]
    rotation: float = 0
    color: str = "#ffffff"
    modelUrl: Optional[str] = None

# 房間風格
class RoomStyle(BaseModel):
    floorColor: str = '#555555'
    wallColor: str = '#f0f0f0'

# 房間尺寸
class RoomDimensions(BaseModel):
    width: float
    length: float

# 完整的設計存檔結構
class RoomDesign(BaseModel):
    name: str
    roomDimensions: RoomDimensions
    roomStyle: Optional[RoomStyle] = None
    furniture: List[FurnitureItem]

# 家具目錄項目 (商品資料庫)
class CatalogItem(BaseModel):
    id: str
    name: str
    type: str = "model"
    dimensions: List[float]
    modelUrl: Optional[str] = None
    color: str = "#ffffff"
    category: str = "general"

# --- API 路由 ---

@app.get("/")
def read_root():
    return {"status": "RoomCraft Backend is Running!"}

# 1. 取得所有設計圖列表 (只回傳 ID 和 Name)
@app.get("/api/designs")
async def get_all_designs():
    designs = []
    # 投影查詢：只抓 name 欄位
    cursor = collection_designs.find({}, {"name": 1}) 
    async for document in cursor:
        designs.append({
            "id": document["_id"],
            "name": document.get("name", "未命名設計")
        })
    return designs

# 2. 存檔 (Upsert: 更新或插入)
@app.post("/api/save/{design_id}")
async def save_design(design_id: str, design: RoomDesign):
    design_dict = design.dict()
    design_dict["_id"] = design_id
    
    await collection_designs.update_one(
        {"_id": design_id}, 
        {"$set": design_dict}, 
        upsert=True
    )
    return {"message": "Saved successfully", "id": design_id}

# 3. 讀檔
@app.get("/api/load/{design_id}")
async def load_design(design_id: str):
    document = await collection_designs.find_one({"_id": design_id})
    if document:
        return document
    else:
        raise HTTPException(status_code=404, detail="Design not found")

# 4. 刪除設計
@app.delete("/api/delete/{design_id}")
async def delete_design(design_id: str):
    result = await collection_designs.delete_one({"_id": design_id})
    if result.deleted_count == 1:
        return {"message": "Deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Design not found")

# 5. 取得家具目錄
@app.get("/api/catalog")
async def get_catalog():
    items = []
    async for document in collection_catalog.find({}):
        # --- 修正：解決 ObjectId 無法序列化的問題 ---
        # 方法 A: 把 _id 轉成字串
        document["_id"] = str(document["_id"]) 
        
        # 或者 方法 B: 直接刪除 _id (如果前端用不到)
        # if "_id" in document:
        #     del document["_id"]
            
        items.append(document)
    return items

# 6. 初始化家具目錄 (Seed Data)
@app.post("/api/catalog/seed")
async def seed_catalog():
    # 先清空舊資料
    await collection_catalog.delete_many({})
    
    # 預設家具資料
    initial_data = [
        {
            "id": "item-bed-001",
            "name": "雙人軟床",
            "type": "model",
            "dimensions": [1.8, 0.5, 2.0],
            "modelUrl": "/models/bed.glb",
            "color": "#ffffff",
            "category": "bedroom"
        },
        {
            "id": "item-sofa-001",
            "name": "L型沙發",
            "type": "model",
            "dimensions": [2.5, 0.8, 1.5],
            "modelUrl": "/models/sofa.glb",
            "color": "#cccccc",
            "category": "living_room"
        },
        {
            "id": "item-table-001",
            "name": "原木餐桌",
            "type": "model",
            "dimensions": [1.6, 0.75, 0.9],
            "modelUrl": "/models/table.glb",
            "color": "#8b4513",
            "category": "dining"
        },
        {
            "id": "item-plant-001",
            "name": "室內盆栽",
            "type": "box",
            "dimensions": [0.4, 1.2, 0.4],
            "modelUrl": None,
            "color": "#27ae60",
            "category": "decoration"
        },
        {
            "id": "item-box-001",
            "name": "測試方塊",
            "type": "box",
            "dimensions": [1, 1, 1],
            "modelUrl": None,
            "color": "#ffaa00",
            "category": "general"
        }
    ]
    
    await collection_catalog.insert_many(initial_data)
    return {"message": "✅ 家具目錄已重置並寫入 MongoDB！"}