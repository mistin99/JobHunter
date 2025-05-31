from api import auth_router
from core.config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(auth_router, prefix="/auth", tags=["auth"])
origins_as_str = [str(origin) for origin in settings.origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_as_str,          
    allow_credentials=True,         
    allow_methods=["*"],
    allow_headers=["*"],
)