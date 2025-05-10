from fastapi import FastAPI
from app.api import auth_routes

app = FastAPI()
app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"message:""Helo"}

