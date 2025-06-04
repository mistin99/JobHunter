from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    database_url: str
    backend_url: AnyHttpUrl | None = None
    frontend_url: AnyHttpUrl | None = None
    secret_key: str
    algorithm: str
    access_token_expire_seconds: int
    refresh_token_expire_seconds: int
    email_verification_token_expire_seconds: int
    email_host: str
    email_port: int
    email_user: str
    email_password: str

    @property
    def origins(self) -> list[AnyHttpUrl]:
        urls = []
        if self.frontend_url:
            urls.append(self.frontend_url)
        if self.backend_url:
            urls.append(self.backend_url)
        return urls


settings = Settings()  # type: ignore
