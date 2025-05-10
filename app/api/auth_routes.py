from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.person import PersonCreate
from app.models.postal_address import PostalAddressCreate
from app.models.organization import OrganizationCreate
from app.crud.person import create_person
from app.crud.organization import create_org
from app.crud.postal_address import create_postal_address
from app.database import get_db

router = APIRouter()

@router.post("/register/person")
def register(person:PersonCreate,address:PostalAddressCreate, db: Session = Depends(get_db)):
        user_db = create_person(db=db, person_create=person) 
        postal_address_db = create_postal_address(db=db, address_create=address, user_id=user_db.id,owner_type=user_db.account_type)
        return {"message": f"User registered successfully"}

    
@router.post("/register/organization")
def register(organization:OrganizationCreate,address:PostalAddressCreate,db:Session = Depends(get_db)):
    organization_db = create_org(db=db, organization_create=organization) 
    postal_address_db = create_postal_address(db=db, address_create=address, user_id=organization_db.id,owner_type=organization_db.account_type)
    return {"message": f"User registered successfully"}