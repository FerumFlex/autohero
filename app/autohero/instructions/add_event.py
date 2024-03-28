from __future__ import annotations
import typing
from solders.pubkey import Pubkey
from solders.system_program import ID as SYS_PROGRAM_ID
from solders.instruction import Instruction, AccountMeta
import borsh_construct as borsh
from ..program_id import PROGRAM_ID


class AddEventArgs(typing.TypedDict):
    message: int


layout = borsh.CStruct("message" / borsh.U128)


class AddEventAccounts(typing.TypedDict):
    events_storage: Pubkey
    signer: Pubkey


def add_event(
    args: AddEventArgs,
    accounts: AddEventAccounts,
    program_id: Pubkey = PROGRAM_ID,
    remaining_accounts: typing.Optional[typing.List[AccountMeta]] = None,
) -> Instruction:
    keys: list[AccountMeta] = [
        AccountMeta(
            pubkey=accounts["events_storage"], is_signer=False, is_writable=True
        ),
        AccountMeta(pubkey=accounts["signer"], is_signer=True, is_writable=True),
        AccountMeta(pubkey=SYS_PROGRAM_ID, is_signer=False, is_writable=False),
    ]
    if remaining_accounts is not None:
        keys += remaining_accounts
    identifier = b"\xc3\xec\xba\t\x14t\x8e\x16"
    encoded_args = layout.build(
        {
            "message": args["message"],
        }
    )
    data = identifier + encoded_args
    return Instruction(program_id, data, keys)
