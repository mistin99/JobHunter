from typing import Any, Generator

from fastapi import UploadFile
from sqlalchemy import and_, exists, select
from sqlalchemy.orm import Query, Session

from constants import Status
from dtos.resume import ResumeDto
from entities.resume import Resume
from entities.user import User, UserApplication
from services.user import UserService


class ResumeService:

    def __init__(self, db: Session) -> None:
        self.user_service = UserService(db=db)
        self.db = db

    def _build_search_query(
        self,
        *,
        initial_query: Query | None = None,
        title: str | list[str] | None = None,
        file_name: str | list[str] | None = None,
        status: Status | list[Status] | None = None,
        user_id: int | list[int] | None = None,
        user_email: str | list[str] | None = None,
        job_offer_id: int | list[int] | None = None,
    ) -> Query[Resume]:
        filters = []
        if title:
            title = title if isinstance(title, list) else [title]
            filters.extend([Resume.title.ilike(f"%{t}%") for t in title])
        if file_name:
            file_name = file_name if isinstance(file_name, list) else [file_name]
            filters.extend([Resume.file_name.ilike(f"%{n}%") for n in file_name])
        if status:
            status = status if isinstance(status, list) else [status]
            filters.append(Resume.status.in_(status))
        if user_id:
            user_id = user_id if isinstance(user_id, list) else [user_id]
            filters.append(Resume.user_id.in_(user_id))
        if user_email:
            user_email = user_email if isinstance(user_email, list) else [user_email]
            sub_query = select(Resume.id).where(
                Resume.user_id == User.id, User.email.in_(user_email)
            )
            filters.append(exists(sub_query))
        if job_offer_id:
            job_offer_id = (
                job_offer_id if isinstance(job_offer_id, list) else [job_offer_id]
            )
            sub_query = select(Resume.id).where(
                Resume.id == UserApplication.resume_id,
                UserApplication.job_offer_id.in_(job_offer_id),
            )
            filters.append(exists(sub_query))

        query = initial_query or self.db.query(Resume)
        return query.filter(and_(*filters))

    def search(
        self,
        *,
        id: int | None = None,
        title: str | list[str] | None = None,
        file_name: str | list[str] | None = None,
        status: Status | list[Status] | None = None,
        user_id: int | list[int] | None = None,
        user_email: str | list[str] | None = None,
        job_offer_id: int | list[int] | None = None,
        limit: int = 100,
    ) -> Generator[ResumeDto, None, None]:
        """
        Retrieves a set of user sorted by id [Key set pagination].
        When id is passed we start the lookup from that id onwards.
        """
        query = self.db.query(Resume)
        if id:
            query = query.filter(Resume.id > id)

        query = self._build_search_query(
            initial_query=query,
            title=title,
            file_name=file_name,
            status=status,
            user_id=user_id,
            user_email=user_email,
            job_offer_id=job_offer_id,
        )
        for entity in query.order_by(Resume.id).limit(limit):
            yield ResumeDto.model_validate(entity)

    def fetch_by_id(self, resume_id: int) -> ResumeDto:
        if not (entity := self.db.query(Resume).get(resume_id)):
            raise LookupError("Resume not found")
        return ResumeDto.model_validate(entity)

    async def _parse_file(self, file: UploadFile) -> dict[str, Any]:
        if file.content_type not in [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]:
            raise RuntimeError("Unsupported file type")

        if file.size == 0:
            raise RuntimeError("File must not be empty")

        if not file.filename:
            raise RuntimeError("File name is required")

        content = await file.read()
        file_name, ext = file.filename.split(".", 1)
        return {
            "file_name": file_name,
            "ext": ext.lower(),
            "content_type": file.content_type,
            "content": content,
        }

    async def create_resume(self, file: UploadFile, user_id: int) -> ResumeDto:
        data = await self._parse_file(file)
        user = self.user_service.fetch_by_id(user_id)
        title = f"{user.first_name} {user.last_name} {data["file_name"]}"
        entity = Resume(title=title, user_id=user_id, **data)
        self.db.add(entity)
        return ResumeDto.model_validate(entity)
