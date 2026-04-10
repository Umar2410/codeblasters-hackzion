import os
import json
import asyncio
from typing import Dict, Any
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pywebpush import webpush, WebPushException
from supabase import create_async_client, AsyncClient
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# VAPID Setup
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY")
VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY")
VAPID_EMAIL = os.getenv("VAPID_EMAIL")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Async Supabase Client
supabase: AsyncClient = None

async def send_notification(subscription: Dict[str, Any], payload: Dict[str, Any]):
    """Sends a web push notification via pywebpush."""
    try:
        webpush(
            subscription_info={
                "endpoint": subscription["endpoint"],
                "keys": {
                    "p256dh": subscription["p256dh"],
                    "auth": subscription["auth"]
                }
            },
            data=json.dumps(payload),
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims={"sub": f"mailto:{VAPID_EMAIL}"}
        )
        print("Successfully sent push notification")
    except WebPushException as ex:
        print(f"WebPush error: {ex}")
        if ex.response and ex.response.status_code == 410:
            await supabase.table("push_subscriptions").delete().eq("endpoint", subscription["endpoint"]).execute()

async def realtime_listener():
    """Listens to Supabase Realtime for changes in the 'initial_plan' table."""
    print("Starting Supabase Realtime listener on 'initial_plan'...")
    
    async def on_change(payload):
        try:
            # Safely print for Windows terminals
            clean_payload = str(payload).encode('ascii', 'ignore').decode('ascii')
            print(f"Plan change detected: {clean_payload}")
        except:
            print("Plan change detected (contains non-ascii characters)")
            
        new_row = payload.get('new')
        if not new_row: return
        
        message = {
            "title": new_row.get('title', 'New Investment Plan'),
            "body": new_row.get('plan', 'A new plan is ready for your review.'),
            "plan_id": new_row.get('id')
        }
        
        # Fetch all active subscriptions
        subs = await supabase.table("push_subscriptions").select("*").execute()
        for sub in subs.data:
            await send_notification(sub, message)
            
        # Update notification_status to 'sent'
        await supabase.table("initial_plan").update({"notification_status": "sent"}).eq("id", new_row.get('id')).execute()

    try:
        # Corrected method name for Supabase Python AsyncClient v2
        channel = supabase.channel("initial-plan-changes")
        await channel.on_postgres_changes(
            event="*", 
            schema="public", 
            table="initial_plan", 
            callback=on_change
        ).subscribe()
        
        # Keep the listener alive
        while True:
            await asyncio.sleep(10)
    except Exception as e:
        print(f"Realtime listener error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    global supabase
    supabase = await create_async_client(SUPABASE_URL, SUPABASE_KEY)
    # Start the realtime listener in the background
    listener_task = asyncio.create_task(realtime_listener())
    yield
    listener_task.cancel()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Subscription(BaseModel):
    endpoint: str
    keys: Dict[str, str]

class PlanResponse(BaseModel):
    plan_id: str
    action: str

@app.post("/subscribe")
async def subscribe(sub: Subscription):
    try:
        data = {
            "endpoint": sub.endpoint,
            "p256dh": sub.keys["p256dh"],
            "auth": sub.keys["auth"]
        }
        await supabase.table("push_subscriptions").upsert(data, on_conflict="endpoint").execute()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/response")
async def handle_response(resp: PlanResponse):
    try:
        status_update = {
            "notification_status": f"processed_{resp.action}",
            "user_response": resp.action,
            "updated_at": "now()"
        }
        await supabase.table("initial_plan").update(status_update).eq("id", resp.plan_id).execute()
        return {"status": "updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
