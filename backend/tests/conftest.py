import pytest
import pytest_asyncio
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings
import os
from alembic.config import Config
from alembic import command

TEST_DB_NAME = "test_campus_echo"
DEFAULT_DB_URL = settings.DATABASE_URL
TEST_DB_URL = DEFAULT_DB_URL.replace("/campus_echo", f"/{TEST_DB_NAME}")

@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_test_db():
    engine = create_async_engine(DEFAULT_DB_URL, isolation_level="AUTOCOMMIT")
    async with engine.connect() as conn:
        try:
            await conn.execute(text(f"DROP DATABASE IF EXISTS {TEST_DB_NAME}"))
        except Exception as e:
            pass
        try:
            await conn.execute(text(f"CREATE DATABASE {TEST_DB_NAME}"))
        except Exception as e:
            pass
    await engine.dispose()

    os.environ["DATABASE_URL"] = TEST_DB_URL
    alembic_cfg = Config("alembic.ini")
    
    await asyncio.to_thread(command.upgrade, alembic_cfg, "head")

    yield

    engine = create_async_engine(DEFAULT_DB_URL, isolation_level="AUTOCOMMIT")
    async with engine.connect() as conn:
        await conn.execute(text(f"""
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = '{TEST_DB_NAME}'
            AND pid <> pg_backend_pid()
        """))
        await conn.execute(text(f"DROP DATABASE IF EXISTS {TEST_DB_NAME}"))
    await engine.dispose()

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()
