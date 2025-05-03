from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.models.person import PersonCreate
from app.crud import create_person
from app.database import get_db

app = FastAPI()

@app.get("/")
def read_root():
    return {"message:""Helo"}

@app.post("/register")
def register(person: PersonCreate, db: Session = Depends(get_db)):
    person_db = create_person(db=db, person_create=person)  # Call CRUD operation
    return {"message": "User registered successfully", "email": person_db.email}