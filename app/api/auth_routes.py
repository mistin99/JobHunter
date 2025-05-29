from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from constants import Status
from core.config import settings
# from crud.organization import create_org
# from crud.postal_address import create_postal_address
from database import get_db
from dtos.user import UserDto
from entities.user import User
from services.auth import AuthService

router = APIRouter()


@router.post("/signup")
def signup(user: UserDto, db: Session = Depends(get_db)) -> JSONResponse:
    service = AuthService(db=db)
    user = service.signup(user)
    return JSONResponse(
        content={"id": user.id} or {},
        status_code=status.HTTP_201_CREATED if user.id else status.HTTP_400_BAD_REQUEST
    )


# @router.post("/register/organization")
# def register(
#     organization: OrganizationCreate,
#     address: PostalAddressCreate,
#     db: Session = Depends(get_db),
# ):
#     organization_db = create_org(db=db, organization=organization)
#     create_postal_address(
#         db=db,
#         address=address,
#         user_id=organization_db.id,
#     )
#     return {"message": "Email has been sent for verification"}


@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    try:
        print(f"---------------------{token}")
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        print(f"---------------------{payload}")
        user_id = payload.get("sub")
        print(f"---------------------{user_id}")
        if payload.get("type") != "email_verification":
            raise HTTPException(status_code=400, detail="Invalid token type")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.status = Status.APPROVED
    db.commit()
    return {"message": "Email verified successfully"}
