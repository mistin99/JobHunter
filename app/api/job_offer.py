from database import get_db
from dtos.job_offer import ApplicationDto, JobOfferDto, JobOfferSearchDto
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from services.email import send_job_application_email
from services.job_offer import JobOfferService
from services.organization import OrganizationService
from sqlalchemy.orm import Session
from utils import get_current_user_id, transactional

router = APIRouter()


@router.post("/create")
@transactional
def create_job_offer(
    job_offer: JobOfferDto,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> JSONResponse:
    service = JobOfferService(db=db)
    try:
        job_offer = service.create(user_id, job_offer)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST) from e

    return JSONResponse(
        content=job_offer.model_dump(), status_code=status.HTTP_201_CREATED
    )


@router.post("/")
def search(job_offer: JobOfferSearchDto, db: Session = Depends(get_db)) -> JSONResponse:
    filters = job_offer.model_dump(exclude_unset=True, exclude_none=True)
    service = JobOfferService(db=db)
    job_offers = list(service.search(**filters))
    return JSONResponse(
        content=[offer.model_dump() for offer in job_offers],
        status_code=status.HTTP_200_OK,
    )


@router.get("/job-tags")
def get_job_tags(
    id: int | None = None, limit: int = 100, db: Session = Depends(get_db)
) -> JSONResponse:
    service = JobOfferService(db=db)
    job_tags = list(service.fetch_job_tags(id, limit))
    return JSONResponse(
        content=[tag.model_dump() for tag in job_tags],
        status_code=status.HTTP_200_OK,
    )


@router.post("/apply")
@transactional
def apply(
    application: ApplicationDto,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> JSONResponse:
    service = JobOfferService(db=db)
    organization_service = OrganizationService(db=db)
    application.user_id = user_id

    try:
        application = service.create_application(application)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e

    organization = next(
        organization_service.search(job_offer_id=application.job_offer_id)
    )
    send_job_application_email(organization.email, application)
    return JSONResponse(
        content=jsonable_encoder(application.model_dump()),
        status_code=status.HTTP_201_CREATED,
    )
