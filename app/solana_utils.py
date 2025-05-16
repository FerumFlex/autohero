import asyncio
import hashlib
from typing import Any

from anchorpy import Provider
from config import settings
from solana.constants import SYSTEM_PROGRAM_ID
from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Commitment, Finalized
from solders.instruction import AccountMeta, Instruction
from solders.message import Message
from solders.pubkey import Pubkey
from solders.signature import Signature
from solders.transaction import Transaction


def get_client(commitment: Commitment = Finalized) -> AsyncClient:
    return AsyncClient(
        settings.anchor_provider_url,
        timeout=10,
        commitment=commitment,
    )


def get_discriminator(namespace: str, name: str) -> bytes:
    preimage = f"{namespace}:{name}".encode()
    return hashlib.sha256(preimage).digest()[:8]


async def get_transaction_info(tx: str, retries: int = 5) -> dict[str, Any]:
    solana_client = get_client()

    sig = Signature.from_string(tx)
    while retries:
        tx_data = await solana_client.get_transaction(sig)
        if tx_data.value:
            break
        retries -= 1
        if not retries:
            raise Exception(f"Can not find transaction {tx}")
        await asyncio.sleep(5)

    return tx_data.value


def get_solana_logs(logs_messages: list[str]) -> dict[str, str]:
    prefix = "Program log: "
    logs = {}
    for log in logs_messages:
        if not log.startswith(prefix):
            continue

        key_value = log.removeprefix(prefix)
        if ": " not in key_value:
            continue

        key, value = key_value.split(": ", 1)
        logs[key.lower()] = value

    del logs["instruction"]
    return logs


async def get_hero_props(hero_address: str) -> dict[str, str]:
    solana_client = get_client()

    provider = Provider.env()
    payer = provider.wallet.payer

    keys: list[AccountMeta] = [
        AccountMeta(
            pubkey=Pubkey.from_string(hero_address), is_signer=False, is_writable=False
        ),
        AccountMeta(pubkey=SYSTEM_PROGRAM_ID, is_signer=False, is_writable=False),
    ]
    data = get_discriminator("global", "info")

    ix = Instruction(
        program_id=settings.program_id_key(),
        data=data,
        accounts=keys,
    )
    message = Message(instructions=[ix], payer=payer.pubkey())
    recent_blockhash_resp = await solana_client.get_latest_blockhash()
    recent_blockhash = recent_blockhash_resp.value.blockhash

    tx = Transaction(
        from_keypairs=[payer],
        recent_blockhash=recent_blockhash,
        message=message,
    )

    response = await solana_client.simulate_transaction(tx, sig_verify=False)
    return get_solana_logs(response.value.logs)


async def get_hero_props_and_address(mint_address: str) -> tuple[str, dict]:
    mint_address_key = Pubkey.from_string(mint_address)
    hero_address, _ = Pubkey.find_program_address(
        seeds=[
            b"nft_data",
            bytes(mint_address_key),
        ],
        program_id=settings.program_id_key(),
    )
    hero_address = str(hero_address)
    hero_props = await get_hero_props(hero_address)
    return hero_address, hero_props
