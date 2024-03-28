import typing
from dataclasses import dataclass
from solders.pubkey import Pubkey
from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Commitment
import borsh_construct as borsh
from anchorpy.coder.accounts import ACCOUNT_DISCRIMINATOR_SIZE
from anchorpy.error import AccountInvalidDiscriminator
from anchorpy.utils.rpc import get_multiple_accounts
from anchorpy.borsh_extension import BorshPubkey
from ..program_id import PROGRAM_ID
from .. import types


class EventStorageJSON(typing.TypedDict):
    owner: str
    events: list[types.event.EventJSON]
    number: int
    total: int


@dataclass
class EventStorage:
    discriminator: typing.ClassVar = b"Z\x88\xf5\xd0\x16l\xc9\xd5"
    layout: typing.ClassVar = borsh.CStruct(
        "owner" / BorshPubkey,
        "events" / types.event.Event.layout[10],
        "number" / borsh.U8,
        "total" / borsh.U128,
    )
    owner: Pubkey
    events: list[types.event.Event]
    number: int
    total: int

    @classmethod
    async def fetch(
        cls,
        conn: AsyncClient,
        address: Pubkey,
        commitment: typing.Optional[Commitment] = None,
        program_id: Pubkey = PROGRAM_ID,
    ) -> typing.Optional["EventStorage"]:
        resp = await conn.get_account_info(address, commitment=commitment)
        info = resp.value
        if info is None:
            return None
        if info.owner != program_id:
            raise ValueError("Account does not belong to this program")
        bytes_data = info.data
        return cls.decode(bytes_data)

    @classmethod
    async def fetch_multiple(
        cls,
        conn: AsyncClient,
        addresses: list[Pubkey],
        commitment: typing.Optional[Commitment] = None,
        program_id: Pubkey = PROGRAM_ID,
    ) -> typing.List[typing.Optional["EventStorage"]]:
        infos = await get_multiple_accounts(conn, addresses, commitment=commitment)
        res: typing.List[typing.Optional["EventStorage"]] = []
        for info in infos:
            if info is None:
                res.append(None)
                continue
            if info.account.owner != program_id:
                raise ValueError("Account does not belong to this program")
            res.append(cls.decode(info.account.data))
        return res

    @classmethod
    def decode(cls, data: bytes) -> "EventStorage":
        if data[:ACCOUNT_DISCRIMINATOR_SIZE] != cls.discriminator:
            raise AccountInvalidDiscriminator(
                "The discriminator for this account is invalid"
            )
        dec = EventStorage.layout.parse(data[ACCOUNT_DISCRIMINATOR_SIZE:])
        return cls(
            owner=dec.owner,
            events=list(
                map(lambda item: types.event.Event.from_decoded(item), dec.events)
            ),
            number=dec.number,
            total=dec.total,
        )

    def to_json(self) -> EventStorageJSON:
        return {
            "owner": str(self.owner),
            "events": list(map(lambda item: item.to_json(), self.events)),
            "number": self.number,
            "total": self.total,
        }

    @classmethod
    def from_json(cls, obj: EventStorageJSON) -> "EventStorage":
        return cls(
            owner=Pubkey.from_string(obj["owner"]),
            events=list(
                map(lambda item: types.event.Event.from_json(item), obj["events"])
            ),
            number=obj["number"],
            total=obj["total"],
        )
