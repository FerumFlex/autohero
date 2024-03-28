import typing
from anchorpy.error import ProgramError


class EventCannotbeApplied(ProgramError):
    def __init__(self) -> None:
        super().__init__(6000, "Can not apply event")

    code = 6000
    name = "EventCannotbeApplied"
    msg = "Can not apply event"


class EventIsApplied(ProgramError):
    def __init__(self) -> None:
        super().__init__(6001, "Event is applied")

    code = 6001
    name = "EventIsApplied"
    msg = "Event is applied"


CustomError = typing.Union[EventCannotbeApplied, EventIsApplied]
CUSTOM_ERROR_MAP: dict[int, CustomError] = {
    6000: EventCannotbeApplied(),
    6001: EventIsApplied(),
}


def from_code(code: int) -> typing.Optional[CustomError]:
    maybe_err = CUSTOM_ERROR_MAP.get(code)
    if maybe_err is None:
        return None
    return maybe_err
