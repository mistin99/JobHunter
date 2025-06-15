from constants import Status, TokenType
from database import get_db
from dtos.user import UserDto
from fastapi import APIRouter, Cookie, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from jose import JWTError
from services.auth import AuthService
from sqlalchemy.orm import Session
from utils import transactional

router = APIRouter()


@router.post("/signup")
@transactional
def signup(user: UserDto, db: Session = Depends(get_db)) -> JSONResponse:
    service = AuthService(db=db)
    try:
        access_token, refresh_token, dto = service.signup(user)
    except LookupError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST) from e

    response = JSONResponse(
        content={"user": dto.model_dump(), "token": access_token},
        status_code=status.HTTP_201_CREATED,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="strict",
        path="/auth/refresh",
    )
    return response


@router.post("/signin")
@transactional
def signin(user: UserDto, db: Session = Depends(get_db)) -> JSONResponse:
    service = AuthService(db=db)
    try:
        access_token, refresh_token, dto = service.signin(user)
    except LookupError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST) from e
    response = JSONResponse(
        content={"user": dto.model_dump(), "token": access_token},
        status_code=status.HTTP_200_OK,
    )
    response.set_cookie(
        key="token",
        value=refresh_token,
        httponly=True,
        samesite="strict",
        path="/auth/refresh",
    )
    return response


@router.post("/refresh")
def refresh_access_token(
    token: str = Cookie(..., alias="token"), db: Session = Depends(get_db)
) -> JSONResponse:
    service = AuthService(db=db)
    try:
        token = service.refresh_access_token(token)
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST) from e
    response = JSONResponse(content={"token": token}, status_code=status.HTTP_200_OK)
    response.set_cookie(
        key="token", value=token, httponly=True, samesite="strict", path="/auth/refresh"
    )
    return response


@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    service = AuthService(db=db)
    try:
        user_id = service.verify_token(token, TokenType.EMAIL_VERIFICATION)
    except JWTError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED) from e
    user = service.change_user_status(user_id, Status.APPROVED)
    return JSONResponse(content=user.model_dump(), status_code=status.HTTP_200_OK)
