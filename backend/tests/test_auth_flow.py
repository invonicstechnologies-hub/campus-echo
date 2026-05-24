import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
import redis.asyncio as redis
from app.core.config import settings

@pytest_asyncio.fixture
async def async_client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client

@pytest_asyncio.fixture
async def redis_mock():
    # In a real environment, you'd use a mock or a separate redis DB.
    # We will use the existing redis for the test but clear keys.
    r = redis.from_url(settings.REDIS_URL, decode_responses=True)
    yield r
    await r.flushdb()

@pytest.mark.asyncio
async def test_auth_flow(async_client, redis_mock):
    email = "student@mku.ac.ke"
    
    # Register
    res = await async_client.post("/auth/register", json={"email": email})
    assert res.status_code == 200
    
    # Find OTP in Redis
    import hashlib
    email_hash = hashlib.sha256(email.encode('utf-8')).hexdigest()
    otp = await redis_mock.get(f"otp:{email_hash}")
    assert otp is not None
    
    # Verify OTP
    res2 = await async_client.post("/auth/verify-otp", json={"email": email, "otp": otp})
    assert res2.status_code == 200
    data = res2.json()
    assert "access_token" in data
    
    # Decode JWT
    from jose import jwt
    payload = jwt.decode(data["access_token"], settings.JWT_SECRET_KEY, algorithms=["HS256"])
    
    assert "sub" in payload
    assert "email" not in payload
