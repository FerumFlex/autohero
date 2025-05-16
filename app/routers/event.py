from typing import List

import sqlalchemy as sa
from chain import generage_apply_event
from datatypes import ApplyEventRequest
from db.base import AsyncSession, get_session
from fastapi import APIRouter, Depends
from models import Event, HeroEvent
from solana_utils import get_solana_logs, get_transaction_info

router = APIRouter()


@router.get("/events")
async def get_events(
    storage_id: str | None = None, session: AsyncSession = Depends(get_session)
) -> List[Event]:
    query = sa.select(Event).order_by(Event.created_at.desc()).limit(10)
    if storage_id:
        query = query.where(Event.storage_id == storage_id)
    results = (await session.exec(query)).scalars().all()
    return results


@router.post("/events/apply")
async def aevents_apply(
    apply_request: ApplyEventRequest, session: AsyncSession = Depends(get_session)
) -> HeroEvent:
    tx_data = await get_transaction_info(apply_request.tx)

    logs = get_solana_logs(tx_data.transaction.meta.log_messages)

    query = sa.select(Event).where(Event.id == apply_request.event)
    event = (await session.exec(query)).scalars().first()
    assert event

    hero = logs.pop("hero")

    if "get money" in logs:
        try:
            logs["get money"] = int(logs["get money"]) / 10**6
        except (KeyError, ValueError):
            pass

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
