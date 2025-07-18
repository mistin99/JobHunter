from enum import Enum, StrEnum, auto


class TokenType(StrEnum):
    ACCESS = "Access"
    REFRESH = "Refresh"
    EMAIL_VERIFICATION = "Email Verification"

    def __str__(self) -> str:
        return self.value


class Status(StrEnum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"

    def __str__(self) -> str:
        return self.value


class Role(StrEnum):
    ADMIN = "Admin"
    """Authorised do everything and has access to anything"""

    ORGANIZATION_OWNER = "Organization Owner"
    """Authorised to do anything for the organizations it has created"""

    RECRUITER = "Recruiter"
    """Authorised to anything for the job offers it has created"""

    MODERATOR = "Moderator"
    """
    Authorised to do execute some actions against an organizations it has access to
    and can do anything to job offers it has acces to.
    """

    APPLICANT = "Applicant"
    """Authorised to view and apply for job offers"""

    def __str__(self) -> str:
        return self.value


class Action(Enum):
    ADD = auto()
    REMOVE = auto()