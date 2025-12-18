from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
# 1. 引入 MongoDB 驅動程式
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()

# CORS 設定
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 資料庫連線設定 ---
# MongoDB 預設 port 是 27017
MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.roomcraft_db  # 自動建立一個叫做 roomcraft_db 的資料庫
collection = db.designs   # 自動建立一個叫做 designs 的集合 (類似 Table)

# --- 資料模型 (維持不變) ---
class FurnitureItem(BaseModel):
    id: str
    name: str
    type: str = "box"
    position: List[float]
    dimensions: List[float]
    rotation: float = 0
    color: str = "#ffffff"
    modelUrl: Optional[str] = None

class RoomDimensions(BaseModel):
    width: float
    length: float

class RoomDesign(BaseModel):
    name: str
    roomDimensions: RoomDimensions
    furniture: List[FurnitureItem]

# --- API 路由 ---

@app.get("/")
def read_root():
    return {"status": "Connected to MongoDB!"}

# 存檔 API (改成 async)
@app.post("/api/save/{design_id}")
async def save_design(design_id: str, design: RoomDesign):
    # 將 Pydantic 物件轉成 dict
    design_dict = design.dict()
    
    # 使用 design_id 作為 MongoDB 的主鍵 (_id)
    # 這樣如果不小心重複存檔，它會覆蓋舊的，而不是新增一筆
    design_dict["_id"] = design_id
    
    # update_one(查詢條件, 更新內容, upsert=True)
    # upsert=True 代表：找不到就新增，找得到就更新
    await collection.update_one(
        {"_id": design_id}, 
        {"$set": design_dict}, 
        upsert=True
    )
    
    print(f"✅ MongoDB: 已儲存設計 {design_id}")
    return {"message": "Saved successfully", "id": design_id}

# 讀檔 API (改成 async)
@app.get("/api/load/{design_id}")
async def load_design(design_id: str):
    # 從 MongoDB 尋找
    document = await collection.find_one({"_id": design_id})
    
    if document:
        print(f"📂 MongoDB: 讀取設計 {design_id}")
        return document
    else:
        raise HTTPException(status_code=404, detail="Design not found")