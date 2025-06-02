from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import get_db
from dtos.organization import OrganizationDto, OrganizationSearchDto
from services.organization import OrganizationService
from utils import get_current_user_id, transactional

router = APIRouter()


@router.post("/create")
@transactional
def create_organization(
    organization: OrganizationDto,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> JSONResponse:
    service = OrganizationService(db=db)
    try:
        organization = service.create(user_id, organization)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST) from e

    return JSONResponse(
        content=organization.model_dump(), status_code=status.HTTP_201_CREATED
    )


@router.post("/")
def search(
    organization: OrganizationSearchDto, db: Session = Depends(get_db)
) -> JSONResponse:
    filters = organization.model_dump(exclude_unset=True, exclude_none=True)
    service = OrganizationService(db=db)
    organizations = list(service.search(**filters))
    return JSONResponse(
        content=[o.model_dump() for o in organizations],
        status_code=status.HTTP_200_OK,
    )
