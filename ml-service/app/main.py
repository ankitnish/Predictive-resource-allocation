from fastapi import FastAPI
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Predictive Resource Allocation - ML Service")

client = MongoClient(os.getenv("MONGODB_URI"))
db = client.get_default_database()

@app.get("/health")
async def health():
    return {"success": True, "message": "ML service is running"}

@app.get("/debug/incident-count")
async def incident_count():
    count = db.incidents.count_documents({})
    return {"success": True, "data": {"incidentCount": count}}