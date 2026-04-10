from db.repositories.user_repo import get_all_user_ids
from agents.sentinel.balance_service import run_daily_snapshot
from agents.sentinel.analysis_service import run_weekly_analysis

def daily_job():
    user_ids = get_all_user_ids()
    for user_id in user_ids:
        run_daily_snapshot(user_id)

def weekly_job():
    user_ids = get_all_user_ids()
    for user_id in user_ids:
        run_weekly_analysis(user_id)
