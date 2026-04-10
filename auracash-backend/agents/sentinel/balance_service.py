from datetime import datetime
import logging
from core.supabase_client import supabase

logger = logging.getLogger(__name__)

def _today_utc():
    return datetime.utcnow().date().isoformat()

def _has_snapshot_today(user_id, bank_account_id):
    today = _today_utc()
    res = supabase.table("balance_snapshots") \
        .select("id") \
        .eq("user_id", user_id) \
        .eq("bank_account_id", bank_account_id) \
        .gte("fetched_at", f"{today}T00:00:00") \
        .lte("fetched_at", f"{today}T23:59:59") \
        .execute()
    return len(res.data) > 0

def _get_latest_balance(user_id, bank_account_id):
    res = supabase.table("balance_snapshots") \
        .select("balance") \
        .eq("user_id", user_id) \
        .eq("bank_account_id", bank_account_id) \
        .order("fetched_at", descending=True) \
        .limit(1) \
        .execute()
    if res.data:
        return float(res.data[0]["balance"])
    return None

def _save_snapshot(user_id, bank_account_id, balance):
    data = {
        "user_id": user_id,
        "bank_account_id": bank_account_id,
        "balance": balance,
        "fetched_at": datetime.utcnow().isoformat()
    }
    supabase.table("balance_snapshots").insert(data).execute()

def run_daily_snapshot(user_id):
    # Fetch bank accounts for user
    res = supabase.table("bank_accounts").select("id, bank_name").eq("user_id", user_id).execute()
    accounts = res.data
    
    for acc in accounts:
        bank_id = acc["id"]
        bank_name = acc["bank_name"]
        
        if _has_snapshot_today(user_id, bank_id):
            print(f"[Sentinel] user={user_id} {bank_name} updated today — skipping")
            continue
            
        latest_balance = _get_latest_balance(user_id, bank_id)
        if latest_balance is not None:
            _save_snapshot(user_id, bank_id, latest_balance)
            print(f"[Sentinel] Carried forward user={user_id} | {bank_name} | ₹{latest_balance}")
        else:
            print(f"[Sentinel] No balance history for user={user_id} {bank_name} — skipping")
