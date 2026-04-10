from apscheduler.schedulers.background import BackgroundScheduler
from agents.sentinel.runner import daily_job, weekly_job

def start_scheduler():
    scheduler = BackgroundScheduler()
    
    # Daily job at 08:00 AM IST (02:30 UTC)
    scheduler.add_job(
        daily_job,
        "cron",
        hour=2,
        minute=30,
        id="sentinel_daily_snapshot",
        replace_existing=True
    )
    
    # Weekly job at 09:00 AM IST (03:30 UTC) on Monday
    scheduler.add_job(
        weekly_job,
        "cron",
        day_of_week="mon",
        hour=3,
        minute=30,
        id="sentinel_weekly_analysis",
        replace_existing=True
    )
    
    scheduler.start()
    print("[Scheduler] Sentinel started — daily + weekly jobs active")
