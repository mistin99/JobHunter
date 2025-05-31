from api import auth_router, organization_router
from core.config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(organization_router, prefix="/organizations", tags=["organizations"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.origins],          
    allow_credentials=True,         
    allow_methods=["*"],
    allow_headers=["*"],
)
