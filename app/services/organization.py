from typing import Generator

from sqlalchemy import and_, exists, select
from sqlalchemy.orm import Query, Session

from constants import Action, Role
from dtos.organization import OrganizationDto
from dtos.user import UserUpdateDto
from entities.address import Address
from entities.job_offer import JobOffer
from entities.organization import Organization
from services.user import UserService


class OrganizationService:

    def __init__(self, db: Session) -> None:
        self.db = db

    def _build_search_query(
        self,
        *,
        initial_query: Query | None = None,
        email: str | list[str] | None = None,
        name: str | list[str] | None = None,
        job_offer_id: int | list[int] | None = None,
    ) -> Query[Organization]:
        filters = []
        if email:
            email = email if isinstance(email, list) else [email]
            filters.append(Organization.email.in_(email))
        if name:
            name = name if isinstance(name, list) else [name]
            filters.append(Organization.name.in_(name))
        if job_offer_id:
            job_offer_id = (
                job_offer_id if isinstance(job_offer_id, list) else [job_offer_id]
            )
            sub_query = select(JobOffer.id).where(
                JobOffer.organization_id == Organization.id,
                JobOffer.id.in_(job_offer_id),
            )
            filters.append(exists(sub_query))

        query = initial_query or self.db.query(Organization)
        return query.filter(and_(*filters))

    def search(
        self,
        *,
        id: int | None = None,
        email: str | list[str] | None = None,
        name: str | list[str] | None = None,
        job_offer_id: int | list[int] | None = None,
        limit: int = 100,
    ) -> Generator[OrganizationDto, None, None]:
        """
        Retrieves a set of user sorted by id [Key set pagination].
        When id is passed we start the lookup from that id onwards.
        """
        query = self.db.query(Organization)
        if id:
            query = query.filter(Organization.id == id)

        query = self._build_search_query(
            initial_query=query,
            email=email,
            name=name,
            job_offer_id=job_offer_id,
        )
        for entity in query.order_by(Organization.id).limit(limit):
            yield OrganizationDto.model_validate(entity)

    def fetch_by_id(self, organization_id: int) -> OrganizationDto:
        if not (entity := self.db.query(Organization).get(organization_id)):
            raise LookupError("Organization not found!")
        return OrganizationDto.model_validate(entity)

    def create(self, user_id: int, organization: OrganizationDto) -> OrganizationDto:
        entity = Organization(
            **organization.model_dump(exclude={"address"}), 
            address=Address(**organization.address.model_dump()),
        )
        self.db.add(entity)
        self.db.flush()
        self._set_owner(user_id, entity.id)
        self.db.refresh(entity)
        return OrganizationDto.model_validate(entity)

    def _set_owner(self, user_id: int, organization_id: int) -> None:
        user_service = UserService(db=self.db)
        user = UserUpdateDto(id=user_id, organization_id=organization_id)
        user_service.update(user)
        user_service.manage_role(user_id, Role.ORGANIZATION_OWNER, Action.ADD)
