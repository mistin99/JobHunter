from fastapi import FastAPI

from api import auth_router, organization_router

app = FastAPI()
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(organization_router, prefix="/organizations", tags=["organizations"])
