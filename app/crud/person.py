from sqlalchemy.orm import Session
from app.models.person import Person,PersonCreate

def create_person(db: Session, person_create: PersonCreate):
    person = Person(**person_create.model_dump())
    db.add(person)
    db.commit()
    db.refresh(person)
    return person