from core.supabase_client import supabase

def get_all_user_ids():
    res = supabase.table("users").select("id").execute()
    return [user["id"] for user in res.data]
