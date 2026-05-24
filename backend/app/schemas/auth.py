from pydantic import BaseModel, ConfigDict, field_validator
import re

class RegisterRequest(BaseModel):
    email: str

    @field_validator('email')
    @classmethod
    def validate_email_domain(cls, v: str) -> str:
        if not re.match(r"^[^@]+@mku\.ac\.ke$", v):
            raise ValueError("Email must be a valid @mku.ac.ke address")
        return v

class OTPVerifyRequest(BaseModel):
    email: str
    otp: str

    @field_validator('email')
    @classmethod
    def validate_email_domain(cls, v: str) -> str:
        if not re.match(r"^[^@]+@mku\.ac\.ke$", v):
            raise ValueError("Email must be a valid @mku.ac.ke address")
        return v

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    
    model_config = ConfigDict(from_attributes=True)
