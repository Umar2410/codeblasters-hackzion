from datetime import datetime, timedelta
import ollama
import statistics
from core.supabase_client import supabase
from core.config import settings

# Explicitly set the host if needed
# ollama.host = settings.OLLAMA_BASE_URL

def _get_snapshots_last_7_days(user_id):
    seven_days_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
    res = supabase.table("balance_snapshots") \
        .select("balance, fetched_at") \
        .eq("user_id", user_id) \
        .gte("fetched_at", seven_days_ago) \
        .execute()
    return res.data

def _compute_stats(snapshots):
    if not snapshots:
        return None
    
    balances = [float(s["balance"]) for s in snapshots]
    avg_balance = statistics.mean(balances)
    min_balance = min(balances)
    surplus_estimate = max(0, avg_balance - (min_balance * 1.2))
    week_start = (datetime.utcnow() - timedelta(days=7)).date().isoformat()
    
    return {
        "avg_balance": round(avg_balance, 2),
        "min_balance": round(min_balance, 2),
        "surplus_estimate": round(surplus_estimate, 2),
        "week_start": week_start
    }

def _call_ollama(stats):
    system_prompt = "You are a financial analyst for AuraCash. You must respond ONLY in English. Use professional yet friendly language."
    user_prompt = f"""
    A user's bank balance data for the past 7 days:
    - Average balance: Rs. {stats['avg_balance']}
    - Minimum balance: Rs. {stats['min_balance']}
    - Estimated idle surplus: Rs. {stats['surplus_estimate']}
    
    Write a short 3-4 sentence financial insight in English:
    1. Describe their balance trend
    2. Identify the safe investable surplus
    3. Recommend whether they should invest this week (e.g. into Mutual Funds or Liquid Funds)
    Keep it simple, friendly, and actionable for a regular Indian user.
    """
    
    response = ollama.chat(
        model=settings.OLLAMA_MODEL,
        messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_prompt},
        ],
    )
    return response['message']['content']

def _save_insight(user_id, stats, analysis_text):
    data = {
        "user_id": user_id,
        "week_start": stats["week_start"],
        "avg_balance": stats["avg_balance"],
        "min_balance": stats["min_balance"],
        "surplus_estimate": stats["surplus_estimate"],
        "total_amount": stats["avg_balance"],
        "surplus_30_percent": round(stats["avg_balance"] * 0.3, 2),
        "analysis_text": analysis_text,
        "created_at": datetime.utcnow().isoformat()
    }
    
    # Using upsert with on_conflict to ensure we don't duplicate weekly reports
    # This requires a UNIQUE constraint on (user_id, week_start) in the DB
    supabase.table("weekly_insights").upsert(data, on_conflict="user_id, week_start").execute()

def run_weekly_analysis(user_id):
    snapshots = _get_snapshots_last_7_days(user_id)
    if not snapshots:
        print(f"[Sentinel] No snapshots found for user={user_id} — skipping")
        return
    
    stats = _compute_stats(snapshots)
    analysis_text = _call_ollama(stats)
    _save_insight(user_id, stats, analysis_text)
    print(f"[Sentinel] Weekly insight saved for user={user_id}")
