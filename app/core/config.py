from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    database_url: str
    backend_url: str | None = None
    frontend_url: str | None = None
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
    def origins(self) -> list[str]:
        urls = []
        if self.frontend_url:
            urls += [url.strip() for url in self.frontend_url.split(",")]
        if self.backend_url:
            urls += [url.strip() for url in self.backend_url.split(",")]
        return urls


settings = Settings()  # type: ignore
