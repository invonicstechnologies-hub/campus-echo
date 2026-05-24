import pytest
import pytest_asyncio
from app.db.session import async_session_maker
from app.models.post import Post
import uuid

@pytest.mark.asyncio
async def test_severance_no_email_in_db():
    async with async_session_maker() as session:
        async with session.begin():
            pass
            # Just asserting that Post model has no email column by checking its mapper
            from sqlalchemy import inspect
            mapper = inspect(Post)
            columns = [c.key for c in mapper.columns]
            assert "email" not in columns
            assert "username" not in columns
            assert "name" not in columns
            assert "ip_address" not in columns
            assert "user_id" not in columns
