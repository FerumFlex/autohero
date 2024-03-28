import asyncio
import random
import os

from solana.transaction import Transaction
from solders.pubkey import Pubkey
from anchorpy import Provider
from autohero.instructions import add_event, AddEventArgs
from config import settings
from models import Event
from db.base import async_session
from chain import generate_description_title, EventLLM
from logger import logger


MAX_EVENT = 2 ** 128
os.environ["ANCHOR_PROVIDER_URL"] = settings.anchor_provider_url
os.environ["ANCHOR_WALLET"] = "wallet.json"


async def save_event(event_llm: EventLLM, message: int, storage_id: str, tx: str):
    async with async_session() as session:
        event = Event(
            message=str(message),
            storage_id=storage_id,
            title=event_llm.title,
            description=event_llm.description,
            tx=tx,
        )
        session.add(event)
        await session.commit()


async def generate_event():
    message = random.randint(0, MAX_EVENT)
    provider = Provider.env()
    recent_blockhash = await provider.connection.get_latest_blockhash(commitment="finalized")

    # generate event with tries
    tries = 5
    while tries:
        try:
            event_llm = generate_description_title()
            break
        except Exception:
            tries -= 1
    assert event_llm

    event = AddEventArgs(message=message)

    ix = add_event(
        event,
        accounts={
            "events_storage": Pubkey.from_string(settings.storage_address),
            "signer": provider.wallet.public_key,
        }
    )
    tx = Transaction(recent_blockhash=recent_blockhash.value.blockhash).add(ix)
    tx.sign(provider.wallet.payer)

    res = await provider.send(tx)
    logger.info(f"Transaction {res}")
    await save_event(event_llm, message, settings.storage_address, str(res))


if __name__ == "__main__":
    asyncio.run(generate_event())
