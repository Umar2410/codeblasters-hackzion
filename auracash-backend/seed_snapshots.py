import sys
import random
from datetime import datetime, timedelta
from core.supabase_client import supabase

def seed_snapshots(user_id):
    # 1. Get bank account for user
    res = supabase.table("bank_accounts").select("id").eq("user_id", user_id).execute()
    if not res.data:
        print(f"Error: No bank account found for user {user_id}")
        return
    
    bank_acc_id = res.data[0]["id"]
    
    # 2. Generate 7 days of snapshots
    base_balance = 50000.0
    for i in range(7, -1, -1):
        snapshot_time = datetime.utcnow() - timedelta(days=i)
        # Random variance in balance
        current_balance = base_balance + random.uniform(-5000, 5000)
        
        data = {
            "user_id": user_id,
            "bank_account_id": bank_acc_id,
            "balance": round(current_balance, 2),
            "fetched_at": snapshot_time.isoformat()
        }
        
        supabase.table("balance_snapshots").insert(data).execute()
        print(f"Inserted snapshot for {snapshot_time.date()}: Rs. {data['balance']}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python seed_snapshots.py <user_id>")
    else:
        seed_snapshots(sys.argv[1])
