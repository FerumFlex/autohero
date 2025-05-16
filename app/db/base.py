import contextvars

from config import settings
from db.proxy import SessionProxy
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession

engine = create_async_engine(settings.database_url, future=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
session_context = contextvars.ContextVar("session")
current_session = SessionProxy(session_context)


async def get_session() -> AsyncSession:
    async with async_session() as session:
        token = session_context.set(session)
        try:
            yield session
        finally:
            session_context.reset(token)
