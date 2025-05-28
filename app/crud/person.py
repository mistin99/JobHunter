from typing import cast

from sqlalchemy.orm import Session

from core.security import create_verification_token
from models.person import Person, PersonCreate
from services.email import send_verification_email
from utils import convert_enums_to_values


def create_person(db: Session, person: PersonCreate) -> Person:
    data = person.model_dump()
    data = convert_enums_to_values(data)
    db_person = Person(**data)
    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    token = create_verification_token(db_person.id)
    send_verification_email(cast(str,db_person.email), token)
    return db_person
