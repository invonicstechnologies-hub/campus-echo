from pydantic import BaseModel, ConfigDict, field_validator, Field
import re

class AuthSuccessResponse(BaseModel):
    message: str

class RegisterRequest(BaseModel):
    email: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        
        # Accept any .ac.ke university email
        ac_ke_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.ac\.ke$'
        
        # Accept standard personal email formats
        personal_pattern = r'^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|icloud)\.com$'
        
        if not (re.match(ac_ke_pattern, v) or re.match(personal_pattern, v)):
            raise ValueError(
                'Email must be a valid personal email or a .ac.ke university email'
            )
        return v

class OTPVerifyRequest(BaseModel):
    email: str
    otp: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")

    @field_validator('email')
    @classmethod
    def validate_email_domain(cls, v: str) -> str:
        v = v.strip().lower()
        ac_ke_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.ac\.ke$'
        personal_pattern = r'^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|icloud)\.com$'
        if not (re.match(ac_ke_pattern, v) or re.match(personal_pattern, v)):
            raise ValueError('Email must be a valid personal email or a .ac.ke university email')
        return v

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    
    model_config = ConfigDict(from_attributes=True)
