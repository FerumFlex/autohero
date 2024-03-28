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


class HeroJSON(typing.TypedDict):
    owner: str
    random: int
    created: int
    additional_exp: int
    base_attack: int
    base_defense: int
    delta_hitpoints: int
    delta_hitpoints_update: int
    applied_events: list[int]
    applied_events_index: int


@dataclass
class Hero:
    discriminator: typing.ClassVar = b"\x0c?'\x1e\xb7\xe5\x9a\xac"
    layout: typing.ClassVar = borsh.CStruct(
        "owner" / BorshPubkey,
        "random" / borsh.U64,
        "created" / borsh.I64,
        "additional_exp" / borsh.U32,
        "base_attack" / borsh.I32,
        "base_defense" / borsh.I32,
        "delta_hitpoints" / borsh.I32,
        "delta_hitpoints_update" / borsh.I64,
        "applied_events" / borsh.U128[10],
        "applied_events_index" / borsh.U8,
    )
    owner: Pubkey
    random: int
    created: int
    additional_exp: int
    base_attack: int
    base_defense: int
    delta_hitpoints: int
    delta_hitpoints_update: int
    applied_events: list[int]
    applied_events_index: int

    @classmethod
    async def fetch(
        cls,
        conn: AsyncClient,
        address: Pubkey,
        commitment: typing.Optional[Commitment] = None,
        program_id: Pubkey = PROGRAM_ID,
    ) -> typing.Optional["Hero"]:
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
    ) -> typing.List[typing.Optional["Hero"]]:
        infos = await get_multiple_accounts(conn, addresses, commitment=commitment)
        res: typing.List[typing.Optional["Hero"]] = []
        for info in infos:
            if info is None:
                res.append(None)
                continue
            if info.account.owner != program_id:
                raise ValueError("Account does not belong to this program")
            res.append(cls.decode(info.account.data))
        return res

    @classmethod
    def decode(cls, data: bytes) -> "Hero":
        if data[:ACCOUNT_DISCRIMINATOR_SIZE] != cls.discriminator:
            raise AccountInvalidDiscriminator(
                "The discriminator for this account is invalid"
            )
        dec = Hero.layout.parse(data[ACCOUNT_DISCRIMINATOR_SIZE:])
        return cls(
            owner=dec.owner,
            random=dec.random,
            created=dec.created,
            additional_exp=dec.additional_exp,
            base_attack=dec.base_attack,
            base_defense=dec.base_defense,
            delta_hitpoints=dec.delta_hitpoints,
            delta_hitpoints_update=dec.delta_hitpoints_update,
            applied_events=dec.applied_events,
            applied_events_index=dec.applied_events_index,
        )

    def to_json(self) -> HeroJSON:
        return {
            "owner": str(self.owner),
            "random": self.random,
            "created": self.created,
            "additional_exp": self.additional_exp,
            "base_attack": self.base_attack,
            "base_defense": self.base_defense,
            "delta_hitpoints": self.delta_hitpoints,
            "delta_hitpoints_update": self.delta_hitpoints_update,
            "applied_events": self.applied_events,
            "applied_events_index": self.applied_events_index,
        }

    @classmethod
    def from_json(cls, obj: HeroJSON) -> "Hero":
        return cls(
            owner=Pubkey.from_string(obj["owner"]),
            random=obj["random"],
            created=obj["created"],
            additional_exp=obj["additional_exp"],
            base_attack=obj["base_attack"],
            base_defense=obj["base_defense"],
            delta_hitpoints=obj["delta_hitpoints"],
            delta_hitpoints_update=obj["delta_hitpoints_update"],
            applied_events=obj["applied_events"],
            applied_events_index=obj["applied_events_index"],
        )
