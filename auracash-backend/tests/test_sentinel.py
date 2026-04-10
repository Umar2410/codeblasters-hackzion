import sys
import os
import asyncio

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents.sentinel.runner import weekly_job
from core.supabase_client import supabase

def verify_results():
    print("\n[Test] Verifying weekly_insights table...")
    res = supabase.table("weekly_insights").select("*").order("created_at", descending=True).limit(1).execute()
    if res.data:
        insight = res.data[0]
        print(f"✅ Found latest insight for user {insight['user_id']}")
        print(f"   Week Start: {insight['week_start']}")
        print(f"   Total Amount: ₹{insight['total_amount']}")
        print(f"   30% Surplus: ₹{insight['surplus_30_percent']}")
        print(f"   Analysis: {insight['analysis_text'][:100]}...")
    else:
        print("❌ No insights found in weekly_insights table.")

def run_test():
    print("🚀 Starting Sentinel Agent Weekly Job Test...")
    try:
        weekly_job()
        print("✅ Weekly job completed successfully.")
        verify_results()
    except Exception as e:
        print(f"❌ Error during weekly job: {e}")

if __name__ == "__main__":
    run_test()
