from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    app_base_url: AnyHttpUrl
    secret_key: str
    algorithm: str
    email_host: str
    email_port: int
    email_user: str
    email_password: str

    class Config:
        env_file = ".env"


settings = Settings()  # type: ignore
