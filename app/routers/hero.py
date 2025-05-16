import datetime

import sqlalchemy as sa
from chain import generate_hero_name
from datatypes import HeroNameRequest, HeroNameResponse, HeroRequest, PaginationResponse
from db.base import AsyncSession, get_session
from db.helpers import get_count, get_scalars
from fastapi import APIRouter, Depends
from models import Hero
from solana_utils import get_hero_props_and_address, get_transaction_info

router = APIRouter()


@router.post("/hero")
async def create_hero(
    hero_request: HeroRequest, session: AsyncSession = Depends(get_session)
) -> Hero:
    tx_data = await get_transaction_info(hero_request.tx)
    mint_address = tx_data.transaction.meta.post_token_balances[0].mint
    owner_address = tx_data.transaction.meta.post_token_balances[0].owner

    hero_address, hero_props = await get_hero_props_and_address(str(mint_address))
    query = sa.select(Hero).where(Hero.address == str(mint_address))
    result = await session.exec(query)
    hero = result.scalars().first()
    if not hero:
        hero = Hero(
            address=str(mint_address),
            owner=str(owner_address),
            tx=hero_request.tx,
            hero_props=hero_props,
            address_hero_data=str(hero_address),
            chain_data_updated_at=datetime.datetime.now(tz=datetime.timezone.utc),
        )
        session.add(hero)
        await session.commit()
    return hero


@router.get("/hero/{address}")
async def get_hero(
    address: str,
    session: AsyncSession = Depends(get_session),
) -> Hero:
    query = sa.select(Hero).where(Hero.address == address)
    result = await session.exec(query)
    return result.scalars().first()


@router.get("/hero/owner/{address}")
async def get_heros_by_owner(
    address: str,
    session: AsyncSession = Depends(get_session),
) -> list[Hero]:
    query = sa.select(Hero).where(Hero.owner == address)
    result = await session.exec(query)

    data = [row for row in result.scalars().all()]
    return data


@router.post("/hero/generate_name")
async def generate_name(
    hero_name_request: HeroNameRequest,
) -> HeroNameResponse:
    name = generate_hero_name(hero_name_request.race)
    return HeroNameResponse(**hero_name_request.model_dump(), name=name)


@router.get("/hero")
async def get_heroes(
    limit: int = 10,
    offset: int = 0,
    session: AsyncSession = Depends(get_session),
) -> PaginationResponse[Hero]:
    query = sa.select(Hero)
    query = query.order_by(Hero.hero_props["exp"].desc())

    result = await get_scalars(query, limit, offset)
    count = await get_count(query, Hero.address)

    return PaginationResponse(
        list=result,
        count=count,
        limit=limit,
        offset=offset,
    )
