from typing import Any

import sqlalchemy as sa
from db.base import current_session


async def get_count(query, column: Any | None = None) -> int:
    if column:
        count_query = query.with_only_columns(sa.func.count(column))
    else:
        count_query = query.with_only_columns(sa.func.count())
    count_query = count_query.order_by(None).limit(None).offset(None)
    result = await current_session.execute(count_query)
    count = result.scalar() or 0
    return count


async def get_scalars(
    query, limit: int | None = None, offset: int | None = None
) -> list[any]:
    if limit is not None:
        query = query.limit(limit)
    if offset is not None:
        query = query.offset(offset)
    result = await current_session.execute(query)
    return result.scalars().all()


async def get_mappings(
    query, limit: int | None = None, offset: int | None = None
) -> list[dict]:
    if limit is not None:
        query = query.limit(limit)
    if offset is not None:
        query = query.offset(offset)
    result = await current_session.execute(query)
    return result.mappings().all()


async def get_scalar(query) -> any:
    result = await current_session.execute(query)
    return result.scalars().one_or_none()
