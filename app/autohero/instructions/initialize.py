from __future__ import annotations
import typing
from solders.pubkey import Pubkey
from solders.system_program import ID as SYS_PROGRAM_ID
from solders.instruction import Instruction, AccountMeta
import borsh_construct as borsh
from ..program_id import PROGRAM_ID


class InitializeArgs(typing.TypedDict):
    random: int


layout = borsh.CStruct("random" / borsh.U64)


class InitializeAccounts(typing.TypedDict):
    new_account: Pubkey
    signer: Pubkey


def initialize(
    args: InitializeArgs,
    accounts: InitializeAccounts,
    program_id: Pubkey = PROGRAM_ID,
    remaining_accounts: typing.Optional[typing.List[AccountMeta]] = None,
) -> Instruction:
    keys: list[AccountMeta] = [
        AccountMeta(pubkey=accounts["new_account"], is_signer=True, is_writable=True),
        AccountMeta(pubkey=accounts["signer"], is_signer=True, is_writable=True),
        AccountMeta(pubkey=SYS_PROGRAM_ID, is_signer=False, is_writable=False),
    ]
    if remaining_accounts is not None:
        keys += remaining_accounts
    identifier = b"\xaf\xafm\x1f\r\x98\x9b\xed"
    encoded_args = layout.build(
        {
            "random": args["random"],
        }
    )
    data = identifier + encoded_args
    return Instruction(program_id, data, keys)
