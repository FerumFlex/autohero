import datetime
import uuid

import sqlalchemy as sa
from pydantic import BaseModel
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as SA_UUID
from sqlmodel import Column, Field, SQLModel


def utc_now():
    return datetime.datetime.now(tz=datetime.timezone.utc)


class SqlBaseModel(SQLModel, table=False):
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


class Choice(BaseModel):
    text: str
    consequence: str


class Event(SqlBaseModel, table=True):
    id: uuid.UUID = Field(
        default=None, sa_column=sa.Column(SA_UUID, default=uuid.uuid4, primary_key=True)
    )
    storage_id: str
    message: str
    title: str
    description: str
    choices: list[Choice] = Field(sa_column=Column(JSONB), default=[])
    tx: str | None = None


class Hero(SqlBaseModel, table=True):
    address: str = Field(primary_key=True)
    tx: str

    # chain data
    owner: str
    hero_props: dict = Field(sa_type=JSONB, nullable=False)
    address_hero_data: str = Field(nullable=False)
    chain_data_updated_at: datetime.datetime = Field(
        sa_type=sa.DateTime(timezone=True),
        nullable=True,
        default_factory=utc_now,
    )


class HeroEvent(SqlBaseModel, table=True):
    tx: str = Field(primary_key=True)
    hero_address: str
    change: dict = Field(sa_column=Column(JSONB), default={})
    message: str
