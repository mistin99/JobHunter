from pydantic import BaseModel, ConfigDict, Field

from constants import Status


class ResumeDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int | None = None
    title: str = ""
    file_name: str
    content_type: str
    user_id: int
    content: bytes


class ResumeSearchDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int | None = None
    title: str | list[str] = Field(default_factory=list)
    file_name: str | list[str] = Field(default_factory=list)
    status: Status | list[Status] = Field(default_factory=list)
    user_id: int | list[int] = Field(default_factory=list)
    user_email: str | list[str] = Field(default_factory=list)
    job_offer_id: int | list[int] = Field(default_factory=list)
    limit: int = 100
