import asyncio
import random

import click
import sqlalchemy as sa
from anchorpy import Provider
from chain import EventLLM, generate_description_title
from config import settings
from db.base import async_session
from logger import logger
from models import Event, Hero
from solana.rpc.api import Client
from solana_utils import get_discriminator
from solders.instruction import AccountMeta, Instruction
from solders.message import Message
from solders.pubkey import Pubkey
from solders.system_program import ID as SYS_PROGRAM_ID
from solders.transaction import Transaction

MAX_EVENT = 2**128


async def save_event(event_llm: EventLLM, message: int, storage_id: str, tx: str):
    async with async_session() as session:
        event = Event(
            message=str(message),
            storage_id=storage_id,
            title=event_llm.title,
            description=event_llm.description,
            choices=[choice.model_dump() for choice in event_llm.choices],
            tx=tx,
        )
        session.add(event)
        await session.commit()


def set_nth_byte(num: int, n: int, byte_val: int) -> int:
    """
    Set the n-th byte (0-indexed from the right) of an integer to a specific byte value.

    Parameters:
    - num: The original integer.
    - n: The index of the byte to set (0 = least significant byte).
    - byte_val: The new byte value (0 to 255).

    Returns:
    - Modified integer with the n-th byte set to byte_val.
    """
    if not (0 <= byte_val <= 255):
        raise ValueError("byte_val must be in range 0..255")

    mask = 0xFF << (n * 8)
    num &= ~mask  # Clear the n-th byte
    num |= byte_val << (n * 8)  # Set the new byte
    return num


def count_bits(num: int) -> int:
    return bin(num).count("1")


async def generate_event_seed(
    hero_address: str | None = None, category: int = 0
) -> int:
    event_seed = random.randint(0, MAX_EVENT)

    if hero_address:
        async with async_session() as session:
            query = sa.select(Hero).where(Hero.address == hero_address)
            hero = (await session.exec(query)).scalars().first()
            if hero:
                selector = int(hero.hero_props["selector"])
                event_seed = set_nth_byte(event_seed, 0, selector)
                event_seed = set_nth_byte(event_seed, 1, 0)
                event_seed = set_nth_byte(event_seed, 2, category)

    return event_seed


async def generate_event(event_seed: int):
    # generate event with tries
    tries = 5
    while tries:
        try:
            event_llm = generate_description_title()
            break
        except Exception:
            tries -= 1
    assert event_llm

    client = Client(settings.anchor_provider_url, timeout=30)
    provider = Provider.env()

    recent_blockhash_resp = client.get_latest_blockhash()
    recent_blockhash = recent_blockhash_resp.value.blockhash

    events_pda, _ = Pubkey.find_program_address(
        [b"events_storage"], settings.program_id_key()
    )

    # build data: 8-byte discriminator + little-endian seed
    discriminator = get_discriminator("global", "add_event")
    data = discriminator + event_seed.to_bytes(64, "little")

    ix = Instruction(
        program_id=settings.program_id_key(),
        accounts=[
            AccountMeta(events_pda, is_signer=False, is_writable=True),
            AccountMeta(provider.wallet.public_key, is_signer=True, is_writable=False),
            AccountMeta(SYS_PROGRAM_ID, is_signer=False, is_writable=False),
        ],
        data=data,
    )
    message = Message([ix], provider.wallet.public_key)

    tx = Transaction(
        from_keypairs=[provider.wallet.payer],
        message=message,
        recent_blockhash=recent_blockhash,
    )

    res = await provider.send(tx)

    logger.info(f"Transaction {res}")
    await save_event(event_llm, event_seed, settings.storage_address(), str(res))


@click.command()
@click.option("--count", type=int, help="Count of events to generate", default=1)
@click.option("--hero", type=str, help="Hero address", default=None)
@click.option("--category", type=int, help="category of event", default=None)
def add_event_command(count: int, hero: str | None = None, category: int | None = None):

    async def generate_seed_event():
        seed = await generate_event_seed(hero, category)
        await generate_event(seed)

    for _ in range(count):
        asyncio.run(generate_seed_event())


if __name__ == "__main__":
    add_event_command()
