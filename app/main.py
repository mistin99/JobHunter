from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import auth_router, job_offer_router, organization_router, user_router
from core.config import settings

app = FastAPI()
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(organization_router, prefix="/organizations", tags=["organizations"])
app.include_router(job_offer_router, prefix="/job-offers", tags=["job_offers"])
app.include_router(user_router, prefix="/users", tags=["users"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
