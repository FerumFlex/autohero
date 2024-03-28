from __future__ import annotations
import typing
from solders.pubkey import Pubkey
from solders.system_program import ID as SYS_PROGRAM_ID
from solders.instruction import Instruction, AccountMeta
from ..program_id import PROGRAM_ID


class InitializeStorageAccounts(typing.TypedDict):
    events_storage: Pubkey
    signer: Pubkey


def initialize_storage(
    accounts: InitializeStorageAccounts,
    program_id: Pubkey = PROGRAM_ID,
    remaining_accounts: typing.Optional[typing.List[AccountMeta]] = None,
) -> Instruction:
    keys: list[AccountMeta] = [
        AccountMeta(
            pubkey=accounts["events_storage"], is_signer=True, is_writable=True
        ),
        AccountMeta(pubkey=accounts["signer"], is_signer=True, is_writable=True),
        AccountMeta(pubkey=SYS_PROGRAM_ID, is_signer=False, is_writable=False),
    ]
    if remaining_accounts is not None:
        keys += remaining_accounts
    identifier = b"\xbe\x81n\x95\xbc\x99\x8e\x83"
    encoded_args = b""
    data = identifier + encoded_args
    return Instruction(program_id, data, keys)
