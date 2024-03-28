from __future__ import annotations
import typing
from dataclasses import dataclass
from construct import Container
import borsh_construct as borsh


class EventJSON(typing.TypedDict):
    timestamp: int
    message: int


@dataclass
class Event:
    layout: typing.ClassVar = borsh.CStruct(
        "timestamp" / borsh.I64, "message" / borsh.U128
    )
    timestamp: int
    message: int

    @classmethod
    def from_decoded(cls, obj: Container) -> "Event":
        return cls(timestamp=obj.timestamp, message=obj.message)

    def to_encodable(self) -> dict[str, typing.Any]:
        return {"timestamp": self.timestamp, "message": self.message}

    def to_json(self) -> EventJSON:
        return {"timestamp": self.timestamp, "message": self.message}

    @classmethod
    def from_json(cls, obj: EventJSON) -> "Event":
        return cls(timestamp=obj["timestamp"], message=obj["message"])
