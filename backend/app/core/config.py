from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator, Field

class Settings(BaseSettings):
    ENVIRONMENT: Literal["dev", "staging", "prod"] = "prod"
    DATABASE_URL: str = Field(...)
    REDIS_URL: str = Field(...)
    JWT_SECRET_KEY: str = Field(...)
    SEMESTER_SALT_SECRET: str = Field(...)

    RESEND_API_KEY: str = Field(...)
    OPENAI_API_KEY: str = Field(...)
    TRUSTED_PROXIES: list[str] | str = ["127.0.0.1"]
    ALLOWED_ORIGINS: list[str] | str = ["http://localhost:5173", "http://localhost:3000"]
    ADMIN_SECRET_KEY: str = Field(...)
    CSRF_HEADER_NAME: str = Field(...)
    CSRF_HEADER_VALUE: str = Field(...)

    @model_validator(mode="before")
    @classmethod
    def parse_comma_separated_lists(cls, data: dict) -> dict:
        val_proxies = data.get("TRUSTED_PROXIES")
        if isinstance(val_proxies, str):
            data["TRUSTED_PROXIES"] = [ip.strip() for ip in val_proxies.split(",") if ip.strip()]
            
        val_origins = data.get("ALLOWED_ORIGINS")
        if isinstance(val_origins, str):
            data["ALLOWED_ORIGINS"] = [origin.strip() for origin in val_origins.split(",") if origin.strip()]
            
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
