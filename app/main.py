from typing import List

import sentry  # noqa

import sqlalchemy as sa
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from models import Event, Hero, HeroEvent
from db.base import get_session, AsyncSession
from solana_utils import get_transaction_info, get_solana_logs
from chain import generage_apply_event
from pydantic import BaseModel


app = FastAPI(
    openapi_url="/openapi.json" if settings.debug else None,
    debug=True,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "OK"}


@app.get("/events")
async def get_events(
    storage_id: str | None = None,
    session: AsyncSession = Depends(get_session)
) -> List[Event]:
    query = (
        sa.select(Event)
        .order_by(Event.created_at.desc())
        .limit(10)
    )
    if storage_id:
        query = query.where(Event.storage_id == storage_id)
    results = (await session.exec(query)).scalars().all()
    return results


class ApplyEventRequest(BaseModel):
    tx: str
    event: str


@app.post("/events/apply")
async def aevents_apply(
    apply_request: ApplyEventRequest,
    session: AsyncSession = Depends(get_session)
) -> HeroEvent:
    tx_data = await get_transaction_info(apply_request.tx)

    logs = get_solana_logs(tx_data)
    del logs["instruction"]

    query = sa.select(Event).where(Event.id == apply_request.event)
    event = (await session.exec(query)).scalars().first()
    assert event

    hero = logs.pop("hero")
    message = generage_apply_event(
        event=event,
        change=logs,
    )

    hero_event = HeroEvent(
        tx=apply_request.tx,
        hero_address=hero,
        change=logs,
        message=message,
    )
    session.add(hero_event)
    await session.commit()
    return hero_event


class HeroRequest(BaseModel):
    tx: str


@app.post("/hero")
async def create_hero(
    hero_request: HeroRequest,
    session: AsyncSession = Depends(get_session)
) -> Hero:
    tx_data = await get_transaction_info(hero_request.tx)
    logs = get_solana_logs(tx_data)

    if not (logs.get("instruction") == "Initialize" and logs.get("owner") and logs.get("hero")):
        raise Exception(f"Can not find user creation in transaction {hero_request.tx}")

    result = await session.exec(sa.select(Hero).where(Hero.address == logs["hero"]))
    hero = result.scalars().first()
    if not hero:
        hero = Hero(address=logs["hero"], owner=logs["owner"], tx=hero_request.tx)
        session.add(hero)
        await session.commit()
    return hero