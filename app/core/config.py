from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = ""
    app_base_url: AnyHttpUrl | None = None
    secret_key: str = ""
    algorithm: str = ""
    access_token_expire_seconds: int = 0
    refresh_token_expire_seconds: int = 0
    email_verification_token_expire_seconds: int = 0
    email_host: str | None = None
    email_port: int | None = None
    email_user: str | None = None
    email_password: str | None = None

    class Config:
        env_file = ".env"


settings = Settings()
