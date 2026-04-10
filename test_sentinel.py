import sys
from agents.sentinel.analysis_service import run_weekly_analysis
from core.supabase_client import supabase

def test_sentinel(user_id):
    print(f"Triggering Sentinel Analysis for user: {user_id}")
    try:
        run_weekly_analysis(user_id)
        
        # Fetch the result
        res = supabase.table("weekly_insights") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .limit(1) \
            .execute()
        
        if res.data:
            insight = res.data[0]
            print("\n" + "="*50)
            print("SENTINEL ANALYSIS RESULT")
            print("="*50)
            print(f"Avg Balance: Rs. {insight.get('avg_balance', 'N/A')}")
            print(f"Min Balance: Rs. {insight.get('min_balance', 'N/A')}")
            print(f"Surplus Estimate: Rs. {insight.get('surplus_estimate', 'N/A')}")
            print(f"Total Amount: Rs. {insight.get('total_amount', 'N/A')}")
            print(f"Surplus 30%: Rs. {insight.get('surplus_30_percent', 'N/A')}")
            print("\nAI INSIGHT:")
            # Fix for Windows terminal encoding issues with the Rupee symbol
            print(insight['analysis_text'].replace("₹", "Rs."))
            print("="*50)
        else:
            print("Analysis finished but no insight was found in DB.")
            
    except Exception as e:
        print(f"Error during Sentinel Analysis: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_sentinel.py <user_id>")
    else:
        test_sentinel(sys.argv[1])
