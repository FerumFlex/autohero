import asyncio
from typing import Any

from solana.rpc.async_api import AsyncClient
from solders.signature import Signature

from config import settings


async def get_transaction_info(tx: str) -> dict[str, Any]:
    sig = Signature.from_string(tx)
    solana_client = AsyncClient(settings.anchor_provider_url)
    retries = 5

    while retries:
        tx_data = await solana_client.get_transaction(sig)
        if tx_data.value:
            break
        retries -= 1
        if not retries:
            raise Exception(f"Can not find transaction {tx}")
        await asyncio.sleep(3)

    return tx_data.value


def get_solana_logs(tx_data: Any) -> dict[str, str]:
    prefix = "Program log: "
    logs = {}
    for log in tx_data.transaction.meta.log_messages:
        if log.startswith(prefix):
            key_value = log.removeprefix(prefix)
            key, value = key_value.split(": ")
            logs[key.lower()] = value
    return logs
