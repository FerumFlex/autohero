from __future__ import annotations
import typing
from solders.pubkey import Pubkey
from solders.system_program import ID as SYS_PROGRAM_ID
from solders.instruction import Instruction, AccountMeta
import borsh_construct as borsh
from ..program_id import PROGRAM_ID


class ApplyEventArgs(typing.TypedDict):
    message: int


layout = borsh.CStruct("message" / borsh.U128)


class ApplyEventAccounts(typing.TypedDict):
    hero: Pubkey
    events_storage: Pubkey
    signer: Pubkey


def apply_event(
    args: ApplyEventArgs,
    accounts: ApplyEventAccounts,
    program_id: Pubkey = PROGRAM_ID,
    remaining_accounts: typing.Optional[typing.List[AccountMeta]] = None,
) -> Instruction:
    keys: list[AccountMeta] = [
        AccountMeta(pubkey=accounts["hero"], is_signer=False, is_writable=True),
        AccountMeta(
            pubkey=accounts["events_storage"], is_signer=False, is_writable=False
        ),
        AccountMeta(pubkey=accounts["signer"], is_signer=True, is_writable=True),
        AccountMeta(pubkey=SYS_PROGRAM_ID, is_signer=False, is_writable=False),
    ]
    if remaining_accounts is not None:
        keys += remaining_accounts
    identifier = b"\x9f\x94k?.\xbc\xa6\xaa"
    encoded_args = layout.build(
        {
            "message": args["message"],
        }
    )
    data = identifier + encoded_args
    return Instruction(program_id, data, keys)
