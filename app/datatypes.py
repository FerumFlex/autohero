from typing import Generic, List, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class PaginationResponse(BaseModel, Generic[T]):
    """
    Pagination response for a list of items.
    """

    list: List[T]
    count: int
    limit: int
    offset: int


class HeroRequest(BaseModel):
    """
    Request for a hero.
    """

    tx: str


class HeroNameRequest(BaseModel):
    """
    Request for a hero name.
    """

    race: str | None = None


class HeroNameResponse(BaseModel):
    """
    Response for a hero name.
    """

    race: str | None = None
    name: str


class ApplyEventRequest(BaseModel):
    """
    Request for applying an event.
    """

    tx: str
    event: str
