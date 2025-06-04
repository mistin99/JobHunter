from typing import Generator

from sqlalchemy import and_, exists, select
from sqlalchemy.orm import Query, Session

from constants import Role
from dtos.job_offer import ApplicationDto, JobOfferDto, JobTagDto
from entities.job_offer import JobOffer, job_offers_tags
from entities.job_tag import JobTag
from entities.user import UserApplication
from services.resume import ResumeService
from services.user import UserService


class JobOfferService:

    def __init__(self, db: Session) -> None:
        self.db = db
        self.resume_service = ResumeService(db=db)
        self.user_service = UserService(db=db)

    def _build_search_query(
        self,
        *,
        initial_query: Query | None = None,
        title: str | list[str] | None = None,
        description: str | list[str] | None = None,
        tag: str | list[str] | None = None,
        organization_id: int | list[int] | None = None,
    ) -> Query[JobOffer]:
        filters = []
        if title:
            title = title if isinstance(title, list) else [title]
            filters.append(JobOffer.title.in_(title))
        if description:
            description = (
                description if isinstance(description, list) else [description]
            )
            filters.append(JobOffer.description.like(description))
        if organization_id:
            organization_id = (
                organization_id
                if isinstance(organization_id, list)
                else [organization_id]
            )
            filters.append(JobOffer.organization_id.in_(organization_id))
        if tag:
            tag = tag if isinstance(tag, list) else [tag]
            sub_query = (
                select(JobOffer.id)
                .join(job_offers_tags, job_offers_tags.c.job_offer_id == JobOffer.id)
                .join(JobTag, job_offers_tags.c.job_tag_id == JobTag.id)
                .where(JobTag.value.in_(tag))
            )
            filters.append(exists(sub_query))

        query = initial_query or self.db.query(JobOffer)
        return query.filter(and_(*filters))

    def search(
        self,
        *,
        id: int | None = None,
        title: str | list[str] | None = None,
        description: str | list[str] | None = None,
        tag: str | list[str] | None = None,
        organization_id: int | list[int] | None = None,
        limit: int = 100,
    ) -> Generator[JobOfferDto, None, None]:
        """
        Retrieves a set of user sorted by id [Key set pagination].
        When id is passed we start the lookup from that id onwards.
        """
        query = self.db.query(JobOffer)
        if id:
            query = query.filter(JobOffer.id > id)

        query = self._build_search_query(
            title=title,
            description=description,
            tag=tag,
            organization_id=organization_id,
        )
        for entity in query.order_by(JobOffer.id).limit(limit):
            yield JobOfferDto.model_validate(entity)

    def fetch_by_id(self, jop_offer_id: int) -> JobOfferDto:
        if not (entity := self.db.query(JobOffer).get(jop_offer_id)):
            raise LookupError("Job offer not found!")
        return JobOfferDto.model_validate(entity)

    def fetch_job_tags(
        self, id: int | None = None, limit: int = 100
    ) -> Generator[JobTagDto, None, None]:
        query = self.db.query(JobTag)
        if id:
            query = query.filter(JobTag.id > id)
        for entity in query.order_by(JobTag.id).limit(limit):
            yield JobTagDto.model_validate(entity)

    def create(self, user_id: int, job_offer: JobOfferDto) -> JobOfferDto:
        # TODO Handle this in a permission service on endpoint level!!!
        user = self.user_service.fetch_by_id(user_id)
        roles = {r.value for r in Role if r != Role.APPLICANT}
        if roles - {r.value for r in user.roles} == roles:
            raise RuntimeError("Not authorized!")

        tags = self.db.query(JobTag).filter(JobTag.value.in_(job_offer.tags)).all()
        if invalid_tags := set(job_offer.tags) - {t.value for t in tags}:
            raise ValueError("Invalid job tags %s", ", ".join(invalid_tags))

        entity = JobOffer(**job_offer.model_dump(exclude={"tags"}), tags=tags)
        self.db.add(entity)
        self.db.flush()
        self.db.refresh(entity)
        return JobOfferDto.model_validate(entity)

    def create_application(self, application: ApplicationDto) -> ApplicationDto:
        resume = self.resume_service.fetch_by_id(application.resume_id)
        if resume.user_id != application.user_id:
            raise RuntimeError("This resume doesn't belong to the given user")

        user = self.user_service.fetch_by_id(application.user_id)
        job_offer = self.fetch_by_id(application.job_offer_id)
        if user.organization_id == job_offer.organization_id:
            raise RuntimeError(
                "User is a member of this oragnization and cannot apply for the job"
            )

        entity = UserApplication(**application.model_dump())
        self.db.add(entity)
        self.db.flush()
        self.db.refresh(entity)
        return ApplicationDto.model_validate(entity)
