from enum import StrEnum


class Status(StrEnum):
    PENDING = "Pending"
    APPROVED = "Rejected"
    REJECTED = "Rejected"

    # TODO delete the ones bellow later
    VERIFIED = "Verified"
    UNVERIFIED = "Unverified"


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


class Tag(StrEnum):
    HTML = "Html"
    CSS = "Css"
    WEB_DEVELOPER = "Web Developer"