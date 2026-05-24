import pytest
from pydantic import ValidationError
import os
from app.core.config import Settings

def test_config_startup_fails_with_short_secrets(monkeypatch):
    monkeypatch.setenv("JWT_SECRET_KEY", "short")
    monkeypatch.setenv("SEMESTER_SALT_SECRET", "short")
    
    with pytest.raises(ValidationError):
        Settings()
