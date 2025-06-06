from api import auth_router, job_offer_router, organization_router, user_router
from core.config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(organization_router, prefix="/organizations", tags=["organizations"])
app.include_router(job_offer_router, prefix="/job-offers", tags=["job_offers"])
app.include_router(user_router, prefix="/users", tags=["users"])



