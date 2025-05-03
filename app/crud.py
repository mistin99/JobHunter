from sqlalchemy.orm import Session
from app.models.person import Person
from app.models.person import PersonCreate

# Function to create a new person
def create_person(db: Session, person_create: PersonCreate):
    person = Person(**person_create.dict())
    db.add(person)
    db.commit()
    db.refresh(person)
    return person