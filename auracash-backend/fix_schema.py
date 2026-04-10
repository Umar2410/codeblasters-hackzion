from core.supabase_client import supabase

def run_fix():
    sql = """
    ALTER TABLE weekly_insights ADD COLUMN IF NOT EXISTS avg_balance NUMERIC(15, 2) NOT NULL DEFAULT 0;
    ALTER TABLE weekly_insights ADD COLUMN IF NOT EXISTS min_balance NUMERIC(15, 2) NOT NULL DEFAULT 0;
    ALTER TABLE weekly_insights ADD COLUMN IF NOT EXISTS surplus_estimate NUMERIC(15, 2) NOT NULL DEFAULT 0;
    """
    print("Attempting to fix schema via SQL...")
    try:
        # We can try to run SQL directly if we have an RPC or use a workaround
        # Since Supabase python client doesn't have a direct 'execute_sql' method,
        # we usually use RPC. If no RPC is available, this might fail unless 
        # the user runs it in the dashboard.
        
        # However, for agentic flow, we can try to use a dummy query to 'touch' the schema 
        # or hope the previous migration file execution fixed it.
        # But here we specifically need to ADD columns.
        
        # Let's try to use the 'rpc' method 'admin_run_sql' if it exists, or just tell the user.
        print("Note: Supabase Python SDK cannot run ALTER TABLE directly without a custom RPC.")
        print("Please run the following SQL in the Supabase SQL Editor:")
        print(sql)
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run_fix()
