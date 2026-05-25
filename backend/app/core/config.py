from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator, Field

class Settings(BaseSettings):
    ENVIRONMENT: Literal["dev", "staging", "prod"] = "prod"
    DATABASE_URL: str = Field(...)
    REDIS_URL: str = Field(...)
    JWT_SECRET_KEY: str = Field(...)
    SEMESTER_SALT_SECRET: str = Field(...)
    SMTP_HOST: str = Field(...)
    SMTP_PORT: int = Field(...)
    SMTP_USER: str = Field(...)
    SMTP_PASSWORD: str = Field(...)
    OPENAI_API_KEY: str = Field(...)
    TRUSTED_PROXIES: list[str] = ["127.0.0.1"]
    ADMIN_SECRET_KEY: str = Field(...)
    CSRF_HEADER_NAME: str = Field(...)
    CSRF_HEADER_VALUE: str = Field(...)

    @model_validator(mode="before")
    @classmethod
    def parse_trusted_proxies(cls, data: dict) -> dict:
        val = data.get("TRUSTED_PROXIES")
        if isinstance(val, str):
            data["TRUSTED_PROXIES"] = [ip.strip() for ip in val.split(",")]
        return data

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @model_validator(mode="after")
    def validate_secrets_length(self) -> "Settings":
        if len(self.JWT_SECRET_KEY) < 32:
            raise ValueError("JWT_SECRET_KEY must be at least 32 characters long.")
        if len(self.SEMESTER_SALT_SECRET) < 32:
            raise ValueError("SEMESTER_SALT_SECRET must be at least 32 characters long.")
        if len(self.ADMIN_SECRET_KEY) < 32:
            raise ValueError("ADMIN_SECRET_KEY must be at least 32 characters long.")
        if len(self.CSRF_HEADER_VALUE) < 32:
            raise ValueError("CSRF_HEADER_VALUE must be at least 32 characters long.")
        return self

settings = Settings()
