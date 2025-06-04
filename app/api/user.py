from io import BytesIO

from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy.orm import Session

from database import get_db
from dtos.resume import ResumeSearchDto

from services.resume import ResumeService
from utils import get_current_user_id, transactional

router = APIRouter()


@router.post("/resumes")
def search(resume: ResumeSearchDto, db: Session = Depends(get_db)) -> JSONResponse:
    service = ResumeService(db=db)
    filters = resume.model_dump(exclude_unset=True, exclude_none=True)
    resumes = list(service.search(**filters))
    return JSONResponse(
        content=[r.model_dump(exclude={"content"}) for r in resumes],
        status_code=status.HTTP_200_OK,
    )


@router.get("/resumes/{resume_id}")
def get_resume_content(resume_id: int, db: Session = Depends(get_db)):
    service = ResumeService(db=db)
    resume = service.fetch_by_id(resume_id)

    return StreamingResponse(
        BytesIO(resume.content),
        media_type=resume.content_type,
        headers={
            "Content-Disposition": f"inline; filename={resume.title}.{resume.ext}"
        },
    )


@router.post("/resumes/upload")
@transactional
async def upload_resume(
    file: UploadFile = Form(),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> JSONResponse:
    service = ResumeService(db=db)
    try:
        resume = await service.create_resume(file, user_id)
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST) from e
    return JSONResponse(
        content=resume.model_dump(exclude={"content"}),
        status_code=status.HTTP_201_CREATED,
    )
