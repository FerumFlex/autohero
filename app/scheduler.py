import asyncio
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

import sentry  # noqa
import sqlalchemy as sa
from add_event import generate_event, generate_event_seed
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from config import settings
from db.base import async_session
from logger import logger
from models import Hero
from routers.hero import get_hero_props_and_address


async def add_event():
    logger.info("Adding event")
    seed = await generate_event_seed()
    await generate_event(seed)


async def update_heroes_data():
    logger.info("Updating heroes data")

    async with async_session() as session:
        query = sa.select(Hero)
        heroes = (await session.exec(query)).scalars().all()

    for hero in heroes:
        _, hero_props = await get_hero_props_and_address(hero.address)

        async with async_session() as session:
            hero.hero_props = hero_props
            hero.chain_data_updated_at = datetime.now(timezone.utc)

            session.add(hero)
            await session.commit()


async def start_scheduler():
    logger.info("Starting scheduler")

    database_uri = settings.database_url.replace("+asyncpg", "")
    jobstores = {"tron": SQLAlchemyJobStore(url=database_uri, tablename="tron_jobs")}
    scheduler = AsyncIOScheduler(timezone=ZoneInfo("Europe/Kiev"), jobstores=jobstores)

    scheduler.add_job(
        add_event,
        "cron",
        second="0",
        minute="*/10",
        id="add_event",
        misfire_grace_time=60,
        replace_existing=True,
    )
    scheduler.add_job(
        update_heroes_data,
        "cron",
        second="0",
        minute="*/5",
        id="update_heroes_data",
        misfire_grace_time=60,
        replace_existing=True,
    )
    scheduler.start()


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(start_scheduler())
    loop.run_forever()
