from typing import Generator
from sqlalchemy import and_
from sqlalchemy.orm import Query, Session

from constants import Action, Role
from dtos.user import UserDto, UserUpdateDto
from entities.role import UserRole
from entities.user import User


class UserService:

    def __init__(self, db: Session) -> None:
        self.db = db

    def _build_search_query(
        self,
        *,
        initial_query: Query | None = None,
        email: str | list[str] | None = None,
        organization_id: int | list[int] | None = None,
        job_offer_id: int | list[int] | None = None,
    ) -> Query[User]:
        filters = []
        if email:
            email = email if isinstance(email, list) else [email]
            filters.append(User.email.in_(email))
        if organization_id:
            organization_id = (
                organization_id
                if isinstance(organization_id, list)
                else [organization_id]
            )
            filters.append(User.organization_id.in_(organization_id))
        if job_offer_id:
            job_offer_id = (
                job_offer_id if isinstance(job_offer_id, list) else [job_offer_id]
            )
            filters.append(User.job_offer_id.in_(job_offer_id))

        query = initial_query or self.db.query(User)
        return query.filter(and_(*filters))

    def search(
        self,
        *,
        id: int | None = None,
        email: str | list[str] | None = None,
        organization_id: int | list[int] | None = None,
        job_offer_id: int | list[int] | None = None,
        limit: int = 100,
    ) -> Generator[UserDto, None, None]:
        """
        Retrieves a set of user sorted by id [Key set pagination].
        When id is passed we start the lookup from that id onwards.
        """
        query = self.db.query(User)
        if id:
            query = query.filter(User.id == id)

        query = self._build_search_query(
            initial_query=query,
            email=email,
            organization_id=organization_id,
            job_offer_id=job_offer_id,
        )
        for entity in query.order_by(User.id).limit(limit):
            yield UserDto.model_validate(entity)

    def fetch_by_id(self, user_id: int) -> UserDto:
        if not (entity := self.db.query(User).get(user_id)):
            raise LookupError("User not found!")
        return UserDto.model_validate(entity)

    def update(self, user: UserUpdateDto) -> UserDto:
        updates = user.model_dump(exclude={"id"}, exclude_unset=True)
        if not any(updates.values()):
            raise ValueError("User has no changes!")

        entity = self.db.query(User).get(user.id)
        updates = {
            attr: value for attr, value in updates.items() if hasattr(entity, attr)
        }
        for attr, value in updates.items():
            entity.__setattr__(attr, value)

        self.db.flush()
        return UserDto.model_validate(entity)

    def manage_role(self, user_id: int, role: Role, action: Action) -> UserDto:
        user = self.db.query(User).get(user_id)
        user_role = self.db.query(UserRole).filter(UserRole.value == role.value).first()
        if not user or not user_role:
            raise LookupError("Non existing user or unsupported role!")

        if action == Action.ADD:
            user.roles.append(user_role)
        elif action == Action.REMOVE:
            user.roles.remove(user_role)
        else:
            raise RuntimeError("Unsupported action %s performed on user role", action)

        self.db.flush()
        return UserDto.model_validate(user)
