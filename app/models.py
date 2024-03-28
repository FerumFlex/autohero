import datetime
import uuid

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID as SA_UUID, JSONB
from sqlmodel import Field, SQLModel, Column


def utc_now():
    return datetime.datetime.now(tz=datetime.timezone.utc)


class BaseModel(SQLModel):
    created_at: datetime.datetime = Field(
        sa_type=sa.DateTime(timezone=True),
        nullable=False,
        default_factory=utc_now,
    )
    updated_at: datetime.datetime = Field(
        sa_type=sa.DateTime(timezone=True),
        nullable=False,
        default_factory=utc_now,
    )


class Event(BaseModel, table=True):
    id: uuid.UUID = Field(default=None, sa_column=sa.Column(SA_UUID, default=uuid.uuid4, primary_key=True))
    storage_id: str
    message: str
    title: str
    description: str
    tx: str | None = None


class Hero(BaseModel, table=True):
    address: str = Field(primary_key=True)
    tx: str
    owner: str


class HeroEvent(BaseModel, table=True):
    tx: str = Field(primary_key=True)
    hero_address: str
    change: dict = Field(sa_column=Column(JSONB), default={})
    message: str
