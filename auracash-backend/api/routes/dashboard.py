from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests

router = APIRouter()

# --- THE EXACT CODE YOU PROVIDED ---
API_URL = "http://localhost:3000/api/v1/prediction/e2875a21-4c75-4cba-a17a-3be18e56ba00"

def query(payload):
    response = requests.post(API_URL, json=payload)
    return response.json()
# -----------------------------------

class ChatPayload(BaseModel):
    question: str

@router.post("/chat")
async def chat_proxy(payload: ChatPayload):
    try:
        # Using your exact query function
        output = query({
            "question": payload.question
        })
        return output
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
