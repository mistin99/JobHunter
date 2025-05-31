from enum import StrEnum


<<<<<<< Updated upstream
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
=======
class Status(StrEnum):
    PENDING = "Pending"
    APPROVED = "Rejected"
    REJECTED = "Rejected"

    # TODO delete the ones bellow later
    VERIFIED = "Verified"
    UNVERIFIED = "Unverified"
>>>>>>> Stashed changes


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

<<<<<<< Updated upstream
    def __str__(self) -> str:
        return self.value

=======
>>>>>>> Stashed changes

class Tag(StrEnum):
    HTML = "Html"
    CSS = "Css"
<<<<<<< Updated upstream
    WEB_DEVELOPER = "Web Developer"

    def __str__(self) -> str:
        return self.value
=======
    WEB_DEVELOPER = "Web Developer"
>>>>>>> Stashed changes
