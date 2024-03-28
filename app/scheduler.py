import asyncio
from zoneinfo import ZoneInfo

import sentry  # noqa
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore

from config import settings
from logger import logger
from add_event import generate_event


async def add_event():
    logger.info("Adding event")
    await generate_event()


def start_scheduler():
    logger.info("Starting scheduler")

    database_uri = settings.database_url.replace("+asyncpg", "")
    jobstores = {"tron": SQLAlchemyJobStore(url=database_uri, tablename="tron_jobs")}
    scheduler = AsyncIOScheduler(timezone=ZoneInfo("Europe/Kiev"), jobstores=jobstores)

    scheduler.add_job(
        add_event,
        "cron",
        second="0",
        minute="*",
        id="add_event",
        misfire_grace_time=60,
        replace_existing=True,
    )
    scheduler.start()

if __name__ == "__main__":
    start_scheduler()
    asyncio.get_event_loop().run_forever()
