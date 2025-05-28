
from fastapi import APIRouter, Depends, HTTPException
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from constants import Account_status
from core.config import settings
from crud.organization import create_org
from crud.person import create_person
from crud.postal_address import create_postal_address
from database import get_db
from models.organization import OrganizationCreate
from models.person import Person, PersonCreate
from models.postal_address import PostalAddressCreate

router = APIRouter()


@router.post("/register/person")
def register_person(
    person: PersonCreate, address: PostalAddressCreate, db: Session = Depends(get_db)
):
    user_db = create_person(db=db, person=person)
    create_postal_address(
        db=db,
        address=address,
        user_id= user_db.id,
        owner_type=user_db.account_type,
    )
    return {"message": "Email has been sent for verification"}


@router.post("/register/organization")
def register(
    organization: OrganizationCreate,
    address: PostalAddressCreate,
    db: Session = Depends(get_db),
):
    organization_db = create_org(db=db, organization=organization)
    create_postal_address(
        db=db,
        address=address,
        user_id=organization_db.id,
        owner_type=organization_db.account_type,
    )
    return {"message": "Email has been sent for verification"}

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    try:
        print(f"---------------------{token}")
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        print(f"---------------------{payload}")
        user_id = payload.get("sub")
        print(f"---------------------{user_id}")
        if payload.get("type") != "email_verification":
            raise HTTPException(status_code=400, detail="Invalid token type")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(Person).filter(Person.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.status = Account_status.VERIFIED
    db.commit()
    return {"message": "Email verified successfully"}
