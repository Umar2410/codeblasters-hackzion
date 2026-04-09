from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import auth, bank, dashboard, approvals, webhook
from agents.sentinel.scheduler import start_scheduler

app = FastAPI(title="AuraCash API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(bank.router, prefix="/bank", tags=["bank"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
app.include_router(approvals.router, prefix="/approvals", tags=["approvals"])
app.include_router(webhook.router, prefix="/webhook", tags=["webhook"])

@app.on_event("startup")
async def startup_event():
    start_scheduler()

@app.get("/health")
def health():
    return {"status": "ok"}
